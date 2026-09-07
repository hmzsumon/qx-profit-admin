"use client";

import { useGetAdminTransactionsQuery } from "@/redux/features/admin/adminUsersApi";
import Link from "next/link";
import { useState } from "react";

const fmtCurrency = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
const fmtDate = (s?: string) =>
  s
    ? new Date(s).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export default function AllTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [flow, setFlow] = useState<"" | "in" | "out">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isFetching } = useGetAdminTransactionsQuery({
    page,
    limit: 30,
    search: search || undefined,
    transactionType: type || undefined,
    isCashIn: flow === "in" ? "true" : undefined,
    isCashOut: flow === "out" ? "true" : undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const rows = data?.transactions ?? [];
  const types = data?.types ?? [];
  const pg = data?.pagination;

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <h1 className="mb-4 text-xl font-semibold">All Transactions</h1>

        {/* filters */}
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-6">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search ID / purpose"
            className="col-span-2 rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2 text-sm outline-none placeholder:text-white/40"
          />
          <select
            value={type}
            onChange={(e) => {
              setPage(1);
              setType(e.target.value);
            }}
            className="rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={flow}
            onChange={(e) => {
              setPage(1);
              setFlow(e.target.value as any);
            }}
            className="rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2 text-sm"
          >
            <option value="">In & Out</option>
            <option value="in">Cash in</option>
            <option value="out">Cash out</option>
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setPage(1);
              setFrom(e.target.value);
            }}
            className="rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setPage(1);
              setTo(e.target.value);
            }}
            className="rounded-xl border border-white/10 bg-[#0E1014] px-3 py-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0E1014]">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th>User</th>
                <th>Type</th>
                <th>Purpose</th>
                <th className="text-right">Amount</th>
                <th className="px-3 text-right">Balance after</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-white/50">
                    Loading…
                  </td>
                </tr>
              )}
              {!isFetching && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-white/50">
                    No transactions.
                  </td>
                </tr>
              )}
              {rows.map((t) => (
                <tr key={t._id} className="border-t border-white/10">
                  <td className="px-3 py-2.5 text-white/70">
                    {fmtDate(t.createdAt)}
                  </td>
                  <td>
                    <Link
                      href={`/users/${t.userId}`}
                      className="text-teal-300 hover:underline"
                    >
                      {t.userName || t.customerId}
                    </Link>
                    <span className="ml-1 text-xs text-white/40">
                      {t.customerId}
                    </span>
                  </td>
                  <td className="text-white/80">{t.transactionType}</td>
                  <td className="text-white/60">{t.purpose || "-"}</td>
                  <td
                    className={`text-right font-medium ${
                      t.isCashIn ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {t.isCashIn ? "+" : "-"}
                    {fmtCurrency(Math.abs(Number(t.amount || 0)))}
                  </td>
                  <td className="px-3 text-right text-white/70">
                    {fmtCurrency(t.current_m_balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pager */}
        {pg && pg.totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between text-sm text-white/60">
            <span>
              Page {pg.page} / {pg.totalPages} · {pg.total} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pg.hasMore}
                className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
