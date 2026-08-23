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
    getAdminTradeInvestmentAccounts: builder.query<any, { status?: string; page?: number; limit?: number } | void>({
      query: (arg) => `/admin/trade-investment/accounts?page=${arg?.page ?? 1}&limit=${arg?.limit ?? 20}${arg?.status ? `&status=${arg.status}` : ""}`,
      providesTags: ["TradeInvestmentAccounts"],
    }),
    getAdminTradeInvestmentLogs: builder.query<any, number | void>({
      query: (limit = 100) => `/admin/trade-investment/logs?limit=${limit}`,
      providesTags: ["TradeInvestmentLogs"],
    }),
    runAdminTradeInvestmentProfit: builder.mutation<any, { dryRun?: boolean; date?: string }>({
      query: (body) => ({ url: "/admin/trade-investment/run-profit", method: "POST", body }),
      invalidatesTags: ["TradeInvestment", "TradeInvestmentAccounts", "TradeInvestmentLogs"],
    }),
  }),
});

export const { useGetAdminTradeInvestmentDashboardQuery, useUpdateAdminTradeInvestmentConfigMutation, useGetAdminTradeInvestmentAccountsQuery, useGetAdminTradeInvestmentLogsQuery, useRunAdminTradeInvestmentProfitMutation } = tradeInvestmentAdminApi;
