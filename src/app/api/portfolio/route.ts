import { NextResponse } from "next/server";
import marketJson from "@data/market.json";
import positionsJson from "@data/positions.json";
import {
  computeBook,
  inceptionUnixSec,
  type CandleSeries,
  type PortfolioPositionInput,
} from "@/lib/portfolio-engine";
import { fetchQuote, finnhubConfigured } from "@/lib/finnhub";
import { fetchYfCandles, fetchYfQuote } from "@/lib/yahoo-finance";
import type { BlotterRow, PortfolioApiResponse } from "@/types/portfolio-api";
import type { MarketConfig } from "@/types/data";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const FETCH_GAP_MS = 110;

type PosRow = PortfolioPositionInput;

function leanFromMarket(v: string): "base" | "delay" | "severity" | "blackswan" {
  if (v === "delay" || v === "severity" || v === "blackswan") return v;
  return "base";
}

export async function GET() {
  const market = marketJson as MarketConfig;
  const positions = positionsJson as PosRow[];
  const inception = market.inceptionDate;
  const startingNav = market.startingNav;
  const bench = market.benchmarkTicker.toUpperCase();
  const inceptionSec = inceptionUnixSec(inception);
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

  // Exclude CASH from market data fetches — fixed price of $1.
  const tickers = [...new Set(
    inputs.filter((p) => p.ticker.toUpperCase() !== "CASH").map((p) => p.ticker.toUpperCase()),
  )];
  const warnings: string[] = [];

  // --- Candles: Yahoo Finance (free, no key required) ---
  async function loadCandles(symbol: string, offlineFallback: number): Promise<CandleSeries> {
    const out = await fetchYfCandles(symbol, fromSec);
    if (out.ok && out.data.t.length > 0) return out.data;
    warnings.push(`${symbol}: candles ${out.ok ? "empty" : out.kind}`);
    const p = offlineFallback > 0 ? offlineFallback : 100;
    return { t: [inceptionSec, inceptionSec + 86400], c: [p, p] };
  }

  const benchmarkSeries = await loadCandles(bench, offlineBench);
  await sleep(FETCH_GAP_MS);

  const symbolSeries: Record<string, CandleSeries> = {};
  symbolSeries["CASH"] = { t: [inceptionSec, inceptionSec + 86400], c: [1, 1] };

  for (const t of tickers) {
    const pos = inputs.find((p) => p.ticker.toUpperCase() === t);
    const off = pos?.offlinePrice ?? 100;
    symbolSeries[t] = await loadCandles(t, off);
    await sleep(FETCH_GAP_MS);
  }

  // --- Quotes: Finnhub if key present, otherwise Yahoo Finance ---
  const latestQuotes: Record<string, number | null> = {};
  for (const sym of [bench, ...tickers]) latestQuotes[sym] = null;
  latestQuotes["CASH"] = 1;

  for (const sym of [bench, ...tickers]) {
    let price: number | null = null;

    if (finnhubConfigured()) {
      const q = await fetchQuote(sym);
      if (q.ok) {
        price = q.price;
      } else {
        // Finnhub quote failed — fall through to Yahoo Finance.
        warnings.push(`${sym} finnhub: ${q.kind}`);
      }
      await sleep(FETCH_GAP_MS);
    }

    if (price == null) {
      const q = await fetchYfQuote(sym);
      if (q.ok) price = q.price;
      else warnings.push(`${sym} yf-quote: ${q.kind}`);
      await sleep(FETCH_GAP_MS);
    }

    latestQuotes[sym.toUpperCase()] = price;
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
      dataSource: "offline" as const,
      asOf: new Date().toISOString(),
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
    const entryPrice = sh !== 0 ? Math.abs(p.allocationUsd / sh) : px;
    const returnPct =
      p.allocationUsd !== 0 ? (unrealized / Math.abs(p.allocationUsd)) * 100 : 0;
    const contributionPct = totalPnl !== 0 ? (unrealized / totalPnl) * 100 : 0;
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
      priceSource: sym === "CASH" ? "offline" : priceSourceFor(sym),
    };
  });

  const series = book.dates.map((date, i) => ({
    date,
    nav: book.nav[i] ?? 0,
    benchNav: book.benchNav[i] ?? 0,
  }));

  const equityRows = blotter.filter((r) => r.ticker !== "CASH");
  const overallSource: PortfolioApiResponse["dataSource"] = equityRows.some(
    (r) => r.priceSource === "live",
  )
    ? "live"
    : "close";

  const body: PortfolioApiResponse = {
    ok: true,
    warning: warnings.length ? warnings.join(" · ") : undefined,
    dataSource: overallSource,
    asOf: new Date().toISOString(),
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
