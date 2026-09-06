import { apiSlice } from "../api/apiSlice";

export type Preset = "today" | "week" | "month" | "last-month" | "all" | "custom";

type Bucket = { count: number; amount: number; fees: number; net: number };
type PendingBucket = { count: number; amount: number };

export type AdminOverview = {
  users: { total: number; activeTotal: number; todayNew: number };
  deposits: Record<"today" | "week" | "month" | "lastMonth" | "allTime", Bucket> & {
    pending: PendingBucket;
  };
  withdrawals: Record<
    "today" | "week" | "month" | "lastMonth" | "allTime",
    Bucket
  > & { pending: PendingBucket };
  net: number;
  qxInvestment: {
    activeCount: number;
    totalBalance: number;
    totalUserProfit: number;
    totalTeamBonus: number;
  };
  series: { day: string; deposits: number; withdrawals: number }[];
  recentDeposits: any[];
  recentWithdrawals: any[];
};

type RangeArg = { preset: Preset; from?: string; to?: string };

export type DepositAnalytics = {
  range: { start: string; end: string; preset: Preset };
  count: number;
  amount: number;
  net: number;
  fees: number;
  byChain: { key: string; count: number; amount: number }[];
  byStatus: { status: string; count: number; amount: number }[];
};

export type WithdrawAnalytics = Omit<DepositAnalytics, "byChain">;

const qs = ({ preset, from, to }: RangeArg) => {
  const p = new URLSearchParams({ preset });
  if (preset === "custom") {
    if (from) p.set("from", from);
    if (to) p.set("to", to);
  }
  return p.toString();
};

export const adminAnalyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverview, void>({
      query: () => "/admin/analytics/overview",
      transformResponse: (r: { data: AdminOverview }) => r.data,
    }),
    getDepositAnalytics: builder.query<DepositAnalytics, RangeArg>({
      query: (arg) => `/admin/analytics/deposits?${qs(arg)}`,
      transformResponse: (r: { data: DepositAnalytics }) => r.data,
    }),
    getWithdrawAnalytics: builder.query<WithdrawAnalytics, RangeArg>({
      query: (arg) => `/admin/analytics/withdrawals?${qs(arg)}`,
      transformResponse: (r: { data: WithdrawAnalytics }) => r.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminOverviewQuery,
  useGetDepositAnalyticsQuery,
  useGetWithdrawAnalyticsQuery,
} = adminAnalyticsApi;
