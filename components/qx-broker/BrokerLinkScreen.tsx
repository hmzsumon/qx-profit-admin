"use client";

import {
  useGetBrokerConfigQuery,
  useUpdateBrokerConfigMutation,
} from "@/redux/features/qx-broker/qxBrokerApi";
import { ExternalLink, Link2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BrokerLinkScreen() {
  const { data } = useGetBrokerConfigQuery();
  const [updateConfig, { isLoading }] = useUpdateBrokerConfigMutation();

  const [brokerUrl, setBrokerUrl] = useState("");
  useEffect(() => {
    setBrokerUrl(data?.config?.brokerUrl ?? "");
  }, [data?.config?.brokerUrl]);

  const save = async () => {
    const url = brokerUrl.trim();
    if (url && !/^https?:\/\/.+/i.test(url))
      return toast.error("Link must start with http:// or https://");
    try {
      await toast.promise(updateConfig({ brokerUrl: url }).unwrap(), {
        loading: "Saving…",
        success: "Broker link saved",
        error: (e: any) => e?.data?.message || "Save failed",
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0f141b] px-4 py-6 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-black">QX Broker</h1>
        <p className="mt-1 text-sm text-white/55">
          Users see an “Open QX Broker” button on their QX Broker page. It opens
          this link. Leave it empty to hide the button.
        </p>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Link2 size={16} /> Broker link
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={brokerUrl}
              onChange={(e) => setBrokerUrl(e.target.value)}
              placeholder="https://broker.example.com/..."
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
              >
                <Save size={16} /> Save
              </button>
              {brokerUrl.trim() && (
                <a
                  href={brokerUrl.trim()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  <ExternalLink size={16} /> Test
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
