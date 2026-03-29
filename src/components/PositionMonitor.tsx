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

function markSource(r: RowMetrics | undefined): string {
  if (!r) return "";
  if (r.source === "live") return "live";
  if (r.source === "offline") return "stale";
  return "";
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
      setClientError("Quote request failed");
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
    if (loading && !data) return "Loading marks…";
    if (!data) return clientError ?? "Marks not available";
    const t = new Date(data.updatedAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const parts = [`As of ${t}`];
    if (!data.ok && data.error) parts.push(data.error);
    return parts.join(" · ");
  }, [loading, data, clientError]);

  return (
    <div className="space-y-4">
      <p className="text-[11px] tabular-nums leading-relaxed text-zinc-500">{statusLine}</p>

      <div className="hidden overflow-x-auto md:block md:-mx-4 md:px-4 lg:mx-0 lg:px-0">
        <div className="inline-block min-w-full border border-zinc-200 bg-white align-middle">
          <table className="w-full min-w-[58rem] border-collapse text-left text-[12px] leading-snug lg:min-w-[62rem]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-100/90 text-[10px] text-zinc-500">
                <th className="px-3 py-3.5 pl-4 font-normal sm:pl-5">Name</th>
                <th className="px-2.5 py-3.5 font-mono font-normal">Ticker</th>
                <th className="px-2.5 py-3.5 font-normal">Side</th>
                <th className="min-w-[7rem] px-2.5 py-3.5 font-normal">Sleeve</th>
                <th className="px-2.5 py-3.5 font-normal">State</th>
                <th className="min-w-[14rem] px-3 py-3.5 font-normal sm:min-w-[16rem]">Thesis</th>
                <th className="border-l border-zinc-200 px-2.5 py-3.5 font-normal whitespace-nowrap">
                  Opened
                </th>
                <th className="px-2.5 py-3.5 text-right font-mono font-normal tabular-nums">Entry</th>
                <th className="px-2.5 py-3.5 text-right font-mono font-normal tabular-nums">Last</th>
                <th className="px-2.5 py-3.5 text-right font-mono font-normal tabular-nums">Δ</th>
                <th className="px-2.5 py-3.5 text-right font-mono font-normal tabular-nums">
                  Open %
                </th>
                <th className="px-2.5 py-3.5 pr-4 text-right font-mono font-normal tabular-nums sm:pr-5">
                  Ex. {benchmarkLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => {
                const r = rowMap.get(p.ticker.toUpperCase());
                const px = r?.current;
                const src = markSource(r);
                return (
                  <tr
                    key={`${p.ticker}-${p.entryDate}`}
                    className="border-b border-zinc-100 align-top text-zinc-800 last:border-b-0"
                  >
                    <td className="px-3 py-3.5 pl-4 font-medium text-zinc-900 sm:pl-5">{p.name}</td>
                    <td className="px-2.5 py-3.5 font-mono text-[11px] text-zinc-600">{p.ticker}</td>
                    <td className="px-2.5 py-3.5 capitalize text-zinc-700">{p.side}</td>
                    <td className="px-2.5 py-3.5 text-zinc-600">{p.category}</td>
                    <td className="px-2.5 py-3.5 align-middle">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="max-w-[18rem] px-3 py-3.5 text-[12px] leading-[1.55] text-zinc-600 sm:max-w-[20rem]">
                      {p.thesisSummary}
                    </td>
                    <td className="border-l border-zinc-100 px-2.5 py-3.5 whitespace-nowrap text-zinc-600 tabular-nums">
                      {formatDate(p.entryDate)}
                    </td>
                    <td className="px-2.5 py-3.5 text-right font-mono text-[11px] text-zinc-800 tabular-nums">
                      {money.format(p.entryPrice)}
                    </td>
                    <td className="px-2.5 py-3.5 text-right font-mono text-[11px] tabular-nums text-zinc-800">
                      {px != null ? (
                        <>
                          {money.format(px)}
                          {src ? (
                            <span className="ml-1 text-[10px] font-sans font-normal text-zinc-400">
                              {src}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-2.5 py-3.5 text-right font-mono text-[11px] text-zinc-700 tabular-nums">
                      {fmtDelta(r?.absChange ?? null)}
                    </td>
                    <td className="px-2.5 py-3.5 text-right font-mono text-[11px] text-zinc-700 tabular-nums">
                      {fmtPct(r?.pctReturn ?? null)}
                    </td>
                    <td className="px-2.5 py-3.5 pr-4 text-right font-mono text-[11px] text-zinc-700 tabular-nums sm:pr-5">
                      {fmtPct(r?.excessVsSpyPct ?? null)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-[38rem] text-[11px] leading-relaxed text-zinc-500">
          Prices from Finnhub on the server; if the call fails, figures fall back to{" "}
          <span className="font-mono text-zinc-600">offlineQuote</span> in{" "}
          <span className="font-mono text-zinc-600">data/positions.json</span>. Excess vs{" "}
          {benchmarkLabel} is a simple since-open spread, not an estimated alpha.
        </p>
      </div>

      <ul className="space-y-4 md:hidden">
        {positions.map((p) => {
          const r = rowMap.get(p.ticker.toUpperCase());
          const px = r?.current;
          const src = markSource(r);
          return (
            <li key={`${p.ticker}-${p.entryDate}-m`} className="border border-zinc-200 bg-white">
              <div className="flex flex-col gap-4 px-4 py-5 sm:px-5 sm:py-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium leading-snug text-zinc-900">{p.name}</div>
                    <div className="mt-1 font-mono text-[11px] text-zinc-500">{p.ticker}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <p className="text-[13px] leading-[1.6] text-zinc-700">{p.thesisSummary}</p>

                <dl className="grid grid-cols-1 gap-y-4 border-t border-zinc-100 pt-5 text-[13px] sm:grid-cols-2 sm:gap-x-8">
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                      Side · sleeve
                    </dt>
                    <dd className="mt-1 capitalize leading-snug text-zinc-800">
                      {p.side} · {p.category}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                      Opened
                    </dt>
                    <dd className="mt-1 tabular-nums text-zinc-700">{formatDate(p.entryDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                      Entry / last
                    </dt>
                    <dd className="mt-1 font-mono text-[12px] leading-relaxed text-zinc-800 tabular-nums">
                      {money.format(p.entryPrice)}
                      <span className="text-zinc-300"> / </span>
                      {px != null ? money.format(px) : "—"}
                      {src ? (
                        <span className="mt-0.5 block font-sans text-[10px] font-normal text-zinc-400">
                          {src}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                      Open %
                    </dt>
                    <dd className="mt-1 font-mono text-zinc-800">{fmtPct(r?.pctReturn ?? null)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                      Ex. {benchmarkLabel}
                    </dt>
                    <dd className="mt-1 font-mono text-zinc-800">
                      {fmtPct(r?.excessVsSpyPct ?? null)}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
