"use client";

import {
  useGetSupportConfigQuery,
  useUpdateSupportConfigMutation,
  type SupportConfig,
} from "@/redux/features/support/supportAdminApi";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FIELDS: { key: keyof SupportConfig; label: string; hint?: string }[] = [
  { key: "email", label: "Support email" },
  { key: "telegram", label: "Telegram", hint: "@handle or full URL" },
  { key: "whatsapp", label: "WhatsApp", hint: "digits with country code" },
  { key: "hotline", label: "Hotline / phone" },
  { key: "workingHours", label: "Working hours" },
  { key: "liveChatUrl", label: "Live chat URL" },
  { key: "apkUrl", label: "App (.apk) URL" },
  { key: "businessPlanPdfUrl", label: "Business plan PDF URL" },
  { key: "faqUrl", label: "FAQ URL" },
];

export default function SupportConfigCard() {
  const { data } = useGetSupportConfigQuery();
  const [update, { isLoading }] = useUpdateSupportConfigMutation();
  const [form, setForm] = useState<Partial<SupportConfig>>({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = async () => {
    try {
      await toast.promise(update(form).unwrap(), {
        loading: "Saving…",
        success: "Support settings saved",
        error: (e: any) => e?.data?.message || "Update failed",
      });
    } catch {
      /* toast handled */
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <h2 className="text-lg font-bold text-white">Contact channels</h2>
      <p className="mt-0.5 text-xs text-white/55">
        Shown on the user Support page. Leave a field blank to hide that channel.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map(({ key, label, hint }) => (
          <label key={key} className="text-xs text-white/60">
            {label}
            {hint && <span className="ml-1 text-white/35">({hint})</span>}
            <input
              value={(form[key] as string) ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, [key]: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
            />
          </label>
        ))}
      </div>

      <button
        onClick={save}
        disabled={isLoading}
        className="mt-4 flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
      >
        <Save size={15} /> Save
      </button>
    </div>
  );
}
