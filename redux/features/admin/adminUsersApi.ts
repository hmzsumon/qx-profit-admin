/* ────────── imports ────────── */
import { apiSlice } from "../api/apiSlice";

/* ────────── types ────────── */
/* ────────── row types ────────── */
export type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  customerId: string;
  country?: string;
  role: string;
  rank?: string;
  generationRewardTier?: string;
  vipTier?: string;

  /* ────────── status & flags ────────── */
  is_active: boolean;
  is_block?: boolean;
  is_withdraw_block?: boolean /* ────────── added ────────── */;
  email_verified?: boolean /* ────────── added ────────── */;
  two_factor_enabled?: boolean /* ────────── added ────────── */;
  kyc_verified?: boolean;
  kyc_request?: boolean;
  kyc_step?: number;
  is_active_aiTrade?: boolean;

  /* ────────── balances ────────── */
  m_balance?: number;
  demo_balance?: number;
  bet_volume?: number;
  w_balance?: number;
  d_balance?: number;
  last_m_balance?: number;
  s_bonus?: number;

  /* ────────── relations ────────── */
  sponsorId?: string;
  sponsorName?: string;
  agentId?: string;
  agentName?: string;
  parents?: string[];
  generationRewardLevels?: any[];

  /* ────────── added ────────── */
  text_password?: string;
  is_new?: boolean;

  /* ────────── timestamps ────────── */
  activeAt?: string /* ────────── added ────────── */;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  success: boolean;
  users: AdminUserRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    role?: string;
    is_active?: string;
  };
};

/* ────────── wallet type ────────── */
export type AdminUserWallet = {
  userId: string;
  customerId: string;
  totalReceive: number;
  totalSend: number;
  totalDeposit: number;
  totalWithdraw: number;
  totalPay: number;
  totalWine: number;
  todayWine: number;
  totalEarning: number;
  todayEarning: number;
  thisMonthEarning: number;
  totalCommission: number;
  levelEarning: number;
  totalSponsorBonus: number;
  generationEarning: number;
  totalDepositBonus: number;
  totalGameBonus: number;
  totalReferralBonus: number;
  rankEarning: number;
  totalAiTradeProfit: number;
  totalAiTradeCommission: number;
  totalLiveTradeProfit: number;
  totalLiveTradeCommission: number;
  totalTransferToTrade: number;
  totalTransferToWallet: number;
  totalAiTradeBalance: number;
  totalLiveTradeBalance: number;
  createdAt: string;
  updatedAt: string;
};

/* ────────── details response ────────── */
export type UserDetailsResponse = {
  success: boolean;
  user: AdminUserRow;
  wallet: AdminUserWallet | null;
  recentTransactions?: AdminTransactionRow[];
};

export type GlobalTransactionRow = AdminTransactionRow & { userName?: string };
export type GlobalTransactionsResponse = {
  success: boolean;
  transactions: GlobalTransactionRow[];
  types: string[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

/* ────────── types for transactions ────────── */
export type AdminTransactionRow = {
  _id: string;
  userId: string;
  customerId: string;
  unique_id: string;
  amount: number;
  transactionType: string;
  purpose?: string;
  description?: string;
  isCashIn: boolean;
  isCashOut: boolean;
  previous_m_balance?: number;
  current_m_balance?: number;
  createdAt: string;
  updatedAt: string;
};

export type UserTransactionsResponse = {
  success: boolean;
  transactions: AdminTransactionRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    transactionType?: string;
    isCashIn?: string;
    isCashOut?: string;
  };
};

/* ────────── API ────────── */
export const adminUsersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      UsersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        role?: string;
        is_active?: "true" | "false";
      }
    >({
      query: (q) => {
        const params = new URLSearchParams();
        if (q.page) params.set("page", String(q.page));
        if (q.limit) params.set("limit", String(q.limit));
        if (q.search) params.set("search", q.search);
        if (q.sortBy) params.set("sortBy", q.sortBy);
        if (q.sortOrder) params.set("sortOrder", q.sortOrder);
        if (q.role) params.set("role", q.role);
        if (q.is_active) params.set("is_active", q.is_active);
        const qs = params.toString();
        return { url: `/admin/users${qs ? `?${qs}` : ""}` };
      },
      providesTags: ["AdminUsers"],
    }),

    /* ────────── details endpoint ────────── */
    getUserById: builder.query<UserDetailsResponse, { id: string }>({
      query: ({ id }) => ({ url: `/admin/users/${id}` }),
      providesTags: ["AdminUsers"],
    }),

    /* ────────── flags: active / withdraw-block / block ────────── */
    setUserFlags: builder.mutation<
      { success: boolean; user: AdminUserRow },
      {
        id: string;
        is_active?: boolean;
        is_withdraw_block?: boolean;
        is_block?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}/flags`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    /* ────────── hard delete ────────── */
    deleteUser: builder.mutation<
      { success: boolean; message: string; report: any },
      { id: string }
    >({
      query: ({ id }) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminUsers"],
    }),

    /* ────────── global transactions ────────── */
    getAdminTransactions: builder.query<
      GlobalTransactionsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        transactionType?: string;
        isCashIn?: "true";
        isCashOut?: "true";
        from?: string;
        to?: string;
      }
    >({
      query: (q) => {
        const params = new URLSearchParams();
        Object.entries(q).forEach(([k, v]) => {
          if (v !== undefined && v !== "") params.set(k, String(v));
        });
        const qs = params.toString();
        return { url: `/admin/transactions${qs ? `?${qs}` : ""}` };
      },
    }),

    /* ────────── transactions endpoint ────────── */
    getUserTransactions: builder.query<
      UserTransactionsResponse,
      {
        id: string;
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        transactionType?: string;
        isCashIn?: "true" | "false";
        isCashOut?: "true" | "false";
      }
    >({
      query: ({ id, ...q }) => {
        const params = new URLSearchParams();
        if (q.page) params.set("page", String(q.page));
        if (q.limit) params.set("limit", String(q.limit));
        if (q.search) params.set("search", q.search);
        if (q.sortBy) params.set("sortBy", q.sortBy);
        if (q.sortOrder) params.set("sortOrder", q.sortOrder);
        if (q.transactionType) params.set("transactionType", q.transactionType);
        if (q.isCashIn) params.set("isCashIn", q.isCashIn);
        if (q.isCashOut) params.set("isCashOut", q.isCashOut);
        const qs = params.toString();
        return { url: `/admin/users/${id}/transactions${qs ? `?${qs}` : ""}` };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserTransactionsQuery,
  useSetUserFlagsMutation,
  useDeleteUserMutation,
  useGetAdminTransactionsQuery,
} = adminUsersApi;
