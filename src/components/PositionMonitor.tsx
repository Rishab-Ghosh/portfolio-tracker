"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Position } from "@/types/data";
import type { RowMetrics } from "@/lib/position-metrics";
import { StatusBadge } from "@/components/StatusBadge";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtPct(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}

function fmtDelta(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  const s = n >= 0 ? "+" : "−";
  return `${s}${money.format(Math.abs(n))}`;
}

type QuotesResponse = {
  ok: boolean;
  updatedAt: string;
  benchmarkTicker: string;
  error?: string;
  rows: RowMetrics[];
};

function rowMapFrom(rows: RowMetrics[] | null): Map<string, RowMetrics> {
  const m = new Map<string, RowMetrics>();
  if (!rows) return m;
  for (const r of rows) m.set(r.ticker.toUpperCase(), r);
  return m;
}

export function PositionMonitor({
  positions,
  benchmarkLabel,
  pollIntervalMs,
}: {
  positions: Position[];
  benchmarkLabel: string;
  pollIntervalMs: number;
}) {
  const [data, setData] = useState<QuotesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setClientError(null);
    try {
      const res = await fetch("/api/quotes", { cache: "no-store" });
      const json = (await res.json()) as QuotesResponse;
      setData(json);
    } catch {
      setClientError("Unable to reach quote service");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQuotes();
    const id = setInterval(() => void fetchQuotes(), pollIntervalMs);
    return () => clearInterval(id);
  }, [fetchQuotes, pollIntervalMs]);

  const rowMap = useMemo(() => rowMapFrom(data?.rows ?? null), [data?.rows]);

  const statusLine = useMemo(() => {
    if (loading && !data) return "Fetching marks…";
    if (!data) return clientError ?? "Marks unavailable";
    const t = new Date(data.updatedAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const parts = [`Marks as of ${t}`];
    if (!data.ok && data.error) parts.push(data.error);
    return parts.join(" · ");
  }, [loading, data, clientError]);

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-zinc-500">{statusLine}</p>

      <div className="hidden overflow-x-auto lg:block">
        <div className="border border-zinc-200 bg-white">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-100/80 text-[11px] text-zinc-600">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-3 py-3 font-mono font-normal">Ticker</th>
                <th className="px-3 py-3 font-normal">Side</th>
                <th className="px-3 py-3 font-normal">Sleeve</th>
                <th className="px-3 py-3 font-normal">State</th>
                <th className="px-4 py-3 font-normal">Thesis</th>
                <th className="border-l border-zinc-200 px-3 py-3 font-normal whitespace-nowrap text-zinc-500">
                  Opened
                </th>
                <th className="px-3 py-3 text-right font-mono font-normal tabular-nums text-zinc-500">
                  Entry
                </th>
                <th className="px-3 py-3 text-right font-mono font-normal tabular-nums text-zinc-500">
                  Last
                </th>
                <th className="px-3 py-3 text-right font-mono font-normal tabular-nums text-zinc-500">
                  Δ
                </th>
                <th className="px-3 py-3 text-right font-mono font-normal tabular-nums text-zinc-500">
                  Since open
                </th>
                <th className="px-3 py-3 pr-4 text-right font-mono font-normal tabular-nums text-zinc-500">
                  vs {benchmarkLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => {
                const r = rowMap.get(p.ticker.toUpperCase());
                const px = r?.current;
                const priceLabel =
                  r?.source === "live"
                    ? "Live"
                    : r?.source === "offline"
                      ? "Offline"
                      : "—";
                return (
                  <tr
                    key={`${p.ticker}-${p.entryDate}`}
                    className="border-b border-zinc-100 align-top text-zinc-800 last:border-b-0"
                  >
                    <td className="px-4 py-4 font-medium text-zinc-900">{p.name}</td>
                    <td className="px-3 py-4 font-mono text-[12px] text-zinc-600">{p.ticker}</td>
                    <td className="px-3 py-4 capitalize text-zinc-700">{p.side}</td>
                    <td className="px-3 py-4 text-zinc-600">{p.category}</td>
                    <td className="px-3 py-4 align-middle">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="max-w-[19rem] px-4 py-4 text-[13px] leading-[1.55] text-zinc-600">
                      {p.thesisSummary}
                    </td>
                    <td className="border-l border-zinc-100 px-3 py-4 whitespace-nowrap text-zinc-600 tabular-nums">
                      {formatDate(p.entryDate)}
                    </td>
                    <td className="px-3 py-4 text-right font-mono text-[12px] text-zinc-800 tabular-nums">
                      {money.format(p.entryPrice)}
                    </td>
                    <td className="px-3 py-4 text-right font-mono text-[12px] tabular-nums">
                      {px != null ? (
                        <span className="text-zinc-800">{money.format(px)}</span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                      <span className="ml-1 block text-[10px] font-sans font-normal normal-case text-zinc-400">
                        {priceLabel}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right font-mono text-[12px] text-zinc-700 tabular-nums">
                      {fmtDelta(r?.absChange ?? null)}
                    </td>
                    <td className="px-3 py-4 text-right font-mono text-[12px] text-zinc-700 tabular-nums">
                      {fmtPct(r?.pctReturn ?? null)}
                    </td>
                    <td className="px-3 py-4 pr-4 text-right font-mono text-[12px] text-zinc-700 tabular-nums">
                      {fmtPct(r?.excessVsSpyPct ?? null)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="px-1 text-[11px] leading-relaxed text-zinc-500">
          Server-side Finnhub; fallback <span className="font-mono">offlineQuote</span> in{" "}
          <span className="font-mono">data/positions.json</span>. “vs {benchmarkLabel}”: simple
          excess vs benchmark over the same window since open—not a formal alpha estimate.
        </p>
      </div>

      <ul className="space-y-3 lg:hidden">
        {positions.map((p) => {
          const r = rowMap.get(p.ticker.toUpperCase());
          const px = r?.current;
          return (
            <li
              key={`${p.ticker}-${p.entryDate}-m`}
              className="border border-zinc-200 bg-white px-4 py-5 sm:px-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[15px] font-medium text-zinc-900">{p.name}</div>
                  <div className="mt-0.5 font-mono text-xs text-zinc-500">{p.ticker}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-4 text-[13px] leading-[1.55] text-zinc-700">{p.thesisSummary}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-zinc-100 pt-4 text-[13px]">
                <div className="col-span-2">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                    Side · sleeve
                  </dt>
                  <dd className="mt-0.5 capitalize text-zinc-800">
                    {p.side} · {p.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                    Opened
                  </dt>
                  <dd className="mt-0.5 tabular-nums text-zinc-700">{formatDate(p.entryDate)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                    Entry · last
                  </dt>
                  <dd className="mt-0.5 font-mono text-xs text-zinc-800 tabular-nums">
                    {money.format(p.entryPrice)} · {px != null ? money.format(px) : "—"}{" "}
                    <span className="font-sans text-[10px] text-zinc-400">
                      ({r?.source === "live" ? "live" : r?.source === "offline" ? "offline" : "n/a"})
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                    Since open
                  </dt>
                  <dd className="mt-0.5 font-mono text-zinc-800">{fmtPct(r?.pctReturn ?? null)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                    vs {benchmarkLabel}
                  </dt>
                  <dd className="mt-0.5 font-mono text-zinc-800">
                    {fmtPct(r?.excessVsSpyPct ?? null)}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
