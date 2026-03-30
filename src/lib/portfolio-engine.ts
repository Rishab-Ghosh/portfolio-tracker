/**
 * Theoretical book: signed USD allocation at inception / inception close = shares.
 * NAV(t) = Σ shares_i × price_i(t) on SPY trading calendar (forward-filled).
 */

export type CandleSeries = { t: number[]; c: number[] };

export type PortfolioPositionInput = {
  ticker: string;
  company: string;
  side: "long" | "short";
  category: string;
  allocationUsd: number;
  thesisLine: string;
  status: "tracking" | "validated" | "under review" | "broken";
  offlinePrice?: number;
};

export type BookComputation = {
  dates: string[];
  nav: number[];
  benchNav: number[];
  shares: Map<string, number>;
  lastPrices: Record<string, number>;
  spy0: number;
};

function valueOnOrBefore(series: CandleSeries, ts: number): number | null {
  const { t, c } = series;
  if (!t.length) return null;
  let best: number | null = null;
  for (let i = 0; i < t.length; i++) {
    if (t[i] <= ts) best = c[i];
    else break;
  }
  return best;
}

function isoDay(ts: number): string {
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

export function inceptionUnixSec(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T12:00:00Z`).getTime() / 1000);
}

export function computeBook(
  inceptionSec: number,
  startingNav: number,
  benchmarkTicker: string,
  benchmark: CandleSeries,
  symbolSeries: Record<string, CandleSeries>,
  positions: PortfolioPositionInput[],
  latestQuotes: Record<string, number | null>,
): BookComputation | null {
  const idx = benchmark.t.findIndex((u) => u >= inceptionSec);
  if (idx < 0) return null;

  const t0 = benchmark.t[idx];
  const spy0 = benchmark.c[idx];
  if (!spy0 || spy0 <= 0) return null;

  const benchU = benchmarkTicker.toUpperCase();
  const shares = new Map<string, number>();
  for (const p of positions) {
    const sym = p.ticker.toUpperCase();
    const ser = symbolSeries[sym];
    if (!ser) return null;
    const p0 = valueOnOrBefore(ser, t0) ?? p.offlinePrice ?? null;
    if (p0 == null || p0 <= 0) return null;
    shares.set(sym, p.allocationUsd / p0);
  }

  const dates: string[] = [];
  const nav: number[] = [];
  const benchNav: number[] = [];
  const lastPx: Record<string, number> = {};

  for (const p of positions) {
    const sym = p.ticker.toUpperCase();
    const p0 = valueOnOrBefore(symbolSeries[sym], t0) ?? p.offlinePrice;
    if (typeof p0 === "number" && p0 > 0) lastPx[sym] = p0;
  }

  for (let i = idx; i < benchmark.t.length; i++) {
    const ts = benchmark.t[i];
    dates.push(isoDay(ts));

    let n = 0;
    for (const p of positions) {
      const sym = p.ticker.toUpperCase();
      const ser = symbolSeries[sym];
      const px = valueOnOrBefore(ser, ts);
      if (px != null && px > 0) lastPx[sym] = px;
      const sh = shares.get(sym) ?? 0;
      n += sh * (lastPx[sym] ?? 0);
    }

    const spyC = benchmark.c[i];
    benchNav.push(startingNav * (spyC / spy0));
    nav.push(n);
  }

  if (!dates.length) return null;

  for (const p of positions) {
    const sym = p.ticker.toUpperCase();
    const q = latestQuotes[sym];
    const px = q != null && q > 0 ? q : lastPx[sym] ?? 0;
    lastPx[sym] = px;
  }

  let nLast = 0;
  for (const p of positions) {
    const sym = p.ticker.toUpperCase();
    nLast += (shares.get(sym) ?? 0) * (lastPx[sym] ?? 0);
  }
  nav[nav.length - 1] = nLast;

  const spyQ = latestQuotes[benchU];
  const spyLastClose = benchmark.c[benchmark.c.length - 1];
  const spyForBench = spyQ != null && spyQ > 0 ? spyQ : spyLastClose;
  benchNav[benchNav.length - 1] = startingNav * (spyForBench / spy0);

  return { dates, nav, benchNav, shares, lastPrices: lastPx, spy0 };
}
