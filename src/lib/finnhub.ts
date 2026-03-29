const BASE = "https://finnhub.io/api/v1";

export type FinnhubQuoteOk = { ok: true; price: number };
export type FinnhubQuoteErr = {
  ok: false;
  kind: "rate_limit" | "unauthorized" | "http" | "invalid_body" | "network";
  status?: number;
};

export type FinnhubQuoteResult = FinnhubQuoteOk | FinnhubQuoteErr;

export interface FinnhubCandleResult {
  c: number[];
  t: number[];
  s: string;
}

export type FinnhubCandleOutcome =
  | { ok: true; data: FinnhubCandleResult }
  | { ok: false; kind: "rate_limit" | "unauthorized" | "http" | "no_data" | "network" };

function getToken(): string | undefined {
  return process.env.FINNHUB_API_KEY?.trim();
}

export function finnhubConfigured(): boolean {
  return Boolean(getToken());
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

/**
 * Single quote; retries once after delay on 429.
 */
export async function fetchQuote(symbol: string, attempt = 0): Promise<FinnhubQuoteResult> {
  const token = getToken();
  if (!token) return { ok: false, kind: "unauthorized" };

  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });

    if (res.status === 429) {
      if (attempt < 1) {
        await sleep(1100);
        return fetchQuote(symbol, attempt + 1);
      }
      return { ok: false, kind: "rate_limit", status: 429 };
    }

    if (res.status === 401 || res.status === 403) {
      return { ok: false, kind: "unauthorized", status: res.status };
    }

    if (!res.ok) {
      return { ok: false, kind: "http", status: res.status };
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      return { ok: false, kind: "invalid_body" };
    }

    const c = (data as { c?: unknown }).c;
    if (typeof c !== "number" || !Number.isFinite(c) || c <= 0) {
      return { ok: false, kind: "invalid_body" };
    }

    return { ok: true, price: c };
  } catch {
    return { ok: false, kind: "network" };
  }
}

export async function fetchDailyCandles(
  symbol: string,
  fromSec: number,
  toSec: number,
  attempt = 0,
): Promise<FinnhubCandleOutcome> {
  const token = getToken();
  if (!token) return { ok: false, kind: "unauthorized" };

  const q = new URLSearchParams({
    symbol,
    resolution: "D",
    from: String(fromSec),
    to: String(toSec),
    token,
  });

  try {
    const res = await fetch(`${BASE}/stock/candle?${q}`, { cache: "no-store", next: { revalidate: 0 } });

    if (res.status === 429) {
      if (attempt < 1) {
        await sleep(1100);
        return fetchDailyCandles(symbol, fromSec, toSec, attempt + 1);
      }
      return { ok: false, kind: "rate_limit" };
    }

    if (res.status === 401 || res.status === 403) {
      return { ok: false, kind: "unauthorized" };
    }

    if (!res.ok) {
      return { ok: false, kind: "http" };
    }

    const data = (await res.json()) as FinnhubCandleResult;
    if (data.s === "no_data" || !Array.isArray(data.c) || !Array.isArray(data.t)) {
      return { ok: false, kind: "no_data" };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, kind: "network" };
  }
}
