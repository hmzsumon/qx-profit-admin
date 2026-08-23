"use client";

export default function AdminMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-white/50">{label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></div>;
}
