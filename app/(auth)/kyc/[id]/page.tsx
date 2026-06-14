"use client";

import {
  useApproveAdminKycRequestMutation,
  useGetAdminKycRequestByIdQuery,
  useRejectAdminKycRequestMutation,
} from "@/redux/features/admin/adminKycApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminKycDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetAdminKycRequestByIdQuery({
    id,
  });
  const [approveKyc, { isLoading: approving }] =
    useApproveAdminKycRequestMutation();
  const [rejectKyc, { isLoading: rejecting }] =
    useRejectAdminKycRequestMutation();

  const [reason, setReason] = useState("");

  const kyc = data?.kyc;

  const approve = async () => {
    try {
      await approveKyc({ id }).unwrap();
      toast.success("KYC approved successfully");
      router.push("/kyc");
    } catch (e: any) {
      toast.error(
        e?.data?.error || e?.data?.message || "Failed to approve KYC",
      );
    }
  };

  const reject = async () => {
    if (reason.trim().length < 3) {
      return toast.error("Please write a reject reason");
    }

    try {
      await rejectKyc({ id, reason: reason.trim() }).unwrap();
      toast.success("KYC rejected successfully");
      router.push("/kyc");
    } catch (e: any) {
      toast.error(e?.data?.error || e?.data?.message || "Failed to reject KYC");
    }
  };

  if (isLoading || isFetching) {
    return <div className="p-6 text-white">Loading KYC request...</div>;
  }

  if (!kyc) {
    return <div className="p-6 text-white">KYC request not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[#0B0D12] p-6 text-[#E6E6E6]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">KYC Review</h1>
            <p className="text-xs text-white/50">
              {kyc.user?.name} • {kyc.user?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/kyc")}
            className="text-sm text-teal-300 hover:underline"
          >
            ← Back
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0E1014] p-5">
            <h3 className="mb-4 text-sm font-semibold text-white/80">
              User Information
            </h3>

            <div className="space-y-2 text-sm text-white/80">
              <div>Name: {kyc.user?.name || "-"}</div>
              <div>Email: {kyc.user?.email || "-"}</div>
              <div>Phone: {kyc.user?.phone || "-"}</div>
              <div>Customer ID: {kyc.user?.customerId || "-"}</div>
              <div>Country of birth: {kyc.country_of_birth || "-"}</div>
              <div>Date of birth: {kyc.date_of_birth || "-"}</div>
              <div>Gender: {kyc.gender || "-"}</div>
              <div>Address: {kyc.residential_address || "-"}</div>
              <div>Document type: {kyc.document_type || "-"}</div>
              <div>Issuing country: {kyc.issuing_country || "-"}</div>
              <div>Status: {kyc.status || "-"}</div>
              <div>
                Submitted at:{" "}
                {kyc.submitted_at
                  ? new Date(kyc.submitted_at).toLocaleString()
                  : "-"}
              </div>
              {kyc.reject_reason ? (
                <div>Reject reason: {kyc.reject_reason}</div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0E1014] p-5">
            <h3 className="mb-4 text-sm font-semibold text-white/80">
              Review Action
            </h3>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write reject reason here..."
              className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={approve}
                disabled={approving || rejecting || kyc.status === "approved"}
                className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-black disabled:opacity-50"
              >
                {approving ? "Approving..." : "Approve"}
              </button>

              <button
                type="button"
                onClick={reject}
                disabled={approving || rejecting || kyc.status === "rejected"}
                className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {rejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {kyc.front_image ? (
            <ImageCard title="Front Image" src={kyc.front_image} />
          ) : null}

          {kyc.back_image ? (
            <ImageCard title="Back Image" src={kyc.back_image} />
          ) : null}

          {kyc.selfie_image ? (
            <ImageCard title="Selfie Image" src={kyc.selfie_image} />
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ImageCard({ title, src }: { title: string; src: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1014] p-4">
      <div className="mb-3 text-sm font-semibold text-white/80">{title}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        className="h-[320px] w-full rounded-xl object-cover"
      />
    </div>
  );
}
