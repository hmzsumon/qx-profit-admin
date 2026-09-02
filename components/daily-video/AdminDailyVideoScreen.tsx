"use client";

import {
  DailyVideo,
  useConfirmDailyVideoMutation,
  useCreateDailyVideoUploadUrlMutation,
  useDeleteDailyVideoMutation,
  useGetAdminDailyVideosQuery,
  useUpdateDailyVideoMutation,
} from "@/redux/features/daily-video/dailyVideoAdminApi";
import {
  readVideoDuration,
  uploadToR2,
} from "@/redux/features/daily-video/uploadToR2";
import { CheckCircle2, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const fmtSize = (b?: number) =>
  !b ? "—" : `${(b / (1024 * 1024)).toFixed(1)} MB`;

const todayInput = () => new Date().toISOString().slice(0, 10);

export default function AdminDailyVideoScreen() {
  const { data, isLoading } = useGetAdminDailyVideosQuery({ page: 1, limit: 50 });
  const [createUploadUrl] = useCreateDailyVideoUploadUrlMutation();
  const [confirmVideo] = useConfirmDailyVideoMutation();
  const [updateVideo] = useUpdateDailyVideoMutation();
  const [deleteVideo] = useDeleteDailyVideoMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState(todayInput());
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const videos = data?.videos ?? [];
  const liveIds = useMemo(
    () =>
      new Set(
        [...videos]
          .filter((v) => v.status === "ready" && v.isActive)
          .slice(0, 3)
          .map((v) => v._id),
      ),
    [videos],
  );

  const reset = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setPublishDate(todayInput());
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onUpload = async () => {
    if (!file) return toast.error("Choose a video file first");
    if (!title.trim()) return toast.error("Give the video a title");

    setBusy(true);
    setProgress(0);
    try {
      const durationSec = await readVideoDuration(file);
      const res = await createUploadUrl({
        fileName: file.name,
        contentType: file.type || "video/mp4",
        sizeBytes: file.size,
      }).unwrap();

      await uploadToR2(res.uploadUrl, file, setProgress);

      await confirmVideo({
        id: res.id,
        title: title.trim(),
        description: description.trim() || undefined,
        publishDate: new Date(publishDate).toISOString(),
        durationSec,
      }).unwrap();

      toast.success("Video published");
      reset();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (v: DailyVideo) => {
    try {
      await updateVideo({ id: v._id, body: { isActive: !v.isActive } }).unwrap();
    } catch {
      toast.error("Update failed");
    }
  };

  const onDelete = async (v: DailyVideo) => {
    if (!confirm(`Remove "${v.title}" from the list? The file stays in Cloudflare.`))
      return;
    try {
      await deleteVideo(v._id).unwrap();
      toast.success("Removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-white">
      <h1 className="text-2xl font-bold">Daily Video</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Upload the video users see on their dashboard. The newest three active
        videos are shown to users (newest first).
      </p>

      {/* Upload card */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <UploadCloud size={18} /> New upload
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-neutral-400">
              Video file (mp4)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/*"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""));
              }}
              className="block w-full text-sm text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-neutral-200"
            />
            {file && (
              <p className="mt-1 text-xs text-neutral-500">{fmtSize(file.size)}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Title</label>
            <input
              value={title}
              disabled={busy}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">
              Publish date
            </label>
            <input
              type="date"
              value={publishDate}
              disabled={busy}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-neutral-400">
              Description (optional)
            </label>
            <textarea
              value={description}
              disabled={busy}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
            />
          </div>
        </div>

        {progress !== null && (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {progress < 100 ? `Uploading ${progress}%` : "Finishing…"}
            </p>
          </div>
        )}

        <button
          onClick={onUpload}
          disabled={busy}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          <UploadCloud size={16} />
          {busy ? "Working…" : "Upload & publish"}
        </button>
      </div>

      {/* History */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-300">History</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-neutral-500">Loading…</p>
        ) : videos.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">No videos yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-neutral-900/70 text-xs uppercase text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Publish date</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {videos.map((v) => (
                  <tr key={v._id} className="hover:bg-neutral-900/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {liveIds.has(v._id) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 size={12} /> Live
                          </span>
                        )}
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium hover:underline"
                        >
                          {v.title}
                        </a>
                      </div>
                      {v.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                          {v.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {fmtDate(v.publishDate)}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {fmtSize(v.sizeBytes)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          v.status === "ready"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(v)}
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          v.isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {v.isActive ? "On" : "Off"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDelete(v)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-red-400"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
