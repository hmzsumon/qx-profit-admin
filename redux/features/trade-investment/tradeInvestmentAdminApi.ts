import { apiSlice } from "../api/apiSlice";

export const tradeInvestmentAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTradeInvestmentDashboard: builder.query<any, void>({
      query: () => "/admin/trade-investment/dashboard",
      providesTags: ["TradeInvestment"],
    }),
    updateAdminTradeInvestmentConfig: builder.mutation<any, any>({
      query: (body) => ({ url: "/admin/trade-investment/config", method: "PUT", body }),
      invalidatesTags: ["TradeInvestment"],
    }),
    getAdminTradeInvestmentAccounts: builder.query<
      any,
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (arg) =>
        `/admin/trade-investment/accounts?page=${arg?.page ?? 1}&limit=${arg?.limit ?? 20}` +
        `${arg?.status ? `&status=${arg.status}` : ""}` +
        `${arg?.search ? `&search=${encodeURIComponent(arg.search)}` : ""}`,
      providesTags: ["TradeInvestmentAccounts"],
    }),
    getAdminTradeInvestmentAccountDetail: builder.query<any, string>({
      query: (id) => `/admin/trade-investment/accounts/${id}`,
      providesTags: ["TradeInvestmentAccounts"],
    }),
    getAdminTradeInvestmentLogs: builder.query<any, { limit?: number; type?: string } | number | void>({
      query: (arg) => {
        if (typeof arg === "number" || arg == null)
          return `/admin/trade-investment/logs?limit=${arg ?? 100}`;
        return `/admin/trade-investment/logs?limit=${arg.limit ?? 100}${arg.type ? `&type=${arg.type}` : ""}`;
      },
      providesTags: ["TradeInvestmentLogs"],
    }),
    getAdminTradeInvestmentTodayStatus: builder.query<any, string | void>({
      query: (date) => `/admin/trade-investment/today-status${date ? `?date=${date}` : ""}`,
      providesTags: ["TradeInvestmentAccounts"],
    }),
    runAdminTradeInvestmentProfit: builder.mutation<
      any,
      { dryRun?: boolean; date?: string; percent?: number; ignoreWeekend?: boolean }
    >({
      query: (body) => ({ url: "/admin/trade-investment/run-profit", method: "POST", body }),
      invalidatesTags: ["TradeInvestment", "TradeInvestmentAccounts", "TradeInvestmentLogs"],
    }),
  }),
});

export const {
  useGetAdminTradeInvestmentDashboardQuery,
  useUpdateAdminTradeInvestmentConfigMutation,
  useGetAdminTradeInvestmentAccountsQuery,
  useGetAdminTradeInvestmentAccountDetailQuery,
  useGetAdminTradeInvestmentLogsQuery,
  useGetAdminTradeInvestmentTodayStatusQuery,
  useRunAdminTradeInvestmentProfitMutation,
} = tradeInvestmentAdminApi;
