"use client";

import {
  useGetAdminTradeInvestmentAccountsQuery,
  useGetAdminTradeInvestmentDashboardQuery,
  useGetAdminTradeInvestmentLogsQuery,
  useGetAdminTradeInvestmentTodayStatusQuery,
  useRunAdminTradeInvestmentProfitMutation,
  useUpdateAdminTradeInvestmentConfigMutation,
} from "@/redux/features/trade-investment/tradeInvestmentAdminApi";
import { Play, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminMetric from "./AdminMetric";

const fmt = (v: number) =>
  `${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })} USDT`;

const CONFIG_FIELDS: { key: string; label: string }[] = [
  { key: "minAmount", label: "Min Investment (USDT)" },
  { key: "minWithdraw", label: "Min Withdrawal (USDT)" },
  { key: "lockDays", label: "Lock Days" },
  { key: "dailyProfitPercent", label: "Default Daily Profit % (1-4)" },
  { key: "cancelChargePercent", label: "Cancel Charge %" },
];

export default function AdminTradeInvestmentScreen() {
  const { data, isLoading } = useGetAdminTradeInvestmentDashboardQuery();
  const { data: accountsData } = useGetAdminTradeInvestmentAccountsQuery({ limit: 20 });
  const { data: logsData } = useGetAdminTradeInvestmentLogsQuery(80);
  const { data: todayData } = useGetAdminTradeInvestmentTodayStatusQuery();
  const [updateConfig, updateState] = useUpdateAdminTradeInvestmentConfigMutation();
  const [runProfit, runState] = useRunAdminTradeInvestmentProfitMutation();

  const config = data?.config;
  const stats = data?.stats || {};
  const [form, setForm] = useState<any>({});
  const [percent, setPercent] = useState<string>("");

  useEffect(() => {
    if (config) {
      setForm(config);
      setPercent(String(config.dailyProfitPercent ?? 1));
    }
  }, [config]);

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const saveConfig = async () => {
    const levelPercents = Array.isArray(form.levelPercents)
      ? form.levelPercents.map(Number)
      : String(form.levelPercents || "")
          .split(",")
          .map((s: string) => Number(s.trim()))
          .filter((n: number) => Number.isFinite(n));
    try {
      await toast.promise(
        updateConfig({ ...form, levelPercents }).unwrap(),
        {
          loading: "Saving...",
          success: "Config updated",
          error: (e: any) => e?.data?.message || "Update failed",
        },
      );
    } catch {}
  };

  const manualRun = async (dryRun: boolean) => {
    const p = Number(percent);
    if (!Number.isFinite(p) || p < 1 || p > 4) return toast.error("Percent must be between 1 and 4");
    try {
      const res = await toast.promise(
        runProfit({ dryRun, percent: p, ignoreWeekend: true }).unwrap(),
        {
          loading: dryRun ? "Checking..." : "Distributing profit...",
          success: dryRun ? "Dry run complete" : "Profit distributed",
          error: (e: any) => e?.data?.message || "Run failed",
        },
      );
      console.log(res);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0f141b] px-4 py-5 text-white">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/15 to-sky-500/10 p-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-emerald-300">Admin Analytics</p>
          <h1 className="text-2xl font-black">QX Investment Control</h1>
          <p className="mt-1 text-sm text-white/55">
            Manage the profit percent, lock days, cancel charge and referral levels.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-white/60">
            Today %
            <input
              value={percent}
              onChange={(e) => setPercent(e.target.value.replace(/[^0-9.]/g, ""))}
              className="ml-2 w-16 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-white outline-none"
            />
          </label>
          <button onClick={() => manualRun(true)} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold">
            Dry Run
          </button>
          <button
            onClick={() => manualRun(false)}
            disabled={runState.isLoading}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black"
          >
            <Play size={16} /> Distribute Today&apos;s Profit
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <AdminMetric label="Active Investments" value={String(stats.activeCount ?? 0)} />
        <AdminMetric label="Inactive" value={String(stats.inactiveCount ?? 0)} />
        <AdminMetric label="Cancelled" value={String(stats.cancelledCount ?? 0)} />
        <AdminMetric label="Total Invest Balance" value={fmt(stats.totalBalance)} />
        <AdminMetric label="Total Paid Profit" value={fmt(stats.totalUserProfit)} />
        <AdminMetric label="Referral Bonus Paid" value={fmt(stats.totalTeamBonus)} />
        <AdminMetric label="Paid Today" value={`${stats.paidTodayCount ?? 0} / ${stats.activeCount ?? 0}`} />
        <AdminMetric label="Cancel Charge Collected" value={fmt(stats.totalCancelCharge)} />
      </div>

      {/* Config */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Configuration</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {CONFIG_FIELDS.map(({ key, label }) => (
            <label key={key} className="text-xs text-white/60">
              {label}
              <input
                value={form?.[key] ?? ""}
                onChange={(e) => set(key, e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
              />
            </label>
          ))}
          <label className="text-xs text-white/60 md:col-span-2">
            Referral Level % (comma separated, e.g. 25,15,10,5,3)
            <input
              value={
                Array.isArray(form?.levelPercents)
                  ? form.levelPercents.join(",")
                  : form?.levelPercents ?? ""
              }
              onChange={(e) => set("levelPercents", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
            />
          </label>
          <label className="text-xs text-white/60 md:col-span-2">
            Cron Skip Week Days (0=Sun..6=Sat, comma separated)
            <input
              value={
                Array.isArray(form?.excludedWeekDays)
                  ? form.excludedWeekDays.join(",")
                  : form?.excludedWeekDays ?? ""
              }
              onChange={(e) =>
                set(
                  "excludedWeekDays",
                  e.target.value
                    .split(",")
                    .map((s: string) => Number(s.trim()))
                    .filter((n: number) => Number.isFinite(n)),
                )
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
            />
          </label>
          <label className="flex items-end gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={!!form?.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            Feature Active
          </label>
        </div>
        <button
          onClick={saveConfig}
          disabled={updateState.isLoading}
          className="mt-4 flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 font-bold text-black"
        >
          <Save size={16} /> Save Config
        </button>
      </div>

      {/* Today status */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">
          Today&apos;s Profit Status ({todayData?.dayKey ?? "-"}) — Paid {todayData?.paidCount ?? 0} / {todayData?.total ?? 0}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2">User</th>
                <th>Balance</th>
                <th>Today</th>
                <th>Total Profit</th>
                <th>Total Withdrawn</th>
              </tr>
            </thead>
            <tbody>
              {(todayData?.items ?? []).map((it: any) => (
                <tr key={it.accountId} className="border-t border-white/10">
                  <td className="py-3">
                    {it.user?.name || it.user?.customerId}
                    <br />
                    <span className="text-xs text-white/40">{it.user?.customerId}</span>
                  </td>
                  <td>{fmt(it.balance)}</td>
                  <td>
                    {it.paidToday ? (
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                        Paid {fmt(it.todayProfit)}
                      </span>
                    ) : (
                      <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">Not paid</span>
                    )}
                  </td>
                  <td>{fmt(it.totalUserProfit)}</td>
                  <td>{fmt(it.totalTransferredOut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accounts */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Latest Investment Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2">User</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Total In</th>
                <th>Total Out</th>
                <th>Profit</th>
                <th>Cancel Charge</th>
                <th>Lock Until</th>
              </tr>
            </thead>
            <tbody>
              {(accountsData?.items ?? []).map((a: any) => (
                <tr key={a._id} className="border-t border-white/10">
                  <td className="py-3">
                    {a.userId?.name || a.customerId}
                    <br />
                    <span className="text-xs text-white/40">{a.customerId}</span>
                  </td>
                  <td>{a.status}</td>
                  <td>{fmt(a.balance)}</td>
                  <td>{fmt(a.totalTransferredIn)}</td>
                  <td>{fmt(a.totalTransferredOut)}</td>
                  <td>{fmt(a.totalUserProfit)}</td>
                  <td>{fmt(a.totalCancelCharge)}</td>
                  <td>{a.lockUntil ? new Date(a.lockUntil).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Latest Logs</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="py-2">Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Gross</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {(logsData?.items ?? []).map((l: any) => (
                  <tr key={l._id} className="border-t border-white/10">
                    <td className="py-3">{new Date(l.createdAt).toLocaleString()}</td>
                    <td>{l.userId?.name || l.customerId}</td>
                    <td>{String(l.type).replace(/_/g, " ")}</td>
                    <td>{fmt(l.amount)}</td>
                    <td>{l.grossProfit ? fmt(l.grossProfit) : "-"}</td>
                    <td className="text-white/50">{l.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
