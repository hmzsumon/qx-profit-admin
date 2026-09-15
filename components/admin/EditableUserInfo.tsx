/* ────────── imports ────────── */
"use client";
import CopyBtn from "@/components/admin/CopyBtn";
import CountrySelectPro from "@/components/profile/CountrySelectPro";
import UserPropertyItem from "@/components/admin/UserPropertyItem";
import {
  useUpdateUserProfileMutation,
  type AdminUserRow,
} from "@/redux/features/admin/adminUsersApi";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/* ────────── component ────────── */
export default function EditableUserInfo({ user }: { user: AdminUserRow }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
  });
  const [updateProfile, { isLoading: saving }] = useUpdateUserProfileMutation();

  const startEdit = () => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      country: user.country ?? "",
    });
    setEditing(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");

    try {
      await updateProfile({
        id: user._id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
      }).unwrap();
      toast.success("Profile updated");
      setEditing(false);
    } catch (e: any) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  if (!editing) {
    return (
      <div>
        <UserPropertyItem
          label="Name"
          value={user.name}
          addon={
            <button
              onClick={startEdit}
              type="button"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-teal-300 hover:bg-white/10"
            >
              <Pencil size={13} /> Edit
            </button>
          }
        />
        <UserPropertyItem
          label="Email"
          value={user.email}
          addon={<CopyBtn text={user.email} title="Copy email" />}
        />
        <UserPropertyItem
          label="Phone"
          value={user.phone}
          addon={<CopyBtn text={user.phone} title="Copy phone" />}
        />
        <UserPropertyItem label="Country" value={user.country} />
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-teal-400/20 bg-teal-400/[0.03] p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-300">
          Edit profile
        </span>
        <button
          onClick={() => setEditing(false)}
          type="button"
          className="text-white/40 hover:text-white/70"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>
      </div>

      <label className="block space-y-1">
        <span className="text-xs text-white/50">Name</span>
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-teal-400/40"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-white/50">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-teal-400/40"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-white/50">Phone</span>
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-teal-400/40"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-white/50">Country</span>
        <CountrySelectPro
          value={form.country}
          onChange={(val) => setForm((f) => ({ ...f, country: val ?? "" }))}
        />
      </label>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={() => setEditing(false)}
          type="button"
          disabled={saving}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={save}
          type="button"
          disabled={saving}
          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
