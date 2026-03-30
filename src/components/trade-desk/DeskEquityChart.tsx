"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type EquityPoint = { date: string; nav: number; benchNav: number };

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function DeskEquityChart({
  data,
  benchmarkTicker,
}: {
  data: EquityPoint[];
  benchmarkTicker: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-[min(380px,50vh)] min-h-[200px] items-center justify-center rounded border border-zinc-700/80 bg-zinc-950/50 px-4 text-center text-[13px] text-zinc-500">
        No equity series yet. Configure Finnhub or check inception alignment.
      </div>
    );
  }

  return (
    <div className="h-[min(380px,45vh)] min-h-[260px] w-full min-w-0 sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#71717a" }}
            tickLine={false}
            axisLine={{ stroke: "#3f3f46" }}
            minTickGap={28}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#71717a" }}
            tickLine={false}
            axisLine={{ stroke: "#3f3f46" }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            domain={["auto", "auto"]}
            width={42}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #3f3f46",
              borderRadius: 4,
              fontSize: 12,
            }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value: number | string, name: string) => {
              const v = typeof value === "number" ? value : Number(value);
              return [
                money.format(v),
                name === "nav" ? "Portfolio NAV" : `${benchmarkTicker} (indexed)`,
              ];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#a1a1aa", paddingTop: 8 }}
            formatter={(value) =>
              value === "nav" ? "Portfolio" : `${benchmarkTicker} (bench)`
            }
          />
          <Line
            type="monotone"
            dataKey="nav"
            name="nav"
            stroke="#e4e4e7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="benchNav"
            name="benchNav"
            stroke="#71717a"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="5 4"
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
