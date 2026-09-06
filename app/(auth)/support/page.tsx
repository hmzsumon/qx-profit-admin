"use client";

import SupportConfigCard from "@/components/support/SupportConfigCard";
import TicketDesk from "@/components/support/TicketDesk";

export default function AdminSupportPage() {
  return (
    <main className="min-h-screen bg-[#0B0D12] text-white">
      <div className="mx-auto w-full max-w-6xl space-y-5 p-4 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
        <SupportConfigCard />
        <TicketDesk />
      </div>
    </main>
  );
}
