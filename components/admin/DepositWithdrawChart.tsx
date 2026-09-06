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

type Point = { day: string; deposits: number; withdrawals: number };

export default function DepositWithdrawChart({ data }: { data: Point[] }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0E1014] p-5">
      <p className="mb-3 text-sm text-white/60">Deposits vs Withdrawals — last 14 days</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={44}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "#12151b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: any, n: any) => [
                `$${Number(v).toLocaleString()}`,
                n === "deposits" ? "Deposits" : "Withdrawals",
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(v) => (v === "deposits" ? "Deposits" : "Withdrawals")}
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#21D3B3"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#FB7185"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
