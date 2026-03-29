import type { Kpi, KpiTrend } from "@/types/data";

const trendRead: Record<KpiTrend, string> = {
  up: "Rising",
  down: "Falling",
  flat: "Flat",
  "n/a": "—",
};

function SourceTag({ type }: { type: Kpi["sourceType"] }) {
  const label = type === "api" ? "API" : "Manual";
  return (
    <span className="border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-normal text-zinc-600">
      {label}
    </span>
  );
}

export function KPIMonitor({ kpis }: { kpis: Kpi[] }) {
  return (
    <ol className="space-y-12">
      {kpis.map((k) => (
        <li key={k.name} className="border-b border-zinc-200 pb-12 last:border-b-0 last:pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4">
            <h3 className="max-w-xl text-[15px] font-medium leading-snug text-zinc-900">{k.name}</h3>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] text-zinc-500">
                <span className="text-zinc-400">Read</span> {trendRead[k.trend]}
              </span>
              <SourceTag type={k.sourceType} />
            </div>
          </div>
          <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.65] text-zinc-800">{k.interpretation}</p>
          <div className="mt-7 grid gap-8 border-t border-zinc-100 pt-7 sm:grid-cols-2 sm:gap-x-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Linkage
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{k.whyItMatters}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Observation
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{k.currentStatus}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
