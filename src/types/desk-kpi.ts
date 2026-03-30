export type DeskKpiDirection = "up" | "down" | "flat" | "na";

export interface DeskKpi {
  name: string;
  signal: string;
  direction: DeskKpiDirection;
  interpretation: string;
  status: string;
}
