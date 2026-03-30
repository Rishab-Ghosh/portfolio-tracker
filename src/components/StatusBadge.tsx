import type { PositionStatus } from "@/types/data";

const labels: Record<PositionStatus, string> = {
  tracking: "Tracking",
  validated: "Validated",
  "under review": "Under review",
  broken: "Broken",
};

const styles: Record<PositionStatus, string> = {
  tracking: "border-zinc-600/60 text-zinc-400 bg-zinc-900/50",
  validated: "border-zinc-500/50 text-zinc-200 bg-zinc-800/40",
  "under review": "border-dashed border-zinc-600/50 text-zinc-400 bg-zinc-950/40",
  broken: "border-zinc-700/60 text-zinc-500 bg-zinc-950/30",
};

export function StatusBadge({ status }: { status: PositionStatus }) {
  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap border px-2 py-0.5 text-[10px] font-normal leading-none tracking-normal ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
