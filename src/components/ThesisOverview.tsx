import type { ThesisDriver } from "@/types/data";

interface ThesisOverviewProps {
  coreThesis: string;
  drivers: ThesisDriver[];
}

export function ThesisOverview({ coreThesis, drivers }: ThesisOverviewProps) {
  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-base leading-[1.7] text-zinc-800">{coreThesis}</p>
      <ul className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {drivers.map((d) => (
          <li
            key={d.title}
            className="rounded-lg border border-zinc-200/90 bg-zinc-50/50 p-5"
          >
            <h3 className="font-medium text-zinc-900">{d.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
