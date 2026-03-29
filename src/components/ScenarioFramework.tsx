import type { Scenarios } from "@/types/data";
import { ScenarioStatusBadge } from "@/components/ScenarioStatusBadge";

export function ScenarioFramework({ scenarios }: { scenarios: Scenarios }) {
  const cols = [scenarios.bull, scenarios.base, scenarios.bear] as const;

  return (
    <div className="grid gap-px border border-zinc-200 bg-zinc-200 lg:grid-cols-3">
      {cols.map((col) => (
        <article key={col.name} className="flex flex-col bg-white p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
            <h3 className="font-serif text-[1.0625rem] font-medium text-zinc-900">{col.name}</h3>
            <ScenarioStatusBadge status={col.monitorStatus} />
          </div>
          <dl className="mt-6 flex flex-1 flex-col gap-7 text-[13px] leading-[1.6]">
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                View
              </dt>
              <dd className="mt-2.5 text-zinc-700">{col.description}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Confirming signals
              </dt>
              <dd className="mt-2.5 text-zinc-700">{col.confirmingSignals}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Likely read
              </dt>
              <dd className="mt-2.5 text-zinc-700">{col.whatWouldHappen}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Favors
              </dt>
              <dd className="mt-2.5 text-zinc-700">{col.benefits}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Penalizes
              </dt>
              <dd className="mt-2.5 text-zinc-700">{col.hurt}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
