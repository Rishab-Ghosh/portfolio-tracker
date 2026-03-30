export interface ThesisDriver {
  title: string;
  detail: string;
}

export interface ThesisData {
  /** Legacy editorial shape (optional JSON); trade desk uses `data/site.json` + blotter. */
  oneLine: string;
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

export type PositionSide = "long" | "short" | "neutral";

/** Legacy static shape; trade desk uses `data/positions.json` + `/api/portfolio`. */
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
  probability: number;
  description: string;
  confirmingSignals: string;
  whatWouldHappen: string;
  benefits: string;
  hurt: string;
  monitorStatus: ScenarioMonitorStatus;
}

export interface Scenarios {
  base: ScenarioCard;
  delay: ScenarioCard;
  severity: ScenarioCard;
  blackswan: ScenarioCard;
}

export type KillSwitchStatus = "green" | "yellow" | "red";

export interface KillSwitch {
  id: string;
  condition: string;
  monitoringData: string;
  action: string;
  appliesTo: string;
  status: KillSwitchStatus;
  currentValue: string;
  threshold: string;
}

export interface SiteMeta {
  title: string;
  subtitle: string;
  intro: string;
  launched: string;
  thesisActive: boolean;
  /** Section II — thesis expressions first; market data second */
  leadPositions: string;
  /** Section IV — non-price evidence */
  leadKpis: string;
}

/** `data/market.json` — benchmark, inception book, poll cadence */
export interface MarketConfig {
  benchmarkTicker: string;
  inceptionDate: string;
  startingNav: number;
  currentLean: "base" | "delay" | "severity" | "blackswan";
  pollIntervalSeconds: number;
  offlineBenchmarkPrice?: number;
}
