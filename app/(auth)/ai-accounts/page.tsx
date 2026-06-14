/* ──────────────────────────────────────────────────────────────────────────
   AI Accounts Page
────────────────────────────────────────────────────────────────────────── */
"use client";

import { AccountPickerSheet } from "@/components/dashboard/AccountPickerSheet";
import { PlanCard } from "@/components/dashboard/PlanCard";
import { SelectedAccountCard } from "@/components/dashboard/SelectedAccountCard";
import {
  useGetAiPlansQuery,
  useGetAllAiAccountsQuery,
} from "@/redux/features/ai-account/ai-accountApi";
import { useMemo, useState } from "react";

type PagePlan = {
  title: string;
  price: number;
  url: string;
  accounts: number;
  key: string;
  subtitle?: string;
};

export default function AiAccountsPage() {
  const { data: plansRes, isLoading: plansLoading } = useGetAiPlansQuery();
  const { data: accountsRes, isLoading: accountsLoading } =
    useGetAllAiAccountsQuery();

  const dbPlans = plansRes?.items ?? [];
  const accounts = accountsRes?.items ?? [];

  console.log("AI Plans:", dbPlans);
  console.log("AI Accounts:", accounts);

  const planCounts = useMemo(() => {
    const map: Record<string, number> = {};

    for (const acc of accounts) {
      const key = String(acc.plan || "")
        .toLowerCase()
        .trim();
      map[key] = (map[key] ?? 0) + 1;
    }

    return map;
  }, [accounts]);

  const plans: PagePlan[] = useMemo(
    () =>
      dbPlans.map((p) => ({
        key: p.key,
        title: p.title,
        price: p.amount,
        url: `/ai-trade?plan=${p.key}`,
        subtitle: p.subtitle,
        accounts: planCounts[p.key] ?? 0,
      })),
    [dbPlans, planCounts],
  );

  const [selected, setSelected] = useState<PagePlan | undefined>();
  const [open, setOpen] = useState(false);

  const isLoading = plansLoading || accountsLoading;

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0b0e11] via-[#0b0e11] to-transparent pt-6 pb-4">
          <h1 className="text-3xl font-bold">AI Accounts</h1>
          <p className="mt-1 text-sm opacity-70">
            Pick a plan to start trading with AI-managed accounts.
          </p>
        </div>

        <div className="mb-6">
          <SelectedAccountCard plan={selected as any} />
        </div>

        {/* ────────── loading state ────────── */}
        {isLoading && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
            Loading AI plans...
          </div>
        )}

        {/* ────────── empty state ────────── */}
        {!isLoading && plans.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-red-400">
            No AI plans found
          </div>
        )}

        {/* ────────── plans grid ────────── */}
        {!isLoading && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((p) => (
              <PlanCard
                key={p.key}
                plan={p as any}
                isSelected={selected?.key === p.key}
                onSelect={() => {
                  setSelected(p);
                  setOpen(true);
                }}
              />
            ))}
          </div>
        )}

        <AccountPickerSheet
          plan={selected as any}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    </div>
  );
}
