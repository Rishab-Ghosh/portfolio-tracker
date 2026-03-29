export interface ThesisDriver {
  title: string;
  detail: string;
}

export interface ThesisData {
  coreThesis: string;
  drivers: ThesisDriver[];
  winners: string[];
  losers: string[];
  whyMatters: string;
}

export type PositionStatus =
  | "tracking"
  | "validated"
  | "under review"
  | "broken";

export type PositionSide = "long" | "short";

/** Static sleeve definition; live prices come from /api/quotes. */
export interface Position {
  name: string;
  ticker: string;
  side: PositionSide;
  category: string;
  entryDate: string;
  entryPrice: number;
  /** Used only when the quote API is unavailable. */
  offlineQuote?: number;
  thesisSummary: string;
  status: PositionStatus;
}

export type KpiSourceType = "manual" | "api";

export type KpiTrend = "up" | "down" | "flat" | "n/a";

export interface Kpi {
  name: string;
  whyItMatters: string;
  sourceType: KpiSourceType;
  currentStatus: string;
  interpretation: string;
  trend: KpiTrend;
}

export type ScenarioMonitorStatus =
  | "leading"
  | "base case"
  | "monitoring"
  | "tail risk";

export interface ScenarioCard {
  name: string;
  description: string;
  confirmingSignals: string;
  whatWouldHappen: string;
  benefits: string;
  hurt: string;
  monitorStatus: ScenarioMonitorStatus;
}

export interface Scenarios {
  bull: ScenarioCard;
  base: ScenarioCard;
  bear: ScenarioCard;
}

export interface JournalEntry {
  date: string;
  title: string;
  whatChanged: string;
  implication: string;
  action: string;
  tags?: string[];
}

export interface FalsificationItem {
  condition: string;
  detail: string;
}

export interface SiteMeta {
  title: string;
  subtitle: string;
  intro: string;
  launched: string;
  thesisActive: boolean;
}
