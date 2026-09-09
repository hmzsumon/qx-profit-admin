"use client";

import { Calendar, Check, Pencil, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  /** excludedWeekDays: 0=Sun..6=Sat — the days with NO payout */
  value: number[];
  saving?: boolean;
  onSave: (excludedWeekDays: number[]) => Promise<unknown>;
};

const DAYS = [
  { idx: 0, short: "Sun", long: "Sunday" },
  { idx: 1, short: "Mon", long: "Monday" },
  { idx: 2, short: "Tue", long: "Tuesday" },
  { idx: 3, short: "Wed", long: "Wednesday" },
  { idx: 4, short: "Thu", long: "Thursday" },
  { idx: 5, short: "Fri", long: "Friday" },
  { idx: 6, short: "Sat", long: "Saturday" },
];

// boolean[7], true = profit runs that day
const toEnabled = (excluded: number[]): boolean[] => {
  const ex = new Set((excluded || []).map(Number));
  return DAYS.map((d) => !ex.has(d.idx));
};
const toExcluded = (enabled: boolean[]): number[] =>
  DAYS.filter((d) => !enabled[d.idx]).map((d) => d.idx);

export default function ProfitDaysCard({ value, saving, onSave }: Props) {
  const serverEnabled = toEnabled(value);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<boolean[]>(serverEnabled);

  // keep the draft in sync with server data while not editing
  useEffect(() => {
    if (!editing) setDraft(toEnabled(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value), editing]);

  const view = editing ? draft : serverEnabled;
  const activeCount = view.filter(Boolean).length;
  const todayIdx = new Date().getDay();

  const toggle = (i: number) =>
    setDraft((d) => d.map((v, idx) => (idx === i ? !v : v)));
  const setAll = (on: boolean) => setDraft(DAYS.map(() => on));
  const setWeekdays = () => setDraft(DAYS.map((d) => d.idx >= 1 && d.idx <= 5));

  const cancel = () => {
    setDraft(serverEnabled);
    setEditing(false);
  };

  const save = async () => {
    try {
      await onSave(toExcluded(draft));
      setEditing(false);
    } catch {
      /* toast handled by caller */
    }
  };

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Calendar size={18} className="text-emerald-300" /> Profit Payout Days
          </h2>
          <p className="mt-1 text-xs text-white/55">
            Tick the days the daily profit should run. Unticked days are skipped —
            investors earn nothing on those days.
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

      {/* day checkboxes */}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {DAYS.map((d) => {
          const on = view[d.idx];
          const isToday = d.idx === todayIdx;
          return (
            <button
              key={d.idx}
              type="button"
              disabled={!editing}
              onClick={() => toggle(d.idx)}
              aria-pressed={on}
              className={[
                "flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition",
                editing ? "cursor-pointer" : "cursor-default",
                on
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-white/10 bg-black/25",
                editing && on ? "hover:border-emerald-400/70" : "",
                editing && !on ? "hover:border-white/25" : "",
                isToday ? "ring-2 ring-sky-400/60" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-md border transition",
                  on
                    ? "border-emerald-400 bg-emerald-400 text-black"
                    : "border-white/25 text-transparent",
                ].join(" ")}
              >
                <Check size={13} strokeWidth={3} />
              </span>
              <span
                className={[
                  "text-xs font-bold",
                  on
                    ? "text-emerald-200"
                    : "text-white/40 line-through decoration-white/20",
                ].join(" ")}
              >
                {d.short}
              </span>
            </button>
          );
        })}
      </div>

      {/* footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-white/45">
          {activeCount === 0
            ? "No payout days — profit is fully paused"
            : `Profit runs ${activeCount} day${activeCount === 1 ? "" : "s"} a week`}
          {` · today is ${DAYS[todayIdx].long} (${
            view[todayIdx] ? "payout" : "off"
          })`}
        </span>

        {editing && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAll(true)}
              className="rounded-lg bg-white/10 px-2.5 py-1.5 font-bold text-white hover:bg-white/15"
            >
              All week
            </button>
            <button
              onClick={setWeekdays}
              className="rounded-lg bg-white/10 px-2.5 py-1.5 font-bold text-white hover:bg-white/15"
            >
              Mon–Fri
            </button>
            <button
              onClick={() => setAll(false)}
              className="rounded-lg bg-white/10 px-2.5 py-1.5 font-bold text-white hover:bg-white/15"
            >
              None
            </button>
          </div>
        )}
      </div>

      {editing && activeCount === 0 && (
        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
          With no days ticked the daily profit job will never pay out until you
          re-enable at least one day.
        </p>
      )}

      {!editing && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
          <Check size={12} /> The daily profit job runs every day and pays only on
          the ticked days.
        </p>
      )}
    </div>
  );
}
