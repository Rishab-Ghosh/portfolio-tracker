import type { ThesisDriver } from "@/types/data";

interface ThesisOverviewProps {
  coreThesis: string;
  drivers: ThesisDriver[];
}

export function ThesisOverview({ coreThesis, drivers }: ThesisOverviewProps) {
  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-[15px] leading-[1.7] text-zinc-800">{coreThesis}</p>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
          Drivers
        </p>
        <ul className="mt-5 max-w-3xl space-y-0 divide-y divide-zinc-200 border border-zinc-200 bg-white">
          {drivers.map((d) => (
            <li key={d.title} className="px-5 py-5 sm:px-6 sm:py-5">
              <h3 className="text-sm font-medium text-zinc-900">{d.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">{d.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
