import type { FalsificationItem } from "@/types/data";

export function ThesisIntegrity({ items }: { items: FalsificationItem[] }) {
  return (
    <div className="border border-zinc-200 border-l-2 border-l-zinc-800 bg-white px-4 py-8 sm:px-7 sm:py-9">
      <p className="max-w-[38rem] text-[13px] leading-relaxed text-zinc-700">
        Conditions that would weaken or void the thesis—recorded before outcomes and revisited as
        data arrive.
      </p>
      <ol className="mt-9 space-y-8 border-t border-zinc-100 pt-9">
        {items.map((item, i) => (
          <li key={item.condition} className="flex gap-4 text-[13px] sm:gap-5">
            <span className="w-5 shrink-0 pt-0.5 font-mono text-[11px] text-zinc-400 tabular-nums">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-zinc-900">{item.condition}</p>
              <p className="mt-2 leading-relaxed text-zinc-600">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
