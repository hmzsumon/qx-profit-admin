"use client";

import ToggleSwitch from "@/components/ToggleSwitch";
import {
  useGetWithdrawConfigQuery,
  useUpdateWithdrawConfigMutation,
  type WithdrawConfig,
} from "@/redux/features/withdraw/withdrawConfigApi";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NUM_FIELDS: { key: keyof WithdrawConfig; label: string; hint?: string }[] = [
  { key: "feePercent", label: "Commission (%)", hint: "0 = no fee" },
  { key: "minAmount", label: "Minimum (USDT)" },
  { key: "maxAmount", label: "Maximum (USDT)", hint: "0 = unlimited" },
];

export default function WithdrawSettingsCard() {
  const { data: config } = useGetWithdrawConfigQuery();
  const [updateConfig, { isLoading: saving }] = useUpdateWithdrawConfigMutation();

  const [form, setForm] = useState<Partial<WithdrawConfig>>({});
  const [presets, setPresets] = useState<string[]>([]);
  useEffect(() => {
    if (config) {
      setForm(config);
      setPresets((config.presetAmounts ?? []).map(String));
    }
  }, [config]);

  const set = (k: keyof WithdrawConfig, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setPresetAt = (i: number, v: string) =>
    setPresets((p) => p.map((x, idx) => (idx === i ? v.replace(/[^0-9.]/g, "") : x)));
  const addPreset = () => setPresets((p) => [...p, ""]);
  const removePreset = (i: number) =>
    setPresets((p) => p.filter((_, idx) => idx !== i));

  const patch = async (body: Partial<WithdrawConfig>, msg: string) => {
    try {
      await toast.promise(updateConfig(body).unwrap(), {
        loading: "Saving...",
        success: msg,
        error: (e: any) => e?.data?.message || "Update failed",
      });
    } catch {
      /* handled by toast */
    }
  };

  const toggleActive = (v: boolean) => {
    set("isActive", v);
    patch({ isActive: v }, v ? "Withdrawals enabled" : "Withdrawals disabled");
  };

  const toggleKyc = (v: boolean) => {
    set("requireKyc", v);
    patch({ requireKyc: v }, "Saved");
  };

  const saveAll = () => {
    const presetAmounts = presets
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (presetAmounts.length === 0) {
      toast.error("Add at least one quick amount");
      return;
    }
    patch(
      {
        feePercent: Number(form.feePercent) || 0,
        minAmount: Number(form.minAmount) || 0,
        maxAmount: Number(form.maxAmount) || 0,
        presetAmounts,
        processingTime: String(form.processingTime || "").trim() || undefined,
      },
      "Withdrawal settings saved",
    );
  };

  const active = !!form.isActive;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Withdrawal settings</h2>
          <p className="mt-0.5 text-xs text-white/55">
            Master switch, commission, limits and processing time.
          </p>
        </div>

        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 ${
            active
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10"
          }`}
        >
          <span
            className={`text-sm font-bold ${
              active ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {active ? "Withdrawals ON" : "Withdrawals OFF"}
          </span>
          <ToggleSwitch title="" checked={active} onChange={toggleActive} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {NUM_FIELDS.map(({ key, label, hint }) => (
          <label key={key} className="text-xs text-white/60">
            {label}
            {hint && <span className="ml-1 text-white/35">({hint})</span>}
            <input
              value={(form[key] as number) ?? ""}
              inputMode="decimal"
              onChange={(e) =>
                set(key, e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
            />
          </label>
        ))}

        <label className="text-xs text-white/60">
          Processing time (text)
          <input
            value={form.processingTime ?? ""}
            onChange={(e) => set("processingTime", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
          />
        </label>
      </div>

      {/* quick amount chips shown on the user withdraw form */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-white/70">
            Quick amounts (chips on the withdraw page)
          </p>
          <button
            onClick={addPreset}
            className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white hover:bg-white/15"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 py-1"
            >
              <span className="text-white/40">$</span>
              <input
                value={v}
                inputMode="decimal"
                onChange={(e) => setPresetAt(i, e.target.value)}
                className="w-14 bg-transparent text-white outline-none"
              />
              <button
                onClick={() => removePreset(i)}
                className="rounded p-0.5 text-white/40 hover:bg-white/10 hover:text-rose-300"
                aria-label={`Remove amount ${i + 1}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {presets.length === 0 && (
            <span className="text-xs text-white/35">
              No quick amounts — users must type a custom amount.
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <ToggleSwitch
            title=""
            checked={!!form.requireKyc}
            onChange={toggleKyc}
          />
          <span className="text-sm text-white/80">
            Require approved KYC to withdraw
          </span>
        </div>

        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
        >
          <Save size={15} /> Save settings
        </button>
      </div>
    </div>
  );
}
