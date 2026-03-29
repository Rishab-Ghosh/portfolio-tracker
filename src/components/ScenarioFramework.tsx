import type { Scenarios } from "@/types/data";

export function ScenarioFramework({ scenarios }: { scenarios: Scenarios }) {
  const cols = [scenarios.bull, scenarios.base, scenarios.bear] as const;

  return (
    <div className="grid gap-px border border-zinc-200 bg-zinc-200 lg:grid-cols-3">
      {cols.map((col) => (
        <article key={col.label} className="flex flex-col bg-white p-6 sm:p-7">
          <h3 className="border-b border-zinc-100 pb-3 font-serif text-base font-medium text-zinc-900">
            {col.label}
          </h3>
          <dl className="mt-6 flex flex-1 flex-col gap-6 text-[13px]">
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Path
              </dt>
              <dd className="mt-2 leading-[1.6] text-zinc-700">{col.whatHappens}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Confirmation
              </dt>
              <dd className="mt-2 leading-[1.6] text-zinc-700">{col.whatConfirms}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Book
              </dt>
              <dd className="mt-2 leading-[1.6] text-zinc-700">{col.positionImpact}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
