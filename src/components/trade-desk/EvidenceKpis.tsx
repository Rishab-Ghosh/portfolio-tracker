import type { DeskKpi, DeskKpiDirection } from "@/types/desk-kpi";

function DirGlyph({ d }: { d: DeskKpiDirection }) {
  if (d === "up") return <span className="text-emerald-400/90">↑</span>;
  if (d === "down") return <span className="text-rose-400/90">↓</span>;
  if (d === "flat") return <span className="text-zinc-500">→</span>;
  return <span className="text-zinc-600">—</span>;
}

export function EvidenceKpis({ kpis }: { kpis: DeskKpi[] }) {
  return (
    <div className="overflow-hidden rounded border border-zinc-700/60">
      <table className="w-full border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-b border-zinc-700/60 bg-zinc-900/50 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            <th className="px-2.5 py-2 font-medium">Indicator</th>
            <th className="w-8 px-1 py-2 text-center font-medium">Dir</th>
            <th className="hidden px-2 py-2 font-medium sm:table-cell">Read</th>
            <th className="px-2 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          {kpis.map((k) => (
            <tr key={k.name} className="border-b border-zinc-800/80 last:border-0">
              <td className="px-2.5 py-2 align-top">
                <span className="font-medium text-zinc-200">{k.name}</span>
                <p className="mt-0.5 font-mono text-[10px] leading-snug text-zinc-500">{k.signal}</p>
              </td>
              <td className="px-1 py-2 text-center align-middle">
                <DirGlyph d={k.direction} />
              </td>
              <td className="hidden align-top px-2 py-2 text-zinc-500 sm:table-cell">
                {k.interpretation}
              </td>
              <td className="px-2 py-2 align-top">
                <span className="inline-block rounded border border-zinc-600/50 bg-zinc-900/60 px-1.5 py-0.5 text-[10px] text-zinc-400">
                  {k.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
