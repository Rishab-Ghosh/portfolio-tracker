import { NextResponse } from "next/server";
import marketJson from "@data/market.json";
import positionsJson from "@data/positions.json";
import {
  computeBook,
  inceptionUnixSec,
  type CandleSeries,
  type PortfolioPositionInput,
} from "@/lib/portfolio-engine";
import { fetchDailyCandles, fetchQuote, finnhubConfigured } from "@/lib/finnhub";
import type { BlotterRow, PortfolioApiResponse } from "@/types/portfolio-api";
import type { MarketConfig } from "@/types/data";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const FETCH_GAP_MS = 110;

type PosRow = PortfolioPositionInput;

function leanFromMarket(v: string): "bull" | "base" | "bear" {
  if (v === "bull" || v === "bear") return v;
  return "base";
}

export async function GET() {
  const market = marketJson as MarketConfig;
  const positions = positionsJson as PosRow[];
  const inception = market.inceptionDate;
  const startingNav = market.startingNav;
  const bench = market.benchmarkTicker.toUpperCase();
  const inceptionSec = inceptionUnixSec(inception);
  const nowSec = Math.floor(Date.now() / 1000);
  const fromSec = inceptionSec - 45 * 86_400;
  const offlineBench = market.offlineBenchmarkPrice ?? 400;

  const inputs: PortfolioPositionInput[] = positions.map((p) => ({
    ticker: p.ticker,
    company: p.company,
    side: p.side,
    category: p.category,
    allocationUsd: p.allocationUsd,
    thesisLine: p.thesisLine,
    status: p.status,
    offlinePrice: p.offlinePrice,
  }));

  const tickers = [...new Set(inputs.map((p) => p.ticker.toUpperCase()))];
  const warnings: string[] = [];

  async function loadCandles(symbol: string, offlineFallback: number): Promise<CandleSeries> {
    if (finnhubConfigured()) {
      const out = await fetchDailyCandles(symbol, fromSec, nowSec);
      if (out.ok && out.data.t.length > 0) {
        return { t: out.data.t, c: out.data.c };
      }
      warnings.push(
        !out.ok
          ? `${symbol}: ${out.kind}`
          : `${symbol}: no historical candles`,
      );
    }
    const p = offlineFallback > 0 ? offlineFallback : 100;
    return { t: [inceptionSec, nowSec], c: [p, p] };
  }

  const benchmarkSeries = await loadCandles(bench, offlineBench);
  await sleep(FETCH_GAP_MS);

  const symbolSeries: Record<string, CandleSeries> = {};
  for (const t of tickers) {
    const pos = inputs.find((p) => p.ticker.toUpperCase() === t);
    const off = pos?.offlinePrice ?? 100;
    symbolSeries[t] = await loadCandles(t, off);
    await sleep(FETCH_GAP_MS);
  }

  const latestQuotes: Record<string, number | null> = {};
  for (const sym of [bench, ...tickers]) {
    latestQuotes[sym] = null;
  }

  if (finnhubConfigured()) {
    for (const sym of [bench, ...tickers]) {
      const q = await fetchQuote(sym);
      const u = sym.toUpperCase();
      if (q.ok) latestQuotes[u] = q.price;
      else warnings.push(`${u} quote: ${q.kind}`);
      await sleep(FETCH_GAP_MS);
    }
  } else {
    latestQuotes[bench] = offlineBench;
    for (const t of tickers) {
      const pos = inputs.find((p) => p.ticker.toUpperCase() === t);
      latestQuotes[t] =
        pos?.offlinePrice != null && pos.offlinePrice > 0 ? pos.offlinePrice : null;
    }
  }

  const book = computeBook(
    inceptionSec,
    startingNav,
    bench,
    benchmarkSeries,
    symbolSeries,
    inputs,
    latestQuotes,
  );

  const currentLean = leanFromMarket(market.currentLean ?? "base");

  const fail = (extra?: string): NextResponse<PortfolioApiResponse> => {
    const w = [extra, ...warnings].filter(Boolean).join(" · ");
    return NextResponse.json({
      ok: false,
      warning: w || undefined,
      inceptionDate: inception,
      startingNav,
      benchmarkTicker: bench,
      currentLean,
      header: {
        currentNav: startingNav,
        totalReturnPct: 0,
        benchmarkReturnPct: 0,
        alphaVsBenchPct: 0,
        dayPnl: 0,
        dayPnlPct: 0,
      },
      stats: {
        totalPnl: 0,
        grossExposure: 0,
        netExposure: 0,
        positionCount: inputs.length,
      },
      series: [],
      positions: [],
    });
  };

  if (!book) {
    return fail("Portfolio engine could not align benchmark to inception.");
  }

  const n = book.nav.length;
  const currentNav = book.nav[n - 1] ?? startingNav;
  const prevNav = n >= 2 ? book.nav[n - 2]! : startingNav;
  const dayPnl = currentNav - prevNav;
  const dayPnlPct = prevNav !== 0 ? (dayPnl / prevNav) * 100 : 0;

  const benchLast = book.benchNav[n - 1] ?? startingNav;
  const totalReturnPct = (currentNav / startingNav - 1) * 100;
  const benchmarkReturnPct = (benchLast / startingNav - 1) * 100;
  const alphaVsBenchPct = totalReturnPct - benchmarkReturnPct;

  const totalPnl = currentNav - startingNav;

  let grossAbs = 0;
  let netSum = 0;
  for (const p of inputs) {
    const sym = p.ticker.toUpperCase();
    const sh = book.shares.get(sym) ?? 0;
    const px = book.lastPrices[sym] ?? 0;
    const mv = sh * px;
    grossAbs += Math.abs(mv);
    netSum += mv;
  }
  const grossExposure = currentNav !== 0 ? (grossAbs / currentNav) * 100 : 0;
  const netExposure = currentNav !== 0 ? (netSum / currentNav) * 100 : 0;

  const priceSourceFor = (sym: string): BlotterRow["priceSource"] => {
    if (!finnhubConfigured()) return "offline";
    const q = latestQuotes[sym.toUpperCase()];
    if (q != null && q > 0) return "live";
    return "close";
  };

  const blotter: BlotterRow[] = inputs.map((p) => {
    const sym = p.ticker.toUpperCase();
    const sh = book.shares.get(sym) ?? 0;
    const px = book.lastPrices[sym] ?? 0;
    const mv = sh * px;
    const unrealized = mv - p.allocationUsd;
    const entryPrice =
      sh !== 0 ? Math.abs(p.allocationUsd / sh) : px;
    const returnPct =
      p.allocationUsd !== 0
        ? (unrealized / Math.abs(p.allocationUsd)) * 100
        : 0;
    const contributionPct =
      totalPnl !== 0 ? (unrealized / totalPnl) * 100 : 0;
    const weightPct = (Math.abs(p.allocationUsd) / startingNav) * 100;

    return {
      ticker: p.ticker,
      company: p.company,
      side: p.side,
      category: p.category,
      weightPct,
      entryDate: inception,
      entryPrice,
      currentPrice: px,
      shares: sh,
      marketValue: mv,
      unrealizedPnl: unrealized,
      returnPct,
      contributionPct,
      thesisLine: p.thesisLine,
      status: p.status,
      priceSource: priceSourceFor(sym),
    };
  });

  const series = book.dates.map((date, i) => ({
    date,
    nav: book.nav[i] ?? 0,
    benchNav: book.benchNav[i] ?? 0,
  }));

  const body: PortfolioApiResponse = {
    ok: true,
    warning: warnings.length ? warnings.join(" · ") : undefined,
    inceptionDate: inception,
    startingNav,
    benchmarkTicker: bench,
    currentLean,
    header: {
      currentNav,
      totalReturnPct,
      benchmarkReturnPct,
      alphaVsBenchPct,
      dayPnl,
      dayPnlPct,
    },
    stats: {
      totalPnl,
      grossExposure,
      netExposure,
      positionCount: inputs.length,
    },
    series,
    positions: blotter,
  };

  return NextResponse.json(body);
}
