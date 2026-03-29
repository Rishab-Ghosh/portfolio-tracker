import type { Position } from "@/types/data";
import { StatusBadge } from "@/components/StatusBadge";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PositionTracker({ positions }: { positions: Position[] }) {
  return (
    <div className="space-y-3">
      <div className="hidden overflow-x-auto lg:block">
        <div className="border border-zinc-200 bg-white">
          <table className="w-full min-w-[58rem] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-100/80 text-[11px] text-zinc-600">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-3 py-3 font-mono font-normal">Ticker</th>
                <th className="px-3 py-3 font-normal">Side</th>
                <th className="px-3 py-3 font-normal">Sleeve</th>
                <th className="px-3 py-3 font-normal whitespace-nowrap">Opened</th>
                <th className="px-3 py-3 text-right font-mono font-normal tabular-nums">
                  Entry px
                </th>
                <th className="px-3 py-3 text-right font-mono font-normal tabular-nums">
                  Last px
                </th>
                <th className="px-3 py-3 font-normal">State</th>
                <th className="px-4 py-3 font-normal">View</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr
                  key={`${p.ticker}-${p.entryDate}`}
                  className="border-b border-zinc-100 align-top text-zinc-800 last:border-b-0"
                >
                  <td className="px-4 py-4 font-medium text-zinc-900">{p.name}</td>
                  <td className="px-3 py-4 font-mono text-[12px] text-zinc-600">{p.ticker}</td>
                  <td className="px-3 py-4 capitalize text-zinc-700">{p.side}</td>
                  <td className="px-3 py-4 text-zinc-600">{p.category}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-zinc-600 tabular-nums">
                    {formatDate(p.entryDate)}
                  </td>
                  <td className="px-3 py-4 text-right font-mono text-[12px] text-zinc-800 tabular-nums">
                    {money.format(p.entryPrice)}
                  </td>
                  <td className="px-3 py-4 text-right font-mono text-[12px] text-zinc-800 tabular-nums">
                    {money.format(p.currentPrice)}
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="max-w-[22rem] px-4 py-4 text-[13px] leading-[1.55] text-zinc-600">
                    {p.thesisSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-1 text-[11px] leading-relaxed text-zinc-500">
          Last prices are illustrative for layout; replace in <span className="font-mono">data/positions.json</span> or wire a feed when available.
        </p>
      </div>

      <ul className="space-y-3 lg:hidden">
        {positions.map((p) => (
          <li
            key={`${p.ticker}-${p.entryDate}-m`}
            className="border border-zinc-200 bg-white px-4 py-5 sm:px-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-medium text-zinc-900">{p.name}</div>
                <div className="mt-0.5 font-mono text-xs text-zinc-500">{p.ticker}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-zinc-100 pt-4 text-[13px]">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Side
                </dt>
                <dd className="mt-0.5 capitalize text-zinc-800">{p.side}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Sleeve
                </dt>
                <dd className="mt-0.5 text-zinc-700">{p.category}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Entry
                </dt>
                <dd className="mt-0.5 tabular-nums text-zinc-700">{formatDate(p.entryDate)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Entry / last
                </dt>
                <dd className="mt-0.5 font-mono text-xs text-zinc-800 tabular-nums">
                  {money.format(p.entryPrice)} · {money.format(p.currentPrice)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-zinc-100 pt-4 text-[13px] leading-[1.55] text-zinc-600">
              {p.thesisSummary}
            </p>
          </li>
        ))}
      </ul>
      <p className="px-1 text-[11px] leading-relaxed text-zinc-500 lg:hidden">
        Last prices illustrative—update in <span className="font-mono">data/positions.json</span>.
      </p>
    </div>
  );
}
