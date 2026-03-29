import positions from "@data/positions.json";
import market from "@data/market.json";
import { fetchDailyCandles, fetchQuote, finnhubConfigured } from "@/lib/finnhub";
import { toPublicQuoteRow } from "@/lib/quote-response";
import {
  buildRowMetrics,
  closeOnOrBefore,
  entryDateToUnixEndOfDay,
} from "@/lib/position-metrics";
import type { Position } from "@/types/data";
import type { QuotesApiResponse } from "@/types/quote-api";

export const dynamic = "force-dynamic";

const list = positions as Position[];

function buildWarning(
  failures: { symbol: string; kind: string }[],
  candleOk: boolean,
): string | undefined {
  const parts: string[] = [];
  if (!candleOk) {
    parts.push("Benchmark history missing; excess vs benchmark may be blank.");
  }
  if (failures.length > 0) {
    const auth = failures.some((f) => f.kind === "unauthorized");
    const rate = failures.some((f) => f.kind === "rate_limit");
    if (auth) {
      parts.push("Quote service rejected the request—check FINNHUB_API_KEY.");
    } else if (rate) {
      parts.push("Rate limit hit; retry later or use offline prices.");
    } else {
      const syms = [...new Set(failures.map((f) => f.symbol))].slice(0, 6).join(", ");
      parts.push(`Live price missing for: ${syms}${failures.length > 6 ? " …" : "."}`);
    }
  }
  return parts.length ? parts.join(" ") : undefined;
}

export async function GET(): Promise<Response> {
  const benchmark = (market as { benchmarkTicker: string }).benchmarkTicker || "SPY";
  const updatedAt = new Date().toISOString();

  if (!finnhubConfigured()) {
    const body: QuotesApiResponse = {
      ok: false,
      updatedAt,
      benchmarkTicker: benchmark,
      warning: "FINNHUB_API_KEY is not set. Showing offline figures from positions data only.",
      rows: list.map((p) => toPublicQuoteRow(buildRowMetrics(p, null, null, null))),
    };
    return Response.json(body);
  }

  const tickers = [...new Set(list.map((p) => p.ticker.toUpperCase()))];
  const symbols = [...new Set([...tickers, benchmark])];

  const oldest = list.reduce((min, p) => (p.entryDate < min ? p.entryDate : min), list[0]?.entryDate ?? "");
  const fromSec = oldest
    ? Math.floor(new Date(`${oldest}T00:00:00Z`).getTime() / 1000) - 86400 * 365
    : Math.floor(Date.now() / 1000) - 86400 * 365;
  const toSec = Math.floor(Date.now() / 1000);

  const candleOutcome = await fetchDailyCandles(benchmark, fromSec, toSec);
  const candles = candleOutcome.ok ? candleOutcome.data : null;

  const quotes = new Map<string, number>();
  const failures: { symbol: string; kind: string }[] = [];

  for (const sym of symbols) {
    const result = await fetchQuote(sym);
    if (result.ok) quotes.set(sym, result.price);
    else failures.push({ symbol: sym, kind: result.kind });
    await new Promise((r) => setTimeout(r, 80));
  }

  const spyNow = quotes.get(benchmark) ?? null;

  const rowsInternal = list.map((p) => {
    const sym = p.ticker.toUpperCase();
    const live = quotes.get(sym) ?? null;
    let spyAtEntry: number | null = null;
    if (candles?.t && candles?.c) {
      spyAtEntry = closeOnOrBefore(candles.t, candles.c, entryDateToUnixEndOfDay(p.entryDate));
    }
    return buildRowMetrics(p, live, spyAtEntry, spyNow);
  });

  const quotesComplete = failures.length === 0;
  const benchComplete = candleOutcome.ok;
  const ok = quotesComplete && benchComplete;
  const warning = ok ? undefined : buildWarning(failures, benchComplete);

  const body: QuotesApiResponse = {
    ok,
    updatedAt,
    benchmarkTicker: benchmark,
    ...(warning ? { warning } : {}),
    rows: rowsInternal.map(toPublicQuoteRow),
  };

  return Response.json(body);
}
