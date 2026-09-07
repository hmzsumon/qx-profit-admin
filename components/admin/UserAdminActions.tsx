"use client";

import ToggleSwitch from "@/components/ToggleSwitch";
import {
  useDeleteUserMutation,
  useSetUserFlagsMutation,
  type AdminUserRow,
} from "@/redux/features/admin/adminUsersApi";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UserAdminActions({ user }: { user: AdminUserRow }) {
  const router = useRouter();
  const [setFlags, { isLoading: saving }] = useSetUserFlagsMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const [confirm, setConfirm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const flag = async (
    key: "is_active" | "is_withdraw_block" | "is_block",
    value: boolean,
    labelOn: string,
    labelOff: string,
  ) => {
    try {
      await setFlags({ id: user._id, [key]: value }).unwrap();
      toast.success(value ? labelOn : labelOff);
    } catch (e: any) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  const doDelete = async () => {
    try {
      await deleteUser({ id: user._id }).unwrap();
      toast.success("User and all data removed");
      router.push("/users");
    } catch (e: any) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const canDelete = user.role === "user";

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0E1014] p-6">
      <h3 className="mb-4 text-sm font-semibold text-white/80">Account actions</h3>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <span className="text-sm text-white/80">Active</span>
          <ToggleSwitch
            title=""
            checked={!!user.is_active}
            onChange={(v) =>
              flag("is_active", v, "User activated", "User set to inactive")
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <span className="text-sm text-white/80">Withdraw blocked</span>
          <ToggleSwitch
            title=""
            checked={!!user.is_withdraw_block}
            onChange={(v) =>
              flag(
                "is_withdraw_block",
                v,
                "Withdrawals blocked",
                "Withdrawals unblocked",
              )
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <span className="text-sm text-white/80">Blocked</span>
          <ToggleSwitch
            title=""
            checked={!!user.is_block}
            onChange={(v) =>
              flag("is_block", v, "Account blocked", "Account unblocked")
            }
          />
        </div>
      </div>

      {/* delete */}
      <div className="mt-4">
        <button
          onClick={() => setShowModal(true)}
          disabled={!canDelete || saving}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-40"
        >
          <Trash2 size={15} /> Delete user & all data
        </button>
        {!canDelete && (
          <p className="mt-1 text-xs text-white/40">
            Only role &quot;user&quot; accounts can be deleted.
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E1014] p-5">
            <h4 className="text-base font-bold text-white">Delete this user?</h4>
            <p className="mt-2 text-sm text-white/60">
              This permanently removes the account and every related record
              (deposits, withdrawals, transactions, KYC, investment, team links).
              It cannot be undone.
            </p>
            <p className="mt-3 text-xs text-white/50">
              Type <span className="font-mono text-white">{user.customerId}</span>{" "}
              to confirm:
            </p>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirm("");
                }}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={confirm !== user.customerId || deleting}
                className="rounded-lg bg-rose-500 px-4 py-1.5 text-sm font-bold text-white disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
