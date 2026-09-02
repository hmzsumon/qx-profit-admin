"use client";

import {
  RankTier,
  useCreateRankTierMutation,
  useDeleteRankTierMutation,
  useGetRankAnalyticsQuery,
  useGetRankTiersQuery,
  useUpdateRankTierMutation,
} from "@/redux/features/rank/rankAdminApi";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const usd = (v: number) =>
  `$${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

type Draft = Record<string, Partial<RankTier>>;

export default function AdminRankScreen() {
  const { data } = useGetRankTiersQuery();
  const { data: analytics } = useGetRankAnalyticsQuery({ limit: 30 });
  const [createTier, createState] = useCreateRankTierMutation();
  const [updateTier] = useUpdateRankTierMutation();
  const [deleteTier] = useDeleteRankTierMutation();

  const tiers = data?.tiers ?? [];
  const [draft, setDraft] = useState<Draft>({});
  const [newTier, setNewTier] = useState<Partial<RankTier>>({
    name: "",
    targetVolume: 0,
    rewardUsd: 0,
    isActive: true,
  });

  useEffect(() => {
    const next: Draft = {};
    tiers.forEach((t) => {
      next[t._id] = {
        name: t.name,
        targetVolume: t.targetVolume,
        rewardUsd: t.rewardUsd,
        sortOrder: t.sortOrder,
        isActive: t.isActive,
      };
    });
    setDraft(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const patch = (id: string, k: keyof RankTier, v: any) =>
    setDraft((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));

  const save = async (id: string) => {
    const body = draft[id] || {};
    try {
      await toast.promise(updateTier({ id, body }).unwrap(), {
        loading: "Saving...",
        success: "Tier updated",
        error: (e: any) => e?.data?.message || "Update failed",
      });
    } catch {}
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this rank tier?")) return;
    try {
      await toast.promise(deleteTier(id).unwrap(), {
        loading: "Deleting...",
        success: "Tier deleted",
        error: (e: any) => e?.data?.message || "Delete failed",
      });
    } catch {}
  };

  const add = async () => {
    if (!newTier.name) return toast.error("Name is required");
    try {
      await toast.promise(createTier(newTier).unwrap(), {
        loading: "Creating...",
        success: "Tier created",
        error: (e: any) => e?.data?.message || "Create failed",
      });
      setNewTier({ name: "", targetVolume: 0, rewardUsd: 0, isActive: true });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0f141b] px-4 py-5 text-white">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-amber-500/15 to-fuchsia-500/10 p-5">
        <p className="text-sm text-amber-300">Admin</p>
        <h1 className="text-2xl font-black">Rank Reward Control</h1>
        <p className="mt-1 text-sm text-white/55">
          Targets are measured against each user&apos;s total team investment volume. Add or edit tiers below.
        </p>
      </div>

      {/* Tiers */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Rank Tiers</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2">Key</th>
                <th>Name</th>
                <th>Target Volume</th>
                <th>Reward (USD)</th>
                <th>Order</th>
                <th>Active</th>
                <th>Claimed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => {
                const d = draft[t._id] || {};
                return (
                  <tr key={t._id} className="border-t border-white/10">
                    <td className="py-2 text-white/50">{t.key}</td>
                    <td>
                      <input
                        value={d.name ?? ""}
                        onChange={(e) => patch(t._id, "name", e.target.value)}
                        className="w-24 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
                      />
                    </td>
                    <td>
                      <input
                        value={String(d.targetVolume ?? "")}
                        onChange={(e) => patch(t._id, "targetVolume", Number(e.target.value))}
                        className="w-28 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
                      />
                    </td>
                    <td>
                      <input
                        value={String(d.rewardUsd ?? "")}
                        onChange={(e) => patch(t._id, "rewardUsd", Number(e.target.value))}
                        className="w-24 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
                      />
                    </td>
                    <td>
                      <input
                        value={String(d.sortOrder ?? "")}
                        onChange={(e) => patch(t._id, "sortOrder", Number(e.target.value))}
                        className="w-14 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!d.isActive}
                        onChange={(e) => patch(t._id, "isActive", e.target.checked)}
                      />
                    </td>
                    <td className="text-white/60">{t.claimedCount ?? 0}</td>
                    <td className="flex gap-2 py-2">
                      <button
                        onClick={() => save(t._id)}
                        className="rounded-lg bg-sky-500 p-1.5 text-black"
                        title="Save"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => remove(t._id)}
                        className="rounded-lg bg-red-500 p-1.5 text-white"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add row */}
        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
          <label className="text-xs text-white/60">
            Name
            <input
              value={newTier.name ?? ""}
              onChange={(e) => setNewTier((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 block w-28 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
            />
          </label>
          <label className="text-xs text-white/60">
            Target Volume
            <input
              value={String(newTier.targetVolume ?? "")}
              onChange={(e) => setNewTier((p) => ({ ...p, targetVolume: Number(e.target.value) }))}
              className="mt-1 block w-32 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
            />
          </label>
          <label className="text-xs text-white/60">
            Reward (USD)
            <input
              value={String(newTier.rewardUsd ?? "")}
              onChange={(e) => setNewTier((p) => ({ ...p, rewardUsd: Number(e.target.value) }))}
              className="mt-1 block w-28 rounded-lg border border-white/10 bg-black/30 px-2 py-1"
            />
          </label>
          <button
            onClick={add}
            disabled={createState.isLoading}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black"
          >
            <Plus size={16} /> Add Tier
          </button>
        </div>
      </div>

      {/* Achievers */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-lg font-bold">Rank Achievers</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2">User</th>
                <th>Current Rank</th>
                <th>All Ranks</th>
                <th>Team Volume</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {(analytics?.achievers ?? []).map((a: any, i: number) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="py-2">
                    {a.user?.name || a.user?.customerId}
                    <br />
                    <span className="text-xs text-white/40">{a.user?.customerId}</span>
                  </td>
                  <td className="uppercase">{a.currentRank || "-"}</td>
                  <td className="uppercase">{(a.ranks || []).join(", ") || "-"}</td>
                  <td>{usd(a.teamVolume)}</td>
                  <td>{a.rankUpdatedAt ? new Date(a.rankUpdatedAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
