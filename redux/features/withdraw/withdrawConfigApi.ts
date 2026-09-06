import { apiSlice } from "../api/apiSlice";

export type WithdrawConfig = {
  isActive: boolean;
  feePercent: number;
  minAmount: number;
  maxAmount: number; // 0 = unlimited
  presetAmounts: number[];
  processingTime: string;
  requireKyc: boolean;
};

export const withdrawConfigApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawConfig: builder.query<WithdrawConfig, void>({
      query: () => "/admin/withdraw-config",
      transformResponse: (r: { config: WithdrawConfig }) => r.config,
      providesTags: ["Withdraws"],
    }),
    updateWithdrawConfig: builder.mutation<
      { success: boolean; config: WithdrawConfig },
      Partial<WithdrawConfig>
    >({
      query: (body) => ({
        url: "/admin/withdraw-config",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Withdraws"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWithdrawConfigQuery,
  useUpdateWithdrawConfigMutation,
} = withdrawConfigApi;
