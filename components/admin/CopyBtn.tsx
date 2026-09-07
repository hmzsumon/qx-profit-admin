"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyBtn({
  text,
  title = "Copy",
}: {
  text?: string | null;
  title?: string;
}) {
  const [done, setDone] = useState(false);
  if (!text) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(text));
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={title}
      className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
    >
      {done ? (
        <Check size={13} className="text-emerald-400" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}
