"use client";

import {
  useListTicketsQuery,
  useReplyTicketMutation,
  useSetTicketStatusMutation,
  type Ticket,
} from "@/redux/features/support/supportAdminApi";
import { useState } from "react";
import toast from "react-hot-toast";

const TABS = ["", "open", "pending", "resolved", "closed"] as const;
const label = (s: string) => (s === "" ? "All" : s[0].toUpperCase() + s.slice(1));

const statusCls: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-300",
  pending: "bg-amber-500/15 text-amber-300",
  resolved: "bg-emerald-500/15 text-emerald-300",
  closed: "bg-white/10 text-white/60",
};

export default function TicketDesk() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("");
  const [q, setQ] = useState("");
  const { data, isFetching } = useListTicketsQuery({ status: tab, q });
  const tickets = data?.tickets ?? [];
  const byStatus = data?.byStatus ?? {};

  const [openId, setOpenId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [emailUser, setEmailUser] = useState(true);
  const [nextStatus, setNextStatus] = useState("pending");

  const [sendReply, { isLoading: replying }] = useReplyTicketMutation();
  const [setStatus] = useSetTicketStatusMutation();

  const doReply = async (id: string) => {
    if (reply.trim().length < 1) return;
    try {
      const res = await sendReply({
        id,
        message: reply,
        emailUser,
        status: nextStatus,
      }).unwrap();
      toast.success(
        res.emailSent ? "Reply sent + emailed" : "Reply sent",
      );
      setReply("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not send");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Tickets</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search subject / email / ID"
          className="w-56 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-white outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              tab === t
                ? "bg-emerald-500 text-neutral-950"
                : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            {label(t)}
            {t && byStatus[t] ? ` (${byStatus[t]})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {isFetching && tickets.length === 0 && (
          <p className="text-sm text-white/50">Loading…</p>
        )}
        {!isFetching && tickets.length === 0 && (
          <p className="text-sm text-white/50">No tickets.</p>
        )}
        {tickets.map((t: Ticket) => (
          <div
            key={t._id}
            className="rounded-2xl border border-white/10 bg-black/20 p-3"
          >
            <button
              onClick={() => setOpenId(openId === t._id ? null : t._id)}
              className="flex w-full items-start justify-between gap-3 text-left"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {t.subject}
                </div>
                <div className="text-xs text-white/50">
                  {t.name || t.customerId} · {t.email} ·{" "}
                  {new Date(t.createdAt).toLocaleString()} · {t.category}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  statusCls[t.status] || ""
                }`}
              >
                {t.status}
              </span>
            </button>

            {openId === t._id && (
              <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                <div className="rounded-lg bg-black/30 p-3 text-sm text-white/90">
                  <div className="mb-1 text-[11px] text-white/40">
                    {t.name || "User"}
                  </div>
                  {t.message}
                </div>
                {t.replies.map((r, i) => (
                  <div
                    key={i}
                    className={`rounded-lg p-3 text-sm ${
                      r.from === "admin"
                        ? "bg-sky-500/10 text-white/90"
                        : "bg-black/30 text-white/90"
                    }`}
                  >
                    <div className="mb-1 text-[11px] text-white/40">
                      {r.from === "admin" ? `Support (${r.byName})` : t.name} ·{" "}
                      {new Date(r.createdAt).toLocaleString()}
                      {r.emailSent ? " · emailed" : ""}
                    </div>
                    {r.message}
                  </div>
                ))}

                <textarea
                  value={openId === t._id ? reply : ""}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="Type your reply…"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={emailUser}
                      onChange={(e) => setEmailUser(e.target.checked)}
                      className="accent-sky-500"
                    />
                    Also email the user
                  </label>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs text-white outline-none"
                  >
                    <option value="pending">Set: Pending</option>
                    <option value="open">Set: Open</option>
                    <option value="resolved">Set: Resolved</option>
                    <option value="closed">Set: Closed</option>
                  </select>
                  <button
                    onClick={() => doReply(t._id)}
                    disabled={replying}
                    className="rounded-lg bg-sky-500 px-4 py-1.5 text-sm font-bold text-black disabled:opacity-60"
                  >
                    Send reply
                  </button>
                  <button
                    onClick={() =>
                      setStatus({ id: t._id, status: "resolved" })
                    }
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/5"
                  >
                    Mark resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
