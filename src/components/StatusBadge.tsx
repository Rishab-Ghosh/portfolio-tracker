import type { PositionStatus } from "@/types/data";

const labels: Record<PositionStatus, string> = {
  tracking: "Tracking",
  validated: "Validated",
  "under review": "Under review",
  broken: "Broken",
};

const styles: Record<PositionStatus, string> = {
  tracking: "border-zinc-200 text-zinc-600",
  validated: "border-zinc-300 text-zinc-800",
  "under review": "border-dashed border-zinc-200 text-zinc-600",
  broken: "border-zinc-200/80 text-zinc-400",
};

export function StatusBadge({ status }: { status: PositionStatus }) {
  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap border bg-white px-2 py-0.5 text-[11px] font-normal leading-none tracking-normal ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
