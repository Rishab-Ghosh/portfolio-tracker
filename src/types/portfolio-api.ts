import type { PositionStatus } from "@/types/data";

export type BlotterRow = {
  ticker: string;
  company: string;
  side: "long" | "short" | "neutral";
  category: string;
  weightPct: number;
  entryDate: string;
  entryPrice: number;
  currentPrice: number;
  shares: number;
  marketValue: number;
  unrealizedPnl: number;
  returnPct: number;
  contributionPct: number;
  thesisLine: string;
  status: PositionStatus;
  priceSource: "live" | "close" | "offline";
};

export type PortfolioApiResponse = {
  ok: boolean;
  warning?: string;
  inceptionDate: string;
  startingNav: number;
  benchmarkTicker: string;
  currentLean: "base" | "delay" | "severity" | "blackswan";
  header: {
    currentNav: number;
    totalReturnPct: number;
    benchmarkReturnPct: number;
    alphaVsBenchPct: number;
    dayPnl: number;
    dayPnlPct: number;
  };
  stats: {
    totalPnl: number;
    grossExposure: number;
    netExposure: number;
    positionCount: number;
  };
  series: { date: string; nav: number; benchNav: number }[];
  positions: BlotterRow[];
};
