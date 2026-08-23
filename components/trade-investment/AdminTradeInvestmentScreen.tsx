"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Play, Save } from "lucide-react";
import { useGetAdminTradeInvestmentAccountsQuery, useGetAdminTradeInvestmentDashboardQuery, useGetAdminTradeInvestmentLogsQuery, useRunAdminTradeInvestmentProfitMutation, useUpdateAdminTradeInvestmentConfigMutation } from "@/redux/features/trade-investment/tradeInvestmentAdminApi";
import AdminMetric from "./AdminMetric";

const fmt = (v: number) => `${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })} USDT`;

export default function AdminTradeInvestmentScreen() {
  const { data, isLoading } = useGetAdminTradeInvestmentDashboardQuery();
  const { data: accountsData } = useGetAdminTradeInvestmentAccountsQuery({ limit: 20 });
  const { data: logsData } = useGetAdminTradeInvestmentLogsQuery(80);
  const [updateConfig, updateState] = useUpdateAdminTradeInvestmentConfigMutation();
  const [runProfit, runState] = useRunAdminTradeInvestmentProfitMutation();
  const config = data?.config;
  const stats = data?.stats || {};
  const [form, setForm] = useState<any>({});

  useEffect(() => { if (config) setForm(config); }, [config]);
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const saveConfig = async () => {
    try { await toast.promise(updateConfig({ ...form, levelPercents: String(form.levelPercents || "").split(",").map(Number) }).unwrap(), { loading: "Saving...", success: "Config updated ✅", error: (e: any) => e?.data?.message || "Update failed" }); } catch {}
  };
  const manualRun = async (dryRun = true) => {
    try { const res = await toast.promise(runProfit({ dryRun }).unwrap(), { loading: dryRun ? "Checking..." : "Running profit...", success: dryRun ? "Dry run complete ✅" : "Profit distributed ✅", error: (e: any) => e?.data?.message || "Run failed" }); console.log(res); } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0f141b] px-4 py-5 text-white">
      {/* ────────── Page Header ────────── */}
      <div className="flex flex-col justify-between gap-3 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/15 to-sky-500/10 p-5 md:flex-row md:items-center">
        <div><p className="text-sm text-emerald-300">Admin Analytics</p><h1 className="text-2xl font-black">Trade Investment Control</h1><p className="mt-1 text-sm text-white/55">Profit %, lock days, generation bonus and company cut manage করুন।</p></div>
        <div className="flex gap-2"><button onClick={() => manualRun(true)} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold">Dry Run</button><button onClick={() => manualRun(false)} disabled={runState.isLoading} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black"><Play size={16}/> Run Profit</button></div>
      </div>

      {/* ────────── Metrics ────────── */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <AdminMetric label="Active Investments" value={String(stats.activeCount ?? 0)} />
        <AdminMetric label="Inactive Investments" value={String(stats.inactiveCount ?? 0)} />
        <AdminMetric label="Total Invest Balance" value={fmt(stats.totalBalance)} />
        <AdminMetric label="Total Paid Profit" value={fmt(stats.totalUserProfit)} />
        <AdminMetric label="Team Bonus Paid" value={fmt(stats.totalTeamBonus)} />
        <AdminMetric label="Company Cut" value={fmt(stats.totalCompanyCut)} />
        <AdminMetric label="Daily Profit %" value={`${config?.dailyProfitPercent ?? 0}%`} />
        <AdminMetric label="Lock Days" value={`${config?.lockDays ?? 0} Days`} />
      </div>

      {/* ────────── Config Form ────────── */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Trade Investment Config</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {["minAmount", "lockDays", "dailyProfitPercent", "userProfitPercent", "teamBonusPercent", "companyPercent"].map((k) => <label key={k} className="text-xs text-white/60">{k}<input value={form?.[k] ?? ""} onChange={(e) => set(k, e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none" /></label>)}
          <label className="text-xs text-white/60 md:col-span-2">levelPercents (comma)<input value={Array.isArray(form?.levelPercents) ? form.levelPercents.join(",") : form?.levelPercents ?? ""} onChange={(e) => set("levelPercents", e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none" /></label>
          <label className="flex items-end gap-2 text-xs text-white/60"><input type="checkbox" checked={!!form?.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Active</label>
        </div>
        <button onClick={saveConfig} disabled={updateState.isLoading} className="mt-4 flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 font-bold text-black"><Save size={16}/> Save Config</button>
      </div>

      {/* ────────── Accounts Table ────────── */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Latest Investment Accounts</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="text-white/50"><tr><th className="py-2">User</th><th>Status</th><th>Balance</th><th>Total In</th><th>Total Out</th><th>Profit</th><th>Lock Until</th></tr></thead><tbody>{(accountsData?.items ?? []).map((a: any) => <tr key={a._id} className="border-t border-white/10"><td className="py-3">{a.userId?.name || a.customerId}<br/><span className="text-xs text-white/40">{a.customerId}</span></td><td>{a.status}</td><td>{fmt(a.balance)}</td><td>{fmt(a.totalTransferredIn)}</td><td>{fmt(a.totalTransferredOut)}</td><td>{fmt(a.totalUserProfit)}</td><td>{a.lockUntil ? new Date(a.lockUntil).toLocaleString() : "-"}</td></tr>)}</tbody></table></div>
      </div>

      {/* ────────── Logs Table ────────── */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Latest Logs</h2>
        {isLoading ? <p>Loading...</p> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-white/50"><tr><th className="py-2">Date</th><th>User</th><th>Type</th><th>Amount</th><th>Gross</th><th>Note</th></tr></thead><tbody>{(logsData?.items ?? []).map((l: any) => <tr key={l._id} className="border-t border-white/10"><td className="py-3">{new Date(l.createdAt).toLocaleString()}</td><td>{l.userId?.name || l.customerId}</td><td>{String(l.type).replace(/_/g, " ")}</td><td>{fmt(l.amount)}</td><td>{l.grossProfit ? fmt(l.grossProfit) : "-"}</td><td className="text-white/50">{l.note || "-"}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
}
