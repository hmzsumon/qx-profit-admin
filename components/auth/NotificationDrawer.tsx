"use client";

import {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationsReadMutation,
} from "@/redux/features/admin/adminNotificationApi";
import { Bell, BellOff, CheckCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const fmt = (s: string) =>
  new Date(s).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function NotificationDrawer({
  open,
  onClose,
  topOffset = 64,
}: {
  open: boolean;
  onClose: () => void;
  topOffset?: number;
}) {
  const { data, isFetching } = useGetAdminNotificationsQuery(undefined, {
    pollingInterval: 20_000,
  });
  const [markRead, { isLoading: marking }] =
    useMarkAdminNotificationsReadMutation();
  const items = data?.notifications ?? [];

  const [soundOn, setSoundOn] = useState(true);
  useEffect(() => {
    try {
      setSoundOn(localStorage.getItem("qx_admin_notif_sound") !== "0");
    } catch {}
  }, []);
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      localStorage.setItem("qx_admin_notif_sound", next ? "1" : "0");
    } catch {}
    if (next) {
      try {
        const a = new Audio("/sounds/notify.wav");
        a.volume = 0.6;
        void a.play().catch(() => {});
      } catch {}
    }
  };

  const markAll = () => {
    if (!items.length) return;
    markRead({ notificationIds: items.map((n) => n._id) });
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: topOffset }}
      />
      <aside
        className={`fixed right-0 z-[61] flex h-[calc(100dvh-4rem)] w-full max-w-[380px] flex-col border-l border-neutral-900 bg-neutral-950 transition-transform md:max-w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: topOffset }}
        aria-hidden={!open}
      >
        <div className="flex h-12 items-center justify-between border-b border-neutral-900 px-4">
          <div className="text-sm font-semibold text-white">
            Notifications
            {items.length ? (
              <span className="ml-2 rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-200">
                {items.length}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              title={soundOn ? "Sound on" : "Sound off"}
              className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              {soundOn ? <Bell size={16} /> : <BellOff size={16} />}
            </button>
            <button
              onClick={markAll}
              disabled={marking || !items.length}
              title="Mark all read"
              className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white disabled:opacity-40"
            >
              <CheckCheck size={16} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 text-sm text-neutral-300">
          {isFetching && items.length === 0 ? (
            "Loading…"
          ) : items.length === 0 ? (
            "You currently have no new notifications."
          ) : (
            <ul className="space-y-2">
              {items.map((n) => (
                <li
                  key={n._id}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3"
                >
                  <div className="text-white">{n.title || "Notification"}</div>
                  {n.message && (
                    <div className="mt-0.5 text-xs text-neutral-400">
                      {n.message}
                    </div>
                  )}
                  <div className="mt-1 text-[11px] text-neutral-500">
                    {fmt(n.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
