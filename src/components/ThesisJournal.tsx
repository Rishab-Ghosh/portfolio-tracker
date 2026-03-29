import type { JournalEntry } from "@/types/data";

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ThesisJournal({ entries }: { entries: JournalEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ul className="divide-y divide-zinc-200 border border-zinc-200 bg-white">
      {sorted.map((e) => (
        <li key={`${e.date}-${e.title}`} className="px-4 py-7 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-4">
            <time
              className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500"
              dateTime={e.date}
            >
              {formatDate(e.date)}
            </time>
            {e.tags && e.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <li
                    key={t}
                    className="border border-zinc-200 bg-zinc-50/80 px-2 py-0.5 text-[11px] font-normal text-zinc-600"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <h3 className="mt-1 text-[15px] font-medium leading-snug text-zinc-900">{e.title}</h3>
          <dl className="mt-6 grid grid-cols-1 gap-8 text-[13px] leading-relaxed sm:grid-cols-3 sm:gap-6 lg:gap-10">
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Development
              </dt>
              <dd className="mt-2 text-zinc-700">{e.whatChanged}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Read-through
              </dt>
              <dd className="mt-2 text-zinc-700">{e.implication}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                Disposition
              </dt>
              <dd className="mt-2 text-zinc-800">{e.action}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
