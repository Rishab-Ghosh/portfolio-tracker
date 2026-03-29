import type { Kpi, KpiTrend } from "@/types/data";

const trendLabel: Record<KpiTrend, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
  "n/a": "—",
};

function SourceTag({ type }: { type: Kpi["sourceType"] }) {
  const label = type === "api" ? "API" : "Manual";
  return (
    <span className="rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
      {label}
    </span>
  );
}

export function KPIMonitor({ kpis }: { kpis: Kpi[] }) {
  return (
    <ol className="space-y-10">
      {kpis.map((k) => (
        <li key={k.name} className="border-b border-zinc-200 pb-10 last:border-b-0 last:pb-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[15px] font-medium leading-snug text-zinc-900">{k.name}</h3>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs text-zinc-500 tabular-nums"
                title="Directional read (manual)"
              >
                {trendLabel[k.trend]}
              </span>
              <SourceTag type={k.sourceType} />
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-zinc-800">{k.interpretation}</p>
          <div className="mt-6 grid gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Why it matters
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{k.whyItMatters}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Current observation
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{k.currentStatus}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
