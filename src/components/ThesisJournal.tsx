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
        <li key={`${e.date}-${e.title}`} className="px-5 py-6 sm:px-6 sm:py-7">
          <time
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500"
            dateTime={e.date}
          >
            {formatDate(e.date)}
          </time>
          <h3 className="mt-2 text-[15px] font-medium text-zinc-900">{e.title}</h3>
          <dl className="mt-5 grid gap-6 text-[13px] sm:grid-cols-3 sm:gap-8">
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Development
              </dt>
              <dd className="mt-2 leading-relaxed text-zinc-700">{e.whatChanged}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Read-through
              </dt>
              <dd className="mt-2 leading-relaxed text-zinc-700">{e.implication}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Disposition
              </dt>
              <dd className="mt-2 leading-relaxed text-zinc-800">{e.action}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
