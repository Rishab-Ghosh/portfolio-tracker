import type { Scenarios } from "@/types/data";

export function ScenarioFramework({ scenarios }: { scenarios: Scenarios }) {
  const cols = [scenarios.bull, scenarios.base, scenarios.bear] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {cols.map((col) => (
        <article
          key={col.label}
          className="flex flex-col rounded-lg border border-zinc-200/90 bg-zinc-50/40 p-5 sm:p-6"
        >
          <h3 className="border-b border-zinc-200 pb-3 font-serif text-lg font-medium text-zinc-900">
            {col.label} case
          </h3>
          <dl className="mt-5 flex flex-1 flex-col gap-5 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                What happens
              </dt>
              <dd className="mt-1.5 leading-relaxed text-zinc-700">{col.whatHappens}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                What confirms it
              </dt>
              <dd className="mt-1.5 leading-relaxed text-zinc-700">{col.whatConfirms}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Position impact
              </dt>
              <dd className="mt-1.5 leading-relaxed text-zinc-700">{col.positionImpact}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
