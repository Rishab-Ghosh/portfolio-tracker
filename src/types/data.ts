export interface ThesisDriver {
  title: string;
  detail: string;
}

export type PositionStatus =
  | "tracking"
  | "validated"
  | "under review"
  | "broken";

export type PositionSide = "long" | "short";

export interface Position {
  name: string;
  ticker: string;
  side: PositionSide;
  category: string;
  entryDate: string;
  entryPrice: number;
  currentPrice: number;
  thesisSummary: string;
  status: PositionStatus;
}

export interface Kpi {
  name: string;
  whyItMatters: string;
  statusPlaceholder: string;
  interpretation: string;
}

export interface ScenarioColumn {
  label: string;
  whatHappens: string;
  whatConfirms: string;
  positionImpact: string;
}

export interface Scenarios {
  bull: ScenarioColumn;
  base: ScenarioColumn;
  bear: ScenarioColumn;
}

export interface JournalEntry {
  date: string;
  title: string;
  whatChanged: string;
  implication: string;
  action: string;
}

export interface FalsificationItem {
  condition: string;
  detail: string;
}
