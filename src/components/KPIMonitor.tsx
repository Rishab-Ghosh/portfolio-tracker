import type { Kpi } from "@/types/data";

export function KPIMonitor({ kpis }: { kpis: Kpi[] }) {
  return (
    <ol className="space-y-8">
      {kpis.map((k) => (
        <li key={k.name} className="border-b border-zinc-200 pb-8 last:border-b-0 last:pb-0">
          <h3 className="text-[15px] font-medium leading-snug text-zinc-900">{k.name}</h3>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.65] text-zinc-800">{k.interpretation}</p>
          <div className="mt-6 grid gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Linkage
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{k.whyItMatters}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Observation
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{k.statusPlaceholder}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
