import type { ThesisData } from "@/types/data";

export function ThesisOverview({ thesis }: { thesis: ThesisData }) {
  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-[15px] leading-[1.7] text-zinc-800">{thesis.coreThesis}</p>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">Drivers</p>
        <ul className="mt-5 max-w-3xl space-y-0 divide-y divide-zinc-200 border border-zinc-200 bg-white">
          {thesis.drivers.map((d) => (
            <li key={d.title} className="px-5 py-5 sm:px-6 sm:py-5">
              <h3 className="text-sm font-medium text-zinc-900">{d.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{d.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-8 border-t border-zinc-200 pt-10 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Working expressions (winners)
          </p>
          <ul className="mt-3 list-inside list-disc text-[13px] leading-relaxed text-zinc-700">
            {thesis.winners.map((w) => (
              <li key={w} className="marker:text-zinc-400">
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Stress / losers
          </p>
          <ul className="mt-3 list-inside list-disc text-[13px] leading-relaxed text-zinc-700">
            {thesis.losers.map((l) => (
              <li key={l} className="marker:text-zinc-400">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-3xl border border-zinc-200 bg-zinc-50/50 px-5 py-5 sm:px-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
          Why this structure
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-zinc-700">{thesis.whyMatters}</p>
      </div>
    </div>
  );
}
