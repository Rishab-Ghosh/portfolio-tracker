"use client";

import { useCallback, useEffect, useState } from "react";
import type { Scenarios } from "@/types/data";
import type { DeskKpi } from "@/types/desk-kpi";
import type { PortfolioApiResponse } from "@/types/portfolio-api";
import { StatusBadge } from "@/components/StatusBadge";
import { DeskEquityChart } from "./DeskEquityChart";
import { EvidenceKpis } from "./EvidenceKpis";
import { ScenarioReadout } from "./ScenarioReadout";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct1 = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function fmtPct(x: number) {
  return pct1.format(x / 100);
}

function fmtPnl(x: number) {
  if (x > 0) return `+${usd2.format(x)}`;
  if (x < 0) return `−${usd2.format(Math.abs(x))}`;
  return usd2.format(0);
}

function fmtMv(x: number) {
  if (x < 0) return `−${usd2.format(Math.abs(x))}`;
  return usd2.format(x);
}

const emptyPayload: PortfolioApiResponse = {
  ok: false,
  inceptionDate: "2026-03-27",
  startingNav: 100_000,
  benchmarkTicker: "SPY",
  currentLean: "base",
  header: {
    currentNav: 100_000,
    totalReturnPct: 0,
    benchmarkReturnPct: 0,
    alphaVsBenchPct: 0,
    dayPnl: 0,
    dayPnlPct: 0,
  },
  stats: {
    totalPnl: 0,
    grossExposure: 0,
    netExposure: 0,
    positionCount: 0,
  },
  series: [],
  positions: [],
};

export function TradeDesk({
  siteTitle,
  siteSubtitle,
  siteTagline,
  scenarios,
  kpis,
  pollIntervalMs,
}: {
  siteTitle: string;
  siteSubtitle: string;
  siteTagline: string;
  scenarios: Scenarios;
  kpis: DeskKpi[];
  pollIntervalMs: number;
}) {
  const [data, setData] = useState<PortfolioApiResponse>(emptyPayload);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (!res.ok) {
        setLoadError(`HTTP ${res.status}`);
        return;
      }
      const json = (await res.json()) as PortfolioApiResponse;
      setData(json);
      setLoadError(null);
    } catch {
      setLoadError("Network error");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), pollIntervalMs);
    return () => clearInterval(id);
  }, [load, pollIntervalMs]);

  const h = data.header;
  const inceptionFmt = new Date(`${data.inceptionDate}T12:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  const statCards = [
    { label: "Current NAV", value: usd.format(h.currentNav) },
    { label: "Day P&L", value: fmtPnl(h.dayPnl), sub: fmtPct(h.dayPnlPct) },
    { label: "Total P&L", value: fmtPnl(data.stats.totalPnl), sub: fmtPct(h.totalReturnPct) },
    { label: "Total return", value: fmtPct(h.totalReturnPct) },
    { label: "Alpha vs bench", value: fmtPct(h.alphaVsBenchPct) },
    { label: "Gross exposure", value: fmtPct(data.stats.grossExposure) },
    { label: "Net exposure", value: fmtPct(data.stats.netExposure) },
    { label: "Positions", value: String(data.stats.positionCount) },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {loadError ? (
        <p className="rounded border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-[12px] text-rose-200/90">
          {loadError} — showing last payload or blanks.
        </p>
      ) : null}
      {data.warning ? (
        <p className="rounded border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-[12px] text-amber-100/85">
          {data.warning}
        </p>
      ) : null}
      {!hydrated ? <p className="text-[12px] text-zinc-500">Loading portfolio…</p> : null}

      <header className="border-b border-zinc-800 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
              {siteTitle}
            </h1>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              {siteSubtitle}
            </p>
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-zinc-500">{siteTagline}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] sm:grid-cols-3">
              <div>
                <dt className="text-zinc-600">Inception</dt>
                <dd className="font-mono text-zinc-300">{inceptionFmt}</dd>
              </div>
              <div>
                <dt className="text-zinc-600">Start NAV</dt>
                <dd className="font-mono text-zinc-300">{usd.format(data.startingNav)}</dd>
              </div>
              <div>
                <dt className="text-zinc-600">Benchmark</dt>
                <dd className="font-mono text-zinc-300">{data.benchmarkTicker}</dd>
              </div>
            </dl>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-3 lg:shrink-0">
            <div className="rounded border border-zinc-700/80 bg-zinc-900/40 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Current NAV</p>
              <p className="mt-1 font-mono text-[15px] text-zinc-100">{usd.format(h.currentNav)}</p>
            </div>
            <div className="rounded border border-zinc-700/80 bg-zinc-900/40 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Total return</p>
              <p className="mt-1 font-mono text-[15px] text-zinc-100">{fmtPct(h.totalReturnPct)}</p>
            </div>
            <div className="rounded border border-zinc-700/80 bg-zinc-900/40 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Bench return</p>
              <p className="mt-1 font-mono text-[15px] text-zinc-100">{fmtPct(h.benchmarkReturnPct)}</p>
            </div>
            <div className="rounded border border-zinc-700/80 bg-zinc-900/40 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Alpha</p>
              <p className="mt-1 font-mono text-[15px] text-zinc-100">{fmtPct(h.alphaVsBenchPct)}</p>
            </div>
            <div className="col-span-2 rounded border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 sm:col-span-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-amber-200/70">
                Active scenario
              </p>
              <p className="mt-1 text-[13px] font-medium capitalize text-amber-100/90">
                {data.currentLean} case
              </p>
            </div>
          </div>
        </div>
      </header>

      <section id="chart" aria-labelledby="chart-heading" className="scroll-mt-10">
        <h2 id="chart-heading" className="sr-only">
          Equity curve
        </h2>
        <div className="lg:grid lg:grid-cols-[1fr_11rem] lg:gap-6">
          <div className="rounded border border-zinc-700/70 bg-zinc-950/30 p-3 sm:p-4">
            <DeskEquityChart data={data.series} benchmarkTicker={data.benchmarkTicker} />
          </div>
          <aside className="mt-4 space-y-3 text-[11px] text-zinc-500 lg:mt-0">
            <p className="font-medium uppercase tracking-wide text-zinc-600">Range</p>
            <p>
              <span className="text-zinc-600">From </span>
              <span className="font-mono text-zinc-400">{data.series[0]?.date ?? "—"}</span>
              <span className="text-zinc-600"> to </span>
              <span className="font-mono text-zinc-400">
                {data.series[data.series.length - 1]?.date ?? "—"}
              </span>
            </p>
            <p>
              <span className="text-zinc-600">Sessions: </span>
              <span className="font-mono text-zinc-400">{data.series.length}</span>
            </p>
            <p className="leading-snug">
              Portfolio and benchmark are indexed to {usd.format(data.startingNav)} at inception; benchmark
              line is the index level of {data.benchmarkTicker}, not a held position.
            </p>
          </aside>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {statCards.map((c) => (
            <div
              key={c.label}
              className="rounded border border-zinc-800/90 bg-zinc-900/25 px-2.5 py-2"
            >
              <p className="text-[9px] font-medium uppercase tracking-wide text-zinc-600">{c.label}</p>
              <p className="mt-0.5 font-mono text-[12px] text-zinc-200">{c.value}</p>
              {c.sub ? <p className="mt-0.5 font-mono text-[10px] text-zinc-500">{c.sub}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="blotter" className="scroll-mt-10" aria-labelledby="blotter-heading">
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-zinc-800 pb-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600">Book</p>
            <h2 id="blotter-heading" className="text-base font-semibold text-zinc-200">
              Position blotter
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto rounded border border-zinc-700/60">
          <table className="w-full min-w-[920px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-zinc-700/60 bg-zinc-900/60 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                <th className="whitespace-nowrap px-2 py-2 font-medium">Ticker</th>
                <th className="px-2 py-2 font-medium">Company</th>
                <th className="px-2 py-2 font-medium">Side</th>
                <th className="px-2 py-2 font-medium">Category</th>
                <th className="px-2 py-2 text-right font-medium">Wt %</th>
                <th className="whitespace-nowrap px-2 py-2 font-medium">Entry</th>
                <th className="px-2 py-2 text-right font-medium">Entry px</th>
                <th className="px-2 py-2 text-right font-medium">Last</th>
                <th className="px-2 py-2 text-right font-medium">Qty</th>
                <th className="px-2 py-2 text-right font-medium">Mkt val</th>
                <th className="px-2 py-2 text-right font-medium">U-P&L</th>
                <th className="px-2 py-2 text-right font-medium">Return</th>
                <th className="px-2 py-2 text-right font-medium">Contrib</th>
                <th className="px-2 py-2 font-medium">Thesis</th>
              </tr>
            </thead>
            <tbody className="font-mono text-zinc-300">
              {data.positions.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-3 py-8 text-center text-zinc-500">
                    No positions in payload.
                  </td>
                </tr>
              ) : (
                data.positions.map((row) => (
                  <tr key={row.ticker} className="border-b border-zinc-800/80 last:border-0">
                    <td
                      className="whitespace-nowrap px-2 py-2 font-semibold text-zinc-100"
                      title={row.thesisLine}
                    >
                      {row.ticker}
                    </td>
                    <td className="max-w-[140px] truncate px-2 py-2 text-zinc-400">{row.company}</td>
                    <td className="px-2 py-2 capitalize text-zinc-400">{row.side}</td>
                    <td className="max-w-[120px] truncate px-2 py-2 text-zinc-500">{row.category}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{row.weightPct.toFixed(1)}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-zinc-500">{row.entryDate}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{row.entryPrice.toFixed(2)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      {row.currentPrice.toFixed(2)}
                      <span className="ml-1 text-[9px] text-zinc-600">({row.priceSource})</span>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{row.shares.toFixed(4)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{fmtMv(row.marketValue)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{fmtPnl(row.unrealizedPnl)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{fmtPct(row.returnPct)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{fmtPct(row.contributionPct)}</td>
                    <td className="px-2 py-2 align-middle">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="scenarios" className="scroll-mt-10" aria-labelledby="scenarios-heading">
        <div className="mb-4 border-b border-zinc-800 pb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600">Scenarios</p>
          <h2 id="scenarios-heading" className="text-base font-semibold text-zinc-200">
            Path readout
          </h2>
        </div>
        <ScenarioReadout scenarios={scenarios} currentLean={data.currentLean} />
      </section>

      <section id="evidence" className="scroll-mt-10" aria-labelledby="evidence-heading">
        <div className="mb-4 border-b border-zinc-800 pb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600">Evidence</p>
          <h2 id="evidence-heading" className="text-base font-semibold text-zinc-200">
            Thesis signals
          </h2>
        </div>
        <EvidenceKpis kpis={kpis} />
      </section>
    </div>
  );
}
