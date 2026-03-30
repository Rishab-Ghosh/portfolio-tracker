import type { FalsificationItem } from "@/types/data";

export function ThesisIntegrity({ items }: { items: FalsificationItem[] }) {
  return (
    <div className="border border-zinc-700/80 border-l-2 border-l-zinc-500 bg-zinc-950/40 px-4 py-7 sm:px-6 sm:py-8">
      <p className="max-w-[38rem] text-[13px] leading-relaxed text-zinc-500">
        Conditions that would weaken or void the thesis—recorded before outcomes and revisited as
        data arrive.
      </p>
      <ol className="mt-8 space-y-7 border-t border-zinc-800/80 pt-8">
        {items.map((item, i) => (
          <li key={item.condition} className="flex gap-4 text-[13px] sm:gap-5">
            <span className="w-5 shrink-0 pt-0.5 font-mono text-[11px] text-zinc-600 tabular-nums">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-zinc-200">{item.condition}</p>
              <p className="mt-2 leading-relaxed text-zinc-500">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
