// /app/(admin)/deposits/manual/page.tsx
"use client";

/* ────────── imports ────────── */
import Button from "@/components/new-ui/Button";
import Card from "@/components/new-ui/Card";
import {
  useCreateManualDepositMutation,
  useLazyPreviewManualDepositQuery,
} from "@/redux/features/deposit/depositApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

// react-hot-toast
import { Toaster, toast } from "react-hot-toast";

/* ────────── helpers ────────── */
const fmtUSD = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

/* ────────── types ────────── */
type PreviewData = {
  ok: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    customerId: string;
    phone?: string;
    is_active?: boolean;
  };
  amount: number;
  current: { m_balance: number; d_balance: number; totalDeposit: number };
  next: { m_balance: number; d_balance: number; totalDeposit: number };
};

export default function AdminManualDepositPage() {
  const router = useRouter();

  /* ────────── local state ────────── */
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isDemo, setIsDemo] = useState(false);

  const [preview, setPreview] = useState<PreviewData | null>(null);

  /* ────────── api hooks ────────── */
  const [triggerPreview, { isLoading: isPreviewLoading }] =
    useLazyPreviewManualDepositQuery();
  const [createDeposit, { isLoading: isCreating }] =
    useCreateManualDepositMutation();

  /* ────────── handlers ────────── */
  const handlePreview = async () => {
    const amt = Number(amount);

    if (!customerId.trim()) {
      toast.error("Customer ID is required");
      return;
    }

    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Valid amount is required");
      return;
    }

    try {
      const res = await triggerPreview({
        customerId: customerId.trim(),
        amount: amt,
      }).unwrap();

      setPreview(res);
      toast.success("Preview loaded");
    } catch (err: any) {
      setPreview(null);
      toast.error(err?.data?.message || "Preview failed");
    }
  };

  const handleConfirm = async () => {
    if (!preview?.ok) return;

    try {
      const res = await createDeposit({
        customerId: preview.user.customerId,
        amount: preview.amount,
        note: note || undefined,
        isDemo,
      }).unwrap();

      toast.success(res?.message || "Deposit completed");
      router.push("/deposits/all");
    } catch (err: any) {
      toast.error(err?.data?.message || "Deposit failed");
    }
  };

  const resetAll = () => {
    setPreview(null);
    setAmount("");
    setCustomerId("");
    setNote("");
    setIsDemo(false);
  };

  /* ────────── UI ────────── */
  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Admin Manual Deposit
        </h2>

        <Card className="p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Customer ID */}
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Customer ID
              </label>
              <input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="U2025XX"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1 block text-sm text-white/70">
                Amount (USDT)
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="100"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            {/* Note */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-white/70">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any note for audit"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            {/* Demo Switch */}
            <div className="sm:col-span-2">
              <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
                <div>
                  <div className="text-sm font-medium text-white">
                    Demo Deposit
                  </div>
                  <div className="text-xs text-white/50">
                    Backend will receive <code>isDemo</code> as true/false
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDemo((prev) => !prev)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    isDemo ? "bg-[#21D3B3]" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      isDemo ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              onClick={handlePreview}
              disabled={isPreviewLoading || isCreating}
            >
              {isPreviewLoading ? "Loading..." : "Preview"}
            </Button>

            <Button
              variant="ghost"
              onClick={resetAll}
              disabled={isPreviewLoading || isCreating}
            >
              Reset
            </Button>
          </div>
        </Card>

        {preview && (
          <Card className="mt-4 p-4">
            <div className="rounded-xl border border-white/10 p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-200">
                Preview
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name" value={preview.user.name} />
                <Field label="Customer ID" value={preview.user.customerId} />
                <Field label="Email" value={preview.user.email} />
                <Field label="Phone" value={preview.user.phone || "-"} />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Stat
                  title="Deposit Amount"
                  value={fmtUSD(preview.amount)}
                  accent
                />
                <Stat
                  title="Current M-Balance"
                  value={fmtUSD(preview.current.m_balance)}
                />
                <Stat
                  title="Next M-Balance"
                  value={fmtUSD(preview.next.m_balance)}
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Stat
                  title="Current D-Balance"
                  value={fmtUSD(preview.current.d_balance)}
                />
                <Stat
                  title="Next D-Balance"
                  value={fmtUSD(preview.next.d_balance)}
                />
                <Stat
                  title="Next Total Deposit"
                  value={fmtUSD(preview.next.totalDeposit)}
                />
              </div>

              <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                <span className="text-white/60">Demo Mode:</span>{" "}
                <span className={isDemo ? "text-[#21D3B3]" : "text-white"}>
                  {isDemo ? "Yes" : "No"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  disabled={isCreating}
                >
                  {isCreating ? "Processing..." : "Confirm Deposit"}
                </Button>

                <Button
                  variant="warning"
                  onClick={() => setPreview(null)}
                  disabled={isCreating}
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        )}

        <p className="mt-4 text-xs text-white/50"></p>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-white/50">
        {label}
      </div>
      <div className="text-sm">{value || "-"}</div>
    </div>
  );
}

function Stat({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
      <div className="text-[11px] uppercase tracking-wide text-white/50">
        {title}
      </div>
      <div
        className={`mt-1 text-base font-semibold ${
          accent ? "text-[#21D3B3]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
