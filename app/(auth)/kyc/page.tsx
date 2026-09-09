"use client";

import { useGetAdminKycRequestsQuery } from "@/redux/features/admin/adminKycApi";
import Link from "next/link";
import { useState } from "react";

const COLS = "sm:grid-cols-[1.4fr_2fr_1fr_0.9fr_1.4fr]";

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "bg-emerald-400/15 text-emerald-400"
      : status === "rejected"
        ? "bg-red-400/15 text-red-400"
        : "bg-yellow-400/15 text-yellow-300";
  return (
    <span className={`rounded-full px-2 py-1 text-xs ${tone}`}>{status}</span>
  );
}

export default function AdminKycPage() {
  const [status, setStatus] = useState("pending");
  const { data, isLoading, isFetching } = useGetAdminKycRequestsQuery({
    page: 1,
    limit: 50,
    status,
  });

  const rows = data?.requests || [];
  const busy = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-7xl space-y-6 px-2 py-6">
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
          {/* header — desktop only */}
          <div
            className={`hidden gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-medium uppercase tracking-wide text-white/50 sm:grid ${COLS}`}
          >
            <span>User</span>
            <span>Email</span>
            <span>Document</span>
            <span>Status</span>
            <span>Submitted</span>
          </div>

          {busy && (
            <div className="px-4 py-6 text-center text-sm text-white/50">
              Loading KYC requests...
            </div>
          )}

          {!busy && !rows.length && (
            <div className="px-4 py-6 text-center text-sm text-white/50">
              No KYC requests found.
            </div>
          )}

          {!busy &&
            rows.map((row: any) => (
              <Link
                key={row._id}
                href={`/kyc/${row._id}`}
                className={`grid grid-cols-1 gap-1.5 border-b border-white/5 px-4 py-3 text-sm transition last:border-b-0 hover:bg-white/[0.03] sm:items-center sm:gap-4 ${COLS}`}
              >
                <div className="flex items-center justify-between gap-2 sm:block">
                  <span className="font-medium text-white">
                    {row.user?.name || "-"}
                  </span>
                  <span className="shrink-0 text-xs font-medium text-teal-300 sm:hidden">
                    Review →
                  </span>
                </div>

                <div className="truncate text-white/70">
                  {row.user?.email || "-"}
                </div>

                <div className="text-white/70">
                  <span className="text-white/40 sm:hidden">Document: </span>
                  {row.document_type || "-"}
                </div>

                <div>
                  <StatusBadge status={row.status} />
                </div>

                <div className="text-xs text-white/50">
                  <span className="text-white/40 sm:hidden">Submitted: </span>
                  {row.submitted_at
                    ? new Date(row.submitted_at).toLocaleString()
                    : "-"}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
