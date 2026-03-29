import type { Kpi } from "@/types/data";

export function KPIMonitor({ kpis }: { kpis: Kpi[] }) {
  return (
    <ol className="space-y-6">
      {kpis.map((k, i) => (
        <li
          key={k.name}
          className="rounded-lg border border-zinc-200/90 bg-white p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-zinc-400 tabular-nums">
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <h3 className="text-base font-medium text-zinc-900">{k.name}</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Why it matters
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-700">{k.whyItMatters}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Current status
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-600">{k.statusPlaceholder}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Interpretation
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-700">{k.interpretation}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
