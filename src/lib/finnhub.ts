const BASE = "https://finnhub.io/api/v1";

export interface FinnhubQuote {
  c: number;
  pc?: number;
}

export interface FinnhubCandleResult {
  c: number[];
  t: number[];
  s: string;
}

function getToken(): string | undefined {
  return process.env.FINNHUB_API_KEY?.trim();
}

export function finnhubConfigured(): boolean {
  return Boolean(getToken());
}

export async function fetchQuote(symbol: string): Promise<FinnhubQuote | null> {
  const token = getToken();
  if (!token) return null;
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = (await res.json()) as FinnhubQuote;
  if (typeof data.c !== "number" || !Number.isFinite(data.c) || data.c <= 0) return null;
  return data;
}

/** Daily candles; `from`/`to` in unix seconds. */
export async function fetchDailyCandles(
  symbol: string,
  fromSec: number,
  toSec: number,
): Promise<FinnhubCandleResult | null> {
  const token = getToken();
  if (!token) return null;
  const q = new URLSearchParams({
    symbol,
    resolution: "D",
    from: String(fromSec),
    to: String(toSec),
    token,
  });
  const res = await fetch(`${BASE}/stock/candle?${q}`, { cache: "no-store", next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = (await res.json()) as FinnhubCandleResult;
  if (data.s === "no_data" || !Array.isArray(data.c) || !Array.isArray(data.t)) return null;
  return data;
}
