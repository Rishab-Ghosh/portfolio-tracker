import type { PositionStatus } from "@/types/data";

const labels: Record<PositionStatus, string> = {
  tracking: "Tracking",
  validated: "Validated",
  "under review": "Under review",
  broken: "Broken",
};

const styles: Record<PositionStatus, string> = {
  tracking: "border-zinc-300 bg-white text-zinc-700",
  validated: "border-zinc-800 bg-zinc-900 text-white",
  "under review": "border-zinc-400 bg-zinc-100 text-zinc-800",
  broken: "border-zinc-300 bg-zinc-50 text-zinc-500",
};

export function StatusBadge({ status }: { status: PositionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
