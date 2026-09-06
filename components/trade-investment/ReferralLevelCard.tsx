"use client";

import { Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  value: number[];
  saving?: boolean;
  onSave: (next: number[]) => Promise<unknown>;
};

const DEFAULTS = [25, 15, 10, 5, 3];

export default function ReferralLevelCard({ value, saving, onSave }: Props) {
  const current = Array.isArray(value) && value.length ? value : DEFAULTS;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(current.map(String));

  // keep the draft in sync with server data while not editing
  useEffect(() => {
    if (!editing) setDraft(current.map(String));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(current), editing]);

  const total = draft.reduce((s, x) => s + (Number(x) || 0), 0);

  const setAt = (i: number, v: string) =>
    setDraft((d) => d.map((x, idx) => (idx === i ? v.replace(/[^0-9.]/g, "") : x)));

  const addLevel = () => setDraft((d) => [...d, "0"]);
  const removeAt = (i: number) => setDraft((d) => d.filter((_, idx) => idx !== i));

  const cancel = () => {
    setDraft(current.map(String));
    setEditing(false);
  };

  const save = async () => {
    const next = draft
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n) && n >= 0);
    if (next.length === 0) return toast.error("Add at least one level");
    try {
      await onSave(next);
      setEditing(false);
    } catch {
      /* toast handled by caller */
    }
  };

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Referral Level Rewards</h2>
          <p className="mt-1 text-xs text-white/55">
            Each upline level earns this % of the investor&apos;s gross daily
            profit. The investor&apos;s own investment must be active to receive
            referral rewards.
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15"
          >
            <Pencil size={15} /> Edit
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15"
            >
              <X size={15} /> Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
            >
              <Save size={15} /> Save
            </button>
          </div>
        )}
      </div>

      {/* rows */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {draft.map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5"
          >
            <span className="text-sm font-semibold text-white/80">
              Level {i + 1}
            </span>

            {editing ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-white/10 bg-black/40 px-2">
                  <input
                    value={v}
                    inputMode="decimal"
                    onChange={(e) => setAt(i, e.target.value)}
                    className="w-14 bg-transparent py-1 text-right text-white outline-none"
                  />
                  <span className="pl-1 text-white/40">%</span>
                </div>
                <button
                  onClick={() => removeAt(i)}
                  disabled={draft.length <= 1}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-red-300 disabled:opacity-30"
                  aria-label={`Remove level ${i + 1}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-sm font-bold text-emerald-300">
                {Number(v) || 0}%
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-white/45">
        <span>
          {draft.length} level{draft.length === 1 ? "" : "s"} · total{" "}
          {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
        </span>
        {editing && (
          <button
            onClick={addLevel}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-bold text-white hover:bg-white/15"
          >
            <Plus size={14} /> Add level
          </button>
        )}
      </div>

      {!editing && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
          <Check size={12} /> Saved values are used live by the daily profit job
          and shown to users on the QX Investment page.
        </p>
      )}
    </div>
  );
}
