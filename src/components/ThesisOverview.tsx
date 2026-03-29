import type { ThesisData } from "@/types/data";

export function ThesisOverview({ thesis }: { thesis: ThesisData }) {
  return (
    <div className="space-y-14 sm:space-y-16">
      <div className="border-l border-zinc-900 pl-4 sm:pl-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">Summary</p>
        <p className="mt-3 max-w-[38rem] text-[15px] font-medium leading-snug text-zinc-900">
          {thesis.oneLine}
        </p>
      </div>

      <p className="max-w-[38rem] text-[15px] leading-[1.7] text-zinc-800">{thesis.coreThesis}</p>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">Drivers</p>
        <ul className="mt-5 max-w-[38rem] divide-y divide-zinc-200 border border-zinc-200 bg-white">
          {thesis.drivers.map((d) => (
            <li key={d.title} className="px-4 py-5 sm:px-6 sm:py-5">
              <h3 className="text-sm font-medium text-zinc-900">{d.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{d.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-10 border-t border-zinc-200 pt-12 sm:grid-cols-2 sm:gap-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
            Aligned expressions
          </p>
          <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-zinc-700">
            {thesis.winners.map((w) => (
              <li key={w} className="flex gap-2">
                <span className="mt-[0.45em] h-px w-3 shrink-0 bg-zinc-300" aria-hidden />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
            Contradictions / stress
          </p>
          <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-zinc-700">
            {thesis.losers.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="mt-[0.45em] h-px w-3 shrink-0 bg-zinc-300" aria-hidden />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-[38rem] border border-zinc-200 bg-white px-4 py-5 sm:px-6 sm:py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">Rationale</p>
        <p className="mt-3 text-[13px] leading-relaxed text-zinc-700">{thesis.whyMatters}</p>
      </div>
    </div>
  );
}
