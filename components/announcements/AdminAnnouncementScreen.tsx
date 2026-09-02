"use client";

import {
  Announcement,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAdminAnnouncementsQuery,
  useUpdateAnnouncementMutation,
} from "@/redux/features/announcement/announcementAdminApi";
import { Megaphone, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const fmt = (s: string) => new Date(s).toLocaleString();

export default function AdminAnnouncementScreen() {
  const { data, isLoading } = useGetAdminAnnouncementsQuery({ page: 1, limit: 50 });
  const [create, { isLoading: creating }] = useCreateAnnouncementMutation();
  const [update] = useUpdateAnnouncementMutation();
  const [remove] = useDeleteAnnouncementMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const items = data?.items ?? [];

  const submit = async () => {
    if (!title.trim()) return toast.error("Title is required");
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("message", message.trim());
    if (image) fd.append("image", image);
    try {
      await create(fd).unwrap();
      toast.success("Announcement sent");
      setTitle("");
      setMessage("");
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const toggle = async (a: Announcement) => {
    try {
      await update({ id: a._id, body: { isActive: !a.isActive } }).unwrap();
    } catch {
      toast.error("Update failed");
    }
  };

  const del = async (a: Announcement) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try {
      await remove(a._id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 text-white">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Megaphone size={22} /> Announcements
      </h1>
      <p className="mt-1 text-sm text-neutral-400">
        Send a notice to all users. An optional image is shown in the feed.
      </p>

      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="grid gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Message (optional)"
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-neutral-200"
          />
          <button
            onClick={submit}
            disabled={creating}
            className="justify-self-start rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 disabled:opacity-50"
          >
            {creating ? "Sending…" : "Send announcement"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-300">Sent</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-neutral-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Nothing yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {items.map((a) => (
              <div
                key={a._id}
                className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-3"
              >
                {a.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.imageUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  {a.message && (
                    <p className="line-clamp-2 text-xs text-neutral-400">
                      {a.message}
                    </p>
                  )}
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    {fmt(a.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggle(a)}
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    a.isActive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {a.isActive ? "Active" : "Hidden"}
                </button>
                <button
                  onClick={() => del(a)}
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
