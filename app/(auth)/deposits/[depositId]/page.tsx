"use client";

/* ────────── imports ────────── */
import Card from "@/components/new-ui/Card";
import { Row } from "@/components/new-ui/DetailsList";
import CopyToClipboard from "@/lib/CopyToClipboard";
import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

/* ────────── API ────────── */
import { useGetSingleDepositRequestQuery } from "@/redux/features/deposit/depositApi";

/* ────────── helpers ────────── */
// /* ────────── Comments lik this ────────── */
const fmtUSD = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const fmtDate = (d: any) => {
  const iso =
    typeof d === "string"
      ? d
      : d?.$date
      ? d.$date
      : d?._seconds
      ? new Date(d._seconds * 1000).toISOString()
      : "";
  return iso
    ? new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "-";
};

const dataUrlFromBase64 = (b64?: string) =>
  b64 ? `data:image/png;base64,${b64}` : "";

/* ────────── types (optional) ────────── */
type Deposit = {
  _id: string;
  userId?: string;
  orderId?: string;
  name?: string;
  phone?: string;
  email?: string;
  customerId?: string;
  amount: number;
  charge?: number;
  receivedAmount?: number;
  destinationAddress?: string;
  qrCode?: string;
  chain?: string;
  status: "pending" | "approved" | "rejected";
  isApproved?: boolean;
  isExpired?: boolean;
  confirmations?: number;
  isManual?: boolean;
  callbackUrl?: string;
  note?: string;
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
  approvedAt?: string | { $date: string };
  callbackReceivedAt?: string | { $date: string };
  txId?: string;
};

/* ────────── page ────────── */
export default function DepositDetailsPage({
  params,
}: {
  params: { depositId: string };
}) {
  const { depositId } = params;
  const { data, isLoading } = useGetSingleDepositRequestQuery(depositId);
  const deposit = (data?.deposit ?? data) as Deposit | undefined;

  const {
    amount,
    charge,
    receivedAmount,
    name,
    phone,
    email,
    customerId,
    userId,
    status,
    chain,
    destinationAddress,
    qrCode,
    orderId,
    txId,
    confirmations,
    isApproved,
    isExpired,
    isManual,
    callbackUrl,
    note,
    createdAt,
    updatedAt,
    approvedAt,
    callbackReceivedAt,
  } = deposit ?? {};

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <Card className="p-0 overflow-hidden">
          {/* ────────── header ────────── */}
          <div className="border-b border-white/10 p-6 text-center">
            <h2 className="text-xl font-semibold">
              <span
                className={`mr-2 ${
                  status === "pending"
                    ? "text-[#FF6A1A]"
                    : status === "approved"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
              </span>
              <span className="text-white/50">Deposit Details</span>
            </h2>
          </div>

          {/* ────────── content ────────── */}
          <div className="p-6">
            <div className="rounded-xl border border-white/10">
              {/* User */}
              <Row label="User name:">
                <span className="font-semibold">{name ?? "-"}</span>
              </Row>
              <Row label="User Id:">
                <span className="flex items-center gap-2 font-semibold">
                  {customerId ?? "-"}
                  {userId && (
                    <Link
                      href={`/users/${userId}`}
                      className="text-[#21D3B3]"
                      title="Open profile"
                    >
                      <FaArrowUpRightFromSquare />
                    </Link>
                  )}
                </span>
              </Row>
              <Row label="Phone:">
                <span className="font-semibold">{phone ?? "-"}</span>
              </Row>
              <Row label="Email:">
                <span className="font-semibold">{email ?? "-"}</span>
              </Row>

              {/* Amounts */}
              <Row label="Amount:">
                <span className="font-semibold">{fmtUSD(amount)}</span>
              </Row>
              <Row label="Charge:">
                <span className="font-semibold">{fmtUSD(charge)}</span>
              </Row>
              <Row label="Received Amount:">
                <span className="flex items-center gap-2 font-semibold text-emerald-400">
                  {fmtUSD(receivedAmount)}
                  {receivedAmount !== undefined && (
                    <CopyToClipboard text={String(receivedAmount)} />
                  )}
                </span>
              </Row>

              {/* Payment info */}
              <Row label="Chain:">
                <span className="font-semibold uppercase">{chain ?? "-"}</span>
              </Row>
              <Row label="Destination Address:">
                <span className="flex items-center gap-2 font-semibold">
                  {destinationAddress ?? "-"}
                  {destinationAddress && (
                    <CopyToClipboard text={destinationAddress} />
                  )}
                </span>
              </Row>
              <Row label="Order ID:">
                <span className="flex items-center gap-2 font-semibold">
                  {orderId ?? "-"}
                  {orderId && <CopyToClipboard text={orderId} />}
                </span>
              </Row>
              <Row label="Tx ID:">
                <span className="flex items-center gap-2 font-semibold">
                  {txId ?? "-"}
                  {txId && <CopyToClipboard text={txId} />}
                </span>
              </Row>
              <Row label="Confirmations:">
                <span className="font-semibold">{confirmations ?? 0}</span>
              </Row>

              {/* Status flags */}
              <Row label="Approved?">
                <span className="font-semibold">
                  {isApproved ? "Yes" : status === "approved" ? "Yes" : "No"}
                </span>
              </Row>
              <Row label="Expired?">
                <span className="font-semibold">
                  {isExpired ? "Yes" : "No"}
                </span>
              </Row>
              <Row label="Manual?">
                <span className="font-semibold">{isManual ? "Yes" : "No"}</span>
              </Row>

              {/* Callback / Note */}
              <Row label="Callback URL:">
                <span className="font-semibold break-all">
                  {callbackUrl ?? "-"}
                </span>
              </Row>
              <Row label="Note:">
                <span className="text-white/80">{note ?? "-"}</span>
              </Row>

              {/* Dates */}
              <Row label="Created At:">
                <span className="font-semibold">{fmtDate(createdAt)}</span>
              </Row>
              <Row label="Updated At:">
                <span className="font-semibold">{fmtDate(updatedAt)}</span>
              </Row>
              <Row label="Approved At:">
                <span className="font-semibold">{fmtDate(approvedAt)}</span>
              </Row>
              <Row label="Callback Received:">
                <span className="font-semibold">
                  {fmtDate(callbackReceivedAt)}
                </span>
              </Row>

              {/* QR Code */}
              {qrCode && (
                <Row label="QR Code:">
                  <div className="flex items-center gap-3">
                    <img
                      src={dataUrlFromBase64(qrCode)}
                      alt="Payment QR"
                      className="h-24 w-24 rounded-lg border border-white/10 bg-white/5 object-contain p-1"
                    />
                    <span className="text-xs text-white/60">Scan to pay</span>
                  </div>
                </Row>
              )}

              {/* Final Status badge */}
              <Row label="Status:">
                <span
                  className={
                    status === "pending"
                      ? "rounded-full border border-[#FF8A1A]/30 bg-[#FF8A1A]/15 px-2 py-0.5 text-xs text-[#FF8A1A]"
                      : status === "approved"
                      ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-400"
                      : "rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-xs text-rose-400"
                  }
                >
                  {status ?? "-"}
                </span>
              </Row>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
