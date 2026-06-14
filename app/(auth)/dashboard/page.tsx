"use client";

import CommissionBarChart from "@/components/admin/CommissionBarChart";
import LatestTransactionsTable, {
  Txn,
} from "@/components/admin/LatestTransactionsTable";
import MetricCard from "@/components/admin/MetricCard";
import TeamSummaryList, { TeamRow } from "@/components/admin/TeamSummaryList";
import TradingVolumeChart from "@/components/admin/TradingVolumeChart";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useGetAdminDashboardQuery } from "@/redux/features/admin/adminApi";

import { ArrowDownToLine, Banknote, TrendingUp, Users } from "lucide-react";

const tradingData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 320 },
  { month: "Mar", value: 410 },
  { month: "Apr", value: 560 },
];

const commissionData = [
  { month: "Jan", value: 6 },
  { month: "Feb", value: 10 },
  { month: "Mar", value: 16 },
  { month: "Apr", value: 12 },
];

const txns: Txn[] = [
  { id: "t1", name: "Jane Cooper", amount: +2000, date: "2023-04-25" },
  { id: "t2", name: "Eleanor Pena", amount: -450, date: "2023-04-24" },
  { id: "t3", name: "Cody Fisher", amount: +1400, date: "2023-04-24" },
  { id: "t4", name: "Savannah Nguyen", amount: -210, date: "2023-04-24" },
];

const teamRows: TeamRow[] = [
  { level: "A", commission: 1250 },
  { level: "B", commission: 350 },
  { level: "C", commission: 1400 },
  { level: "D", commission: -210 },
  { level: "E", commission: 1250 },
  { level: "F", commission: 1000 },
  { level: "G", commission: 1000 },
  { level: "H", commission: 500 },
  { level: "J", commission: 700 },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboardQuery(undefined);
  const { dashboardData: d } = data || {};
  // console.log(d);

  /* ────────── these would come from API in production ────────── */

  const aiDelta = "+12.5%";

  return (
    <main className="min-h-screen bg-[#0B0D12] text-white">
      <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Admin</h1>

        {/* ────────── top metrics ────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Users"
            value={formatNumber(d?.totalUsers || 0)}
            accent={<Users className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Total Deposit"
            value={formatCurrency(d?.totalDeposits || 0)}
            accent={<Banknote className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="Total Withdrawal"
            value={formatCurrency(d?.totalNetWithdraw || 0)}
            accent={<ArrowDownToLine className="h-5 w-5 text-white/50" />}
          />
          <MetricCard
            title="AI Trade Profit"
            value={formatCurrency(d?.totalAiTradeProfit || 0)}
            accent={<TrendingUp className="h-5 w-5 text-emerald-400" />}
            subtitle={aiDelta}
          />

          <MetricCard
            title="AI Trade ROI"
            value={formatCurrency(d?.totalAiTradeCommission || 0)}
            accent={<TrendingUp className="h-5 w-5 text-emerald-400" />}
            subtitle={aiDelta}
          />
        </div>

        {/* ────────── middle charts ────────── */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TradingVolumeChart data={tradingData} />
          </div>
          <div>
            <CommissionBarChart data={commissionData} />
          </div>
        </div>

        {/* ────────── bottom tables ────────── */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LatestTransactionsTable rows={txns} />
          </div>
          <div>
            <TeamSummaryList rows={teamRows} />
          </div>
        </div>
      </div>
    </main>
  );
}
