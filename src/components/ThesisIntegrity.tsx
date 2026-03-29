import type { FalsificationItem } from "@/types/data";

export function ThesisIntegrity({ items }: { items: FalsificationItem[] }) {
  return (
    <div className="rounded-lg border border-zinc-300 bg-zinc-50/80 p-5 sm:p-7">
      <p className="text-sm leading-relaxed text-zinc-700">
        Intellectual honesty requires stating conditions that would weaken or invalidate the
        thesis before outcomes are known. The list below is a living checklist—not exhaustive—and
        informs when to resize, hedge, or exit.
      </p>
      <ol className="mt-8 space-y-6">
        {items.map((item, i) => (
          <li key={item.condition} className="flex gap-4 text-sm">
            <span className="font-mono text-xs text-zinc-400 tabular-nums">
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <div>
              <p className="font-medium text-zinc-900">{item.condition}</p>
              <p className="mt-1.5 leading-relaxed text-zinc-600">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
