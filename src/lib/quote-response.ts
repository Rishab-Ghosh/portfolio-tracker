import type { RowMetrics } from "@/lib/position-metrics";
import type { QuoteRowPublic } from "@/types/quote-api";

export function toPublicQuoteRow(r: RowMetrics): QuoteRowPublic {
  return {
    ticker: r.ticker,
    last: r.current,
    absChange: r.absChange,
    pctReturn: r.pctReturn,
    excessVsBench: r.excessVsSpyPct,
    source: r.source,
  };
}
