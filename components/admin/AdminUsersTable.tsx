/* ────────── imports ────────── */
"use client";

import {
  type AdminUserRow,
  useSetUserFlagsMutation,
} from "@/redux/features/admin/adminUsersApi";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useMemo } from "react";
import toast from "react-hot-toast";

function EmailVerificationCell({
  user,
  tabIndex,
}: {
  user: AdminUserRow;
  tabIndex: number;
}) {
  const [setFlags, { isLoading, isSuccess }] = useSetUserFlagsMutation();
  const verified = !!user.email_verified_by_admin || isSuccess;

  const verifyEmail = async () => {
    if (verified || isLoading) return;
    try {
      await setFlags({ id: user._id, email_verified: true }).unwrap();
      toast.success(`Email verified for ${user.email}`);
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Email verification failed. Please try again.");
    }
  };

  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={verified}
        disabled={verified || isLoading}
        tabIndex={tabIndex}
        aria-label={`Admin verify email for ${user.email}`}
        title="Verify this email and allow login without an email code"
        onChange={(event) => {
          if (event.target.checked) void verifyEmail();
        }}
        className="h-4 w-4 accent-teal-400 disabled:cursor-not-allowed"
      />
      <span className={verified ? "text-emerald-400" : "text-white/70"}>
        {verified ? "Verified" : isLoading ? "Verifying..." : "Verify email"}
      </span>
    </label>
  );
}

/* ────────── helpers ────────── */
const StatusPill = ({ active }: { active: boolean }) => (
  <span
    className={
      active
        ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-400"
        : "rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-xs text-rose-400"
    }
  >
    {active ? "active" : "inactive"}
  </span>
);

/* ────────── safe access helpers ────────── */
const toDateMs = (iso?: string | null) =>
  iso ? new Date(iso).getTime() : null;
const toDateLabel = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

/* ────────── columns ────────── */
const columns: GridColDef<AdminUserRow>[] = [
  { field: "customerId", headerName: "Customer ID", width: 140 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 240 },
  {
    field: "email_verified_by_admin",
    headerName: "Admin email verified",
    width: 180,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<AdminUserRow>) => (
      <EmailVerificationCell
        key={params.row._id}
        user={params.row}
        tabIndex={params.hasFocus ? 0 : -1}
      />
    ),
  },
  { field: "phone", headerName: "Phone", width: 160 },
  { field: "country", headerName: "Country", width: 140 },
  { field: "role", headerName: "Role", width: 110 },

  {
    field: "is_active",
    headerName: "Status",
    width: 120,
    renderCell: (p: GridRenderCellParams<AdminUserRow>) => (
      <StatusPill active={!!(p?.row?.is_active ?? false)} />
    ),
  },
  {
    field: "createdAt",
    headerName: "Joined",
    width: 160,
    valueGetter: (p: any) => {
      const iso = p?.row?.createdAt as string | undefined;
      return toDateMs(iso ?? null);
    },
    renderCell: (p: GridRenderCellParams<AdminUserRow>) =>
      toDateLabel((p?.row?.createdAt as string | undefined) ?? null),
  },
  {
    field: "view",
    headerName: "",
    width: 80,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (p: GridRenderCellParams<AdminUserRow>) => {
      const id = p?.row?._id;
      return id ? (
        <Link
          href={`/users/${p.row._id}`}
          className="text-teal-300 hover:underline"
        >
          View
        </Link>
      ) : (
        <span className="text-white/30">—</span>
      );
    },
  },
];

/* ────────── component ────────── */
export default function AdminUsersTable(props: {
  rows: AdminUserRow[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  onSortChange: (m: GridSortModel) => void;
  initialSort?: GridSortModel;
}) {
  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    initialSort,
  } = props;

  const dgRows = useMemo(
    () => rows.map((u) => ({ id: u._id ?? crypto.randomUUID(), ...u })),
    [rows]
  );

  return (
    <div className="h-[calc(100vh-260px)]">
      <DataGrid
        rows={dgRows}
        columns={columns}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        rowCount={total}
        pageSizeOptions={[10, 20, 50, 100, 200]}
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={(m) => {
          onPageChange(m.page + 1);
          onPageSizeChange(m.pageSize);
        }}
        onSortModelChange={onSortChange}
        initialState={
          initialSort ? { sorting: { sortModel: initialSort } } : undefined
        }
        disableRowSelectionOnClick
        columnHeaderHeight={44}
        getRowHeight={() => 56}
        sx={{
          bgcolor: "#0E1014",
          color: "#E6E6E6",
          border: "1px solid rgba(255,255,255,0.08)",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 12,
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgba(255,255,255,0.06)",
            fontSize: 12,
          },
          "& .MuiDataGrid-row:hover": { bgcolor: "rgba(255,255,255,0.03)" },
          "& .MuiTablePagination-root": { color: "rgba(255,255,255,0.75)" },
        }}
      />
    </div>
  );
}
