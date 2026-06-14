"use client";

import { useGetAdminKycRequestsQuery } from "@/redux/features/admin/adminKycApi";
import Link from "next/link";
import { useState } from "react";

export default function AdminKycPage() {
  const [status, setStatus] = useState("pending");
  const { data, isLoading, isFetching } = useGetAdminKycRequestsQuery({
    page: 1,
    limit: 50,
    status,
  });

  const rows = data?.requests || [];

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold">KYC Requests</h1>
          <p className="text-xs text-white/50">
            Review, approve or reject submitted KYC requests
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["pending", "approved", "rejected", "all"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-xl px-4 py-2 text-sm ${
                status === item
                  ? "bg-yellow-400 text-black"
                  : "border border-white/10 bg-white/5 text-white/80"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1014]">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Document</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {(isLoading || isFetching) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-white/50"
                  >
                    Loading KYC requests...
                  </td>
                </tr>
              )}

              {!isLoading && !rows.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-white/50"
                  >
                    No KYC requests found.
                  </td>
                </tr>
              )}

              {rows.map((row: any) => (
                <tr key={row._id} className="border-b border-white/5">
                  <td className="px-4 py-3">{row.user?.name || "-"}</td>
                  <td className="px-4 py-3">{row.user?.email || "-"}</td>
                  <td className="px-4 py-3">{row.document_type || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        row.status === "approved"
                          ? "bg-emerald-400/15 text-emerald-400"
                          : row.status === "rejected"
                            ? "bg-red-400/15 text-red-400"
                            : "bg-yellow-400/15 text-yellow-300"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.submitted_at
                      ? new Date(row.submitted_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/kyc/${row._id}`}
                      className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-3 py-1.5 text-xs text-teal-300 hover:bg-teal-400/15"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
