/**
 * Payload returned by GET /api/quotes — no API keys, no raw vendor fields.
 */
export type QuoteRowPublic = {
  ticker: string;
  last: number | null;
  absChange: number | null;
  pctReturn: number | null;
  /** Position return since open minus benchmark return over the same window (percentage points). */
  excessVsBench: number | null;
  source: "live" | "offline" | "unavailable";
};

export type QuotesApiResponse = {
  ok: boolean;
  updatedAt: string;
  benchmarkTicker: string;
  /** Safe, high-level message for partial failure (never includes API key or vendor body). */
  warning?: string;
  rows: QuoteRowPublic[];
};
