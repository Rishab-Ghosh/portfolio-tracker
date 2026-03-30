import type { KillSwitch, KillSwitchStatus } from "@/types/data";

const statusLabel: Record<KillSwitchStatus, string> = {
  green: "Active — not triggered",
  yellow: "Approaching threshold",
  red: "Triggered",
};

const statusStyle: Record<KillSwitchStatus, string> = {
  green: "border-emerald-700/60 text-emerald-400/90 bg-emerald-950/20",
  yellow: "border-amber-700/60 text-amber-300/90 bg-amber-950/20",
  red: "border-rose-700/60 text-rose-400/90 bg-rose-950/20",
};

const statusDot: Record<KillSwitchStatus, string> = {
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  red: "bg-rose-500",
};

export function ThesisIntegrity({ items }: { items: KillSwitch[] }) {
  return (
    <div className="border border-zinc-700/80 border-l-2 border-l-zinc-500 bg-zinc-950/40 px-4 py-7 sm:px-6 sm:py-8">
      <p className="max-w-[38rem] text-[13px] leading-relaxed text-zinc-500">
        Pre-defined exit conditions monitored each quarter. Status is updated manually as data
        arrives. GREEN = not triggered; YELLOW = approaching threshold; RED = triggered, action
        required.
      </p>
      <ol className="mt-8 space-y-7 border-t border-zinc-800/80 pt-8">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 text-[13px] sm:gap-5">
            <span className="w-10 shrink-0 pt-0.5 font-mono text-[11px] text-zinc-600 tabular-nums">
              {item.id}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start gap-2">
                <p className="font-medium text-zinc-200">{item.condition}</p>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide ${statusStyle[item.status]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDot[item.status]}`}
                    aria-hidden
                  />
                  {statusLabel[item.status]}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-[11px] sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-600">Current read</dt>
                  <dd className="mt-0.5 font-mono leading-snug text-zinc-400">{item.currentValue}</dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Trigger threshold</dt>
                  <dd className="mt-0.5 font-mono leading-snug text-zinc-400">{item.threshold}</dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Action if triggered</dt>
                  <dd className="mt-0.5 leading-snug text-zinc-400">{item.action}</dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Monitoring data</dt>
                  <dd className="mt-0.5 leading-snug text-zinc-500">{item.monitoringData}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
