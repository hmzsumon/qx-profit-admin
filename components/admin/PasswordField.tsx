"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import CopyBtn from "./CopyBtn";

/* A User-Information row: password hidden by default, eye toggles it. */
export default function PasswordField({ value }: { value?: string | null }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2">
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-wide text-white/40">
          Password
        </div>
        <div className="font-mono text-sm font-medium text-amber-300">
          {value
            ? show
              ? value
              : "•".repeat(Math.min(14, value.length))
            : "-"}
        </div>
      </div>
      {value ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            title={show ? "Hide" : "Show password"}
            className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <CopyBtn text={value} title="Copy password" />
        </div>
      ) : null}
    </div>
  );
}
