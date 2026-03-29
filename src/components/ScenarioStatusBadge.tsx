import type { ScenarioMonitorStatus } from "@/types/data";

const labels: Record<ScenarioMonitorStatus, string> = {
  leading: "Leading",
  "base case": "Base case",
  monitoring: "Monitoring",
  "tail risk": "Tail risk",
};

const styles: Record<ScenarioMonitorStatus, string> = {
  leading: "border-zinc-400 text-zinc-800",
  "base case": "border-zinc-800 text-zinc-900",
  monitoring: "border-dashed border-zinc-300 text-zinc-600",
  "tail risk": "border-zinc-200 text-zinc-500",
};

export function ScenarioStatusBadge({ status }: { status: ScenarioMonitorStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border bg-transparent px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
