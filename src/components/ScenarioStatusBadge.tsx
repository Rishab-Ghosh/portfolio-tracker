import type { ScenarioMonitorStatus } from "@/types/data";

const labels: Record<ScenarioMonitorStatus, string> = {
  leading: "Leading",
  "base case": "Base case",
  monitoring: "Monitoring",
  "tail risk": "Tail risk",
};

const styles: Record<ScenarioMonitorStatus, string> = {
  leading: "border-zinc-200 text-zinc-700",
  "base case": "border-zinc-300 text-zinc-900",
  monitoring: "border-dashed border-zinc-200 text-zinc-600",
  "tail risk": "border-zinc-200/70 text-zinc-500",
};

export function ScenarioStatusBadge({ status }: { status: ScenarioMonitorStatus }) {
  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap border bg-white px-2 py-0.5 text-[11px] font-normal leading-none tracking-normal ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
