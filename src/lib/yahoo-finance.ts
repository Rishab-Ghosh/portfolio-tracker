/**
 * Yahoo Finance — daily candles and current quotes.
 * No API key required. Used for historical OHLCV data.
 */

import type { CandleSeries } from "@/lib/portfolio-engine";

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance";
const HEADERS = { "User-Agent": "Mozilla/5.0" };

type YfChartResult = {
  timestamp: number[];
  indicators: { quote: [{ close: (number | null)[] }] };
};

type YfQuoteResult = {
  regularMarketPrice?: number;
};

export type YfCandleOutcome =
  | { ok: true; data: CandleSeries }
  | { ok: false; kind: "no_data" | "http" | "network" };

export type YfQuoteOutcome =
  | { ok: true; price: number }
  | { ok: false; kind: "no_data" | "http" | "network" };

export async function fetchYfCandles(
  symbol: string,
  fromSec: number,
): Promise<YfCandleOutcome> {
  // Calculate range in days from fromSec to now; cap at 1y.
  const daysDiff = Math.ceil((Date.now() / 1000 - fromSec) / 86400);
  const range = daysDiff > 300 ? "1y" : daysDiff > 150 ? "6mo" : "3mo";

  const url = `${YF_BASE}/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`;

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) return { ok: false, kind: "http" };

    const json = (await res.json()) as {
      chart: { result: YfChartResult[] | null; error: unknown };
    };

    const result = json.chart?.result?.[0];
    if (!result?.timestamp?.length) return { ok: false, kind: "no_data" };

    const closes = result.indicators.quote[0].close;
    const t: number[] = [];
    const c: number[] = [];

    for (let i = 0; i < result.timestamp.length; i++) {
      const ts = result.timestamp[i];
      const px = closes[i];
      if (ts != null && px != null && px > 0) {
        t.push(ts);
        c.push(px);
      }
    }

    if (t.length === 0) return { ok: false, kind: "no_data" };
    return { ok: true, data: { t, c } };
  } catch {
    return { ok: false, kind: "network" };
  }
}

export async function fetchYfQuote(symbol: string): Promise<YfQuoteOutcome> {
  const url = `${YF_BASE}/quote?symbols=${encodeURIComponent(symbol)}`;

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) return { ok: false, kind: "http" };

    const json = (await res.json()) as {
      quoteResponse: { result: YfQuoteResult[] };
    };

    const price = json.quoteResponse?.result?.[0]?.regularMarketPrice;
    if (typeof price !== "number" || price <= 0) return { ok: false, kind: "no_data" };

    return { ok: true, price };
  } catch {
    return { ok: false, kind: "network" };
  }
}
