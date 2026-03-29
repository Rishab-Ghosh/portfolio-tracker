import type { Position, PositionSide } from "@/types/data";

export function entryDateToUnixEndOfDay(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T23:59:59Z`).getTime() / 1000);
}

/** Close on or before `asOfSec` from Finnhub candle arrays (ascending t). */
export function closeOnOrBefore(
  t: number[],
  c: number[],
  asOfSec: number,
): number | null {
  if (!t.length || t.length !== c.length) return null;
  let best: number | null = null;
  for (let i = 0; i < t.length; i++) {
    if (t[i] <= asOfSec) best = c[i];
    else break;
  }
  return best;
}

export function positionPctReturn(side: PositionSide, entry: number, current: number): number {
  if (entry <= 0) return 0;
  if (side === "long") return ((current - entry) / entry) * 100;
  return ((entry - current) / entry) * 100;
}

export function positionAbsChange(side: PositionSide, entry: number, current: number): number {
  if (side === "long") return current - entry;
  return entry - current;
}

export function spyReturnSinceEntry(
  spyAtEntry: number | null,
  spyNow: number | null,
): number | null {
  if (spyAtEntry == null || spyNow == null || spyAtEntry <= 0) return null;
  return ((spyNow - spyAtEntry) / spyAtEntry) * 100;
}

export type RowMetrics = {
  ticker: string;
  current: number | null;
  absChange: number | null;
  pctReturn: number | null;
  spySinceEntryPct: number | null;
  excessVsSpyPct: number | null;
  source: "live" | "offline" | "unavailable";
};

export function buildRowMetrics(
  p: Position,
  livePrice: number | null,
  spyAtEntry: number | null,
  spyNow: number | null,
): RowMetrics {
  const current =
    livePrice ??
    (typeof p.offlineQuote === "number" && p.offlineQuote > 0 ? p.offlineQuote : null);
  const source: RowMetrics["source"] =
    livePrice != null ? "live" : current != null ? "offline" : "unavailable";

  if (current == null) {
    return {
      ticker: p.ticker,
      current: null,
      absChange: null,
      pctReturn: null,
      spySinceEntryPct: spyReturnSinceEntry(spyAtEntry, spyNow),
      excessVsSpyPct: null,
      source: "unavailable",
    };
  }

  const pctReturn = positionPctReturn(p.side, p.entryPrice, current);
  const absChange = positionAbsChange(p.side, p.entryPrice, current);
  const spyPct = spyReturnSinceEntry(spyAtEntry, spyNow);
  const excessVsSpyPct = spyPct != null ? pctReturn - spyPct : null;

  return {
    ticker: p.ticker,
    current,
    absChange,
    pctReturn,
    spySinceEntryPct: spyPct,
    excessVsSpyPct,
    source,
  };
}
