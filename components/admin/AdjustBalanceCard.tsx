/* ────────── imports ────────── */
"use client";
import {
  useAdjustUserBalanceMutation,
  type AdminUserRow,
} from "@/redux/features/admin/adminUsersApi";
import { useState } from "react";
import toast from "react-hot-toast";

/* ────────── helpers ────────── */
const fmtCurrency = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

/* ────────── component ────────── */
export default function AdjustBalanceCard({ user }: { user: AdminUserRow }) {
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [adjustBalance, { isLoading: saving }] = useAdjustUserBalanceMutation();

  const submit = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0)
      return toast.error("Enter a valid amount greater than 0");

    try {
      await adjustBalance({
        id: user._id,
        amount: mode === "add" ? value : -value,
        note: note.trim() || undefined,
      }).unwrap();
      toast.success(
        mode === "add"
          ? `Added ${fmtCurrency(value)} to balance`
          : `Deducted ${fmtCurrency(value)} from balance`,
      );
      setAmount("");
      setNote("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0E1014] p-6">
      <h3 className="mb-4 text-sm font-semibold text-white/80">
        Update balance
      </h3>
      <p className="mb-4 text-xs text-white/50">
        Current main balance:{" "}
        <span className="font-semibold text-white/80">
          {fmtCurrency(user.m_balance)}
        </span>
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setMode("add")}
            className={`px-3 py-2 text-sm font-medium ${
              mode === "add"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-black/20 text-white/50 hover:bg-white/5"
            }`}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setMode("subtract")}
            className={`px-3 py-2 text-sm font-medium ${
              mode === "subtract"
                ? "bg-rose-500/20 text-rose-300"
                : "bg-black/20 text-white/50 hover:bg-white/5"
            }`}
          >
            Subtract
          </button>
        </div>

        <label className="block space-y-1">
          <span className="text-xs text-white/50">Amount (USDT)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-36 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-teal-400/40"
          />
        </label>

        <label className="block flex-1 min-w-[200px] space-y-1">
          <span className="text-xs text-white/50">Note (optional)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for adjustment"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-teal-400/40"
          />
        </label>

        <button
          onClick={submit}
          type="button"
          disabled={saving}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-black disabled:opacity-40 ${
            mode === "add" ? "bg-emerald-400" : "bg-rose-400"
          }`}
        >
          {saving ? "Saving…" : mode === "add" ? "Add balance" : "Subtract balance"}
        </button>
      </div>
    </section>
  );
}
