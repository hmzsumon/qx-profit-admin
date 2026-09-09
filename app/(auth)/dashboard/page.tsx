"use client";

import DepositWithdrawChart from "@/components/admin/DepositWithdrawChart";
import LatestTransactionsTable, {
  Txn,
} from "@/components/admin/LatestTransactionsTable";
import MetricCard from "@/components/admin/MetricCard";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useGetAdminOverviewQuery } from "@/redux/features/admin/adminAnalyticsApi";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Banknote,
  Clock,
  Scale,
  TrendingUp,
  Users,
} from "lucide-react";

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
] as const;

export default function AdminDashboardPage() {
  const { data: d, isLoading } = useGetAdminOverviewQuery();

  const depRows: Txn[] = (d?.recentDeposits ?? []).map((r: any) => ({
    id: r._id,
    name: r.name || r.customerId || "—",
    amount: Number(r.receivedAmount ?? r.amount ?? 0),
    date: r.createdAt,
  }));
  const wdRows: Txn[] = (d?.recentWithdrawals ?? []).map((r: any) => ({
    id: r._id,
    name: r.name || r.customerId || "—",
    amount: -Number(r.amount ?? 0),
    date: r.createdAt,
  }));

  return (
    <main className="min-h-screen bg-[#0B0D12] text-white">
      <div className="mx-auto w-full max-w-7xl px-2 py-4 md:p-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Company at a glance
        </h1>

        {/* ── top metrics ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(d?.users.total ?? 0)}
            subtitle={d ? `+${d.users.todayNew} today` : undefined}
            accent={<Users className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(d?.users.activeTotal ?? 0)}
            accent={<Users className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Total Deposits"
            value={formatCurrency(d?.deposits.allTime.amount ?? 0)}
            accent={<ArrowDownToLine className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Total Withdrawals"
            value={formatCurrency(d?.withdrawals.allTime.net ?? 0)}
            accent={<ArrowUpFromLine className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Net Position"
            value={formatCurrency(d?.net ?? 0)}
            accent={<Scale className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Pending Withdrawals"
            value={`${d?.withdrawals.pending.count ?? 0}`}
            subtitle={d ? formatCurrency(d.withdrawals.pending.amount) : undefined}
            accent={<Clock className="h-5 w-5 text-amber-400/70" />}
          />
        </div>

        {/* ── QX Investment strip ── */}
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            title="QX Investment Balance"
            value={formatCurrency(d?.qxInvestment.totalBalance ?? 0)}
            accent={<TrendingUp className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Active Investments"
            value={formatNumber(d?.qxInvestment.activeCount ?? 0)}
          />
          <MetricCard
            title="Profit Paid"
            value={formatCurrency(d?.qxInvestment.totalUserProfit ?? 0)}
          />
          <MetricCard
            title="Referral Bonus Paid"
            value={formatCurrency(d?.qxInvestment.totalTeamBonus ?? 0)}
          />
        </div>

        {/* ── period band: deposits vs withdrawals per window ── */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERIODS.map((p) => {
            const dep = d?.deposits[p.key];
            const wd = d?.withdrawals[p.key];
            return (
              <div
                key={p.key}
                className="rounded-2xl border border-white/5 bg-[#0E1014] p-5"
              >
                <p className="text-sm text-white/60">{p.label}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <ArrowDownToLine className="h-4 w-4" /> Deposits
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(dep?.amount ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-rose-400">
                      <ArrowUpFromLine className="h-4 w-4" /> Withdrawals
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(wd?.net ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs text-white/50">
                    <span>Net</span>
                    <span className="font-semibold text-white/80">
                      {formatCurrency((dep?.amount ?? 0) - (wd?.net ?? 0))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── chart ── */}
        <div className="mt-6">
          <DepositWithdrawChart data={d?.series ?? []} />
        </div>

        {/* ── recent activity ── */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LatestTransactionsTable rows={depRows} title="Recent deposits" />
          <LatestTransactionsTable rows={wdRows} title="Recent withdrawals" />
        </div>

        {isLoading && (
          <p className="mt-6 text-center text-sm text-white/40">Loading live data…</p>
        )}
      </div>
    </main>
  );
}
