import positions from "@data/positions.json";
import market from "@data/market.json";
import {
  fetchDailyCandles,
  fetchQuote,
  finnhubConfigured,
} from "@/lib/finnhub";
import {
  buildRowMetrics,
  closeOnOrBefore,
  entryDateToUnixEndOfDay,
} from "@/lib/position-metrics";
import type { Position } from "@/types/data";

export const dynamic = "force-dynamic";

const list = positions as Position[];

export async function GET() {
  const benchmark = (market as { benchmarkTicker: string }).benchmarkTicker || "SPY";
  const updatedAt = new Date().toISOString();

  if (!finnhubConfigured()) {
    return Response.json({
      ok: false,
      error: "FINNHUB_API_KEY is not set",
      updatedAt,
      benchmarkTicker: benchmark,
      rows: list.map((p) => buildRowMetrics(p, null, null, null)),
    });
  }

  const tickers = [...new Set(list.map((p) => p.ticker.toUpperCase()))];
  const symbols = [...new Set([...tickers, benchmark])];

  const oldest = list.reduce((min, p) => (p.entryDate < min ? p.entryDate : min), list[0]?.entryDate ?? "");
  const fromSec = oldest
    ? Math.floor(new Date(`${oldest}T00:00:00Z`).getTime() / 1000) - 86400 * 365
    : Math.floor(Date.now() / 1000) - 86400 * 365;
  const toSec = Math.floor(Date.now() / 1000);

  let candleError: string | undefined;
  const candles = await fetchDailyCandles(benchmark, fromSec, toSec).catch(() => null);
  if (!candles) candleError = "Benchmark history unavailable";

  const quotes: Record<string, number | null> = {};
  const quoteErrors: string[] = [];

  await Promise.all(
    symbols.map(async (sym) => {
      const q = await fetchQuote(sym);
      quotes[sym] = q?.c ?? null;
      if (q?.c == null) quoteErrors.push(sym);
    }),
  );

  const spyNow = quotes[benchmark] ?? null;

  const rows = list.map((p) => {
    const sym = p.ticker.toUpperCase();
    const live = quotes[sym] ?? null;
    let spyAtEntry: number | null = null;
    if (candles?.t && candles?.c) {
      spyAtEntry = closeOnOrBefore(
        candles.t,
        candles.c,
        entryDateToUnixEndOfDay(p.entryDate),
      );
    }
    return buildRowMetrics(p, live, spyAtEntry, spyNow);
  });

  const ok = quoteErrors.length === 0 && !candleError;

  return Response.json({
    ok,
    updatedAt,
    benchmarkTicker: benchmark,
    error:
      quoteErrors.length > 0
        ? `Partial or failed quotes: ${quoteErrors.join(", ")}`
        : candleError,
    rows,
  });
}
