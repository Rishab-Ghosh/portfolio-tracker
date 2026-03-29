import type { PositionStatus } from "@/types/data";

const labels: Record<PositionStatus, string> = {
  tracking: "Tracking",
  validated: "Validated",
  "under review": "Under Review",
  broken: "Broken",
};

/** Subtle, outline-only tags for thesis state—no fill contrast blocks. */
const styles: Record<PositionStatus, string> = {
  tracking: "border-zinc-300/90 text-zinc-600",
  validated: "border-zinc-400 text-zinc-800",
  "under review": "border-zinc-300 border-dashed text-zinc-600",
  broken: "border-zinc-200 text-zinc-500",
};

export function StatusBadge({ status }: { status: PositionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border bg-transparent px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
