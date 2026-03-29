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
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-medium uppercase tracking-wide text-zinc-500">
              <th className="pb-3 pr-4 font-medium">Security</th>
              <th className="pb-3 pr-4 font-medium">Side</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium">Entry</th>
              <th className="pb-3 pr-4 font-medium text-right">Entry px</th>
              <th className="pb-3 pr-4 font-medium text-right">Current px</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Thesis</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr
                key={`${p.ticker}-${p.entryDate}`}
                className="border-b border-zinc-100 align-top text-zinc-800"
              >
                <td className="py-4 pr-4">
                  <div className="font-medium text-zinc-900">{p.name}</div>
                  <div className="font-mono text-xs text-zinc-500">{p.ticker}</div>
                </td>
                <td className="py-4 pr-4 capitalize">{p.side}</td>
                <td className="py-4 pr-4 text-zinc-600">{p.category}</td>
                <td className="py-4 pr-4 whitespace-nowrap text-zinc-600">
                  {formatDate(p.entryDate)}
                </td>
                <td className="py-4 pr-4 text-right font-mono text-zinc-700">
                  {money.format(p.entryPrice)}
                </td>
                <td className="py-4 pr-4 text-right font-mono text-zinc-700">
                  {money.format(p.currentPrice)}
                  <span className="ml-1 text-xs font-sans text-zinc-400">(mock)</span>
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="py-4 max-w-md text-zinc-600 leading-relaxed">
                  {p.thesisSummary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-4 lg:hidden">
        {positions.map((p) => (
          <li
            key={`${p.ticker}-${p.entryDate}-m`}
            className="rounded-lg border border-zinc-200/90 bg-white p-4 shadow-sm shadow-zinc-950/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium text-zinc-900">{p.name}</div>
                <div className="font-mono text-sm text-zinc-500">{p.ticker}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Side</dt>
                <dd className="capitalize text-zinc-800">{p.side}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Category</dt>
                <dd className="text-zinc-700">{p.category}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Entry date</dt>
                <dd className="text-zinc-700">{formatDate(p.entryDate)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Prices</dt>
                <dd className="font-mono text-zinc-800">
                  {money.format(p.entryPrice)} → {money.format(p.currentPrice)}
                  <span className="block text-xs font-sans font-normal text-zinc-400">
                    current is mock
                  </span>
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">{p.thesisSummary}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
