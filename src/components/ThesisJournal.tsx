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
    <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200/90 bg-white">
      {sorted.map((e) => (
        <li key={`${e.date}-${e.title}`} className="p-5 sm:p-6">
          <time
            className="text-xs font-medium uppercase tracking-wide text-zinc-500"
            dateTime={e.date}
          >
            {formatDate(e.date)}
          </time>
          <h3 className="mt-2 font-medium text-zinc-900">{e.title}</h3>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                What changed
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-700">{e.whatChanged}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Implication
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-700">{e.implication}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Action
              </dt>
              <dd className="mt-1 leading-relaxed text-zinc-800">{e.action}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
