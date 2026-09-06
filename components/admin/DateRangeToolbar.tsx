"use client";

import type { Preset } from "@/redux/features/admin/adminAnalyticsApi";

/* ────────── Date range toolbar ──────────
   Preset chips + a "pick a day" / custom from-to range. A single-day
   lookup = pick the same date in both inputs (or just the "Day" input).
   ──────────────────────────────────────── */

export type RangeState = { preset: Preset; from: string; to: string };

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "last-month", label: "Last month" },
  { key: "all", label: "All time" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function DateRangeToolbar({
  value,
  onChange,
}: {
  value: RangeState;
  onChange: (next: RangeState) => void;
}) {
  const setPreset = (preset: Preset) => onChange({ ...value, preset });

  const setDay = (day: string) =>
    onChange({ preset: "custom", from: day, to: day });

  const setFrom = (from: string) =>
    onChange({ ...value, preset: "custom", from });
  const setTo = (to: string) => onChange({ ...value, preset: "custom", to });

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#0E1014] p-3">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              value.preset === p.key
                ? "bg-emerald-500 text-neutral-950"
                : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <label className="flex items-center gap-1.5 text-xs text-white/50">
        Day
        <input
          type="date"
          max={todayStr()}
          value={value.preset === "custom" && value.from === value.to ? value.from : ""}
          onChange={(e) => e.target.value && setDay(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-white outline-none"
        />
      </label>

      <label className="flex items-center gap-1.5 text-xs text-white/50">
        From
        <input
          type="date"
          max={todayStr()}
          value={value.preset === "custom" ? value.from : ""}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-white outline-none"
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-white/50">
        To
        <input
          type="date"
          max={todayStr()}
          value={value.preset === "custom" ? value.to : ""}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-white outline-none"
        />
      </label>
    </div>
  );
}

/* client-side [from,to] -> predicate on an ISO date string */
export function inRange(iso: string | undefined, r: RangeState): boolean {
  if (!iso) return false;
  if (r.preset === "all") return true;
  const t = new Date(iso).getTime();
  const now = new Date();
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
  const endOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

  if (r.preset === "today") return t >= startOfDay(now) && t <= Date.now();
  if (r.preset === "week") {
    const s = new Date(now);
    s.setDate(s.getDate() - 6);
    return t >= startOfDay(s);
  }
  if (r.preset === "month") {
    return t >= new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  }
  if (r.preset === "last-month") {
    return (
      t >= new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() &&
      t <= new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime()
    );
  }
  // custom
  const from = r.from ? startOfDay(new Date(r.from)) : 0;
  const to = r.to ? endOfDay(new Date(r.to)) : Date.now();
  return t >= from && t <= to;
}
