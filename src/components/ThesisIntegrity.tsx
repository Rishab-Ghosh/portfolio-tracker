import type { FalsificationItem } from "@/types/data";

export function ThesisIntegrity({ items }: { items: FalsificationItem[] }) {
  return (
    <div className="border border-zinc-300 border-l-2 border-l-zinc-900 bg-white px-5 py-7 sm:px-7 sm:py-8">
      <p className="max-w-3xl text-[13px] font-medium leading-relaxed text-zinc-800">
        Falsification conditions—stated before outcomes and revisited when evidence moves.
      </p>
      <ol className="mt-8 space-y-6 border-t border-zinc-100 pt-8">
        {items.map((item, i) => (
          <li key={item.condition} className="flex gap-5 text-[13px]">
            <span className="w-6 shrink-0 font-mono text-[11px] text-zinc-400 tabular-nums">
              {i + 1}.
            </span>
            <div>
              <p className="font-medium text-zinc-900">{item.condition}</p>
              <p className="mt-2 leading-relaxed text-zinc-600">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
