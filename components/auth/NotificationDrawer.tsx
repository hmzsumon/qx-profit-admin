"use client";

import { X } from "lucide-react";

export default function NotificationDrawer({
  open,
  onClose,
  topOffset = 64, // header height
}: {
  open: boolean;
  onClose: () => void;
  topOffset?: number;
}) {
  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: topOffset }}
      />
      {/* panel */}
      <aside
        className={`fixed right-0 z-[61] h-[calc(100dvh-4rem)] w-full max-w-[380px] translate-x-0 border-l border-neutral-900 bg-neutral-950 transition-transform md:max-w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: topOffset }}
        aria-hidden={!open}
      >
        <div className="flex h-12 items-center justify-between border-b border-neutral-900 px-4">
          <div className="text-sm font-semibold text-white">Notifications</div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 text-sm text-neutral-300">
          You currently have no new notifications.
        </div>
      </aside>
    </>
  );
}
