"use client";

import { formatCurrency, formatNumber } from "@/lib/format";

/* ────────── Period summary strip for deposit / withdraw pages ────────── */

type Row = { key: string; count: number; amount: number };

export default function PeriodSummaryCards({
  label,
  loading,
  count,
  amount,
  net,
  fees,
  breakdown,
  breakdownTitle = "By method",
}: {
  label: string;
  loading?: boolean;
  count: number;
  amount: number;
  net: number;
  fees?: number;
  breakdown?: Row[];
  breakdownTitle?: string;
}) {
  const Item = ({ title, value, accent }: { title: string; value: string; accent?: string }) => (
    <div className="rounded-xl border border-white/10 bg-[#0E1014] p-4">
      <p className="text-xs text-white/50">{title}</p>
      <p className={`mt-1 text-xl font-semibold ${accent ?? ""}`}>
        {loading ? "…" : value}
      </p>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70">
        Showing <span className="font-semibold text-white">{label}</span>
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Item title="Transactions" value={formatNumber(count)} />
        <Item title="Total amount" value={formatCurrency(amount)} />
        <Item title="Net" value={formatCurrency(net)} accent="text-emerald-400" />
        {typeof fees === "number" && (
          <Item title="Fees" value={formatCurrency(fees)} accent="text-amber-400" />
        )}
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[#0E1014] p-4">
          <p className="mb-2 text-xs text-white/50">{breakdownTitle}</p>
          <div className="flex flex-wrap gap-2">
            {breakdown.map((b) => (
              <span
                key={b.key}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/80"
              >
                <span className="uppercase text-white/50">{b.key}</span>{" "}
                <span className="font-semibold">{formatCurrency(b.amount)}</span>{" "}
                <span className="text-white/40">({b.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
