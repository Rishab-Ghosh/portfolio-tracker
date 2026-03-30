import type { Scenarios } from "@/types/data";

export function ScenarioReadout({
  scenarios,
  currentLean,
}: {
  scenarios: Scenarios;
  currentLean: "bull" | "base" | "bear";
}) {
  const ordered = [
    { key: "bull" as const, card: scenarios.bull },
    { key: "base" as const, card: scenarios.base },
    { key: "bear" as const, card: scenarios.bear },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {ordered.map(({ key, card }) => {
        const active = key === currentLean;
        return (
          <div
            key={key}
            className={`rounded border px-3 py-2.5 ${
              active
                ? "border-zinc-500/60 bg-zinc-800/40 ring-1 ring-zinc-400/25"
                : "border-zinc-700/60 bg-zinc-950/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                {card.name}
              </span>
              {active ? (
                <span className="shrink-0 rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-amber-200/90">
                  Current lean
                </span>
              ) : null}
            </div>
            <p className="mt-2 line-clamp-3 text-[11px] leading-snug text-zinc-500">{card.description}</p>
            <p className="mt-2 font-mono text-[10px] text-zinc-600">{card.monitorStatus}</p>
          </div>
        );
      })}
    </div>
  );
}
