import { apiSlice } from "../api/apiSlice";

export type RankTier = {
  _id: string;
  key: string;
  name: string;
  targetVolume: number;
  rewardUsd: number;
  sortOrder: number;
  isActive: boolean;
  claimedCount?: number;
};

export const rankAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRankTiers: builder.query<{ success: boolean; tiers: RankTier[] }, void>({
      query: () => "/admin/rank/tiers",
      providesTags: ["RankTiers"],
    }),
    getRankAnalytics: builder.query<any, { page?: number; limit?: number } | void>({
      query: (arg) => `/admin/rank/analytics?page=${arg?.page ?? 1}&limit=${arg?.limit ?? 20}`,
      providesTags: ["RankTiers"],
    }),
    createRankTier: builder.mutation<any, Partial<RankTier>>({
      query: (body) => ({ url: "/admin/rank/tiers", method: "POST", body }),
      invalidatesTags: ["RankTiers"],
    }),
    updateRankTier: builder.mutation<any, { id: string; body: Partial<RankTier> }>({
      query: ({ id, body }) => ({ url: `/admin/rank/tiers/${id}`, method: "PUT", body }),
      invalidatesTags: ["RankTiers"],
    }),
    deleteRankTier: builder.mutation<any, string>({
      query: (id) => ({ url: `/admin/rank/tiers/${id}`, method: "DELETE" }),
      invalidatesTags: ["RankTiers"],
    }),
  }),
});

export const {
  useGetRankTiersQuery,
  useGetRankAnalyticsQuery,
  useCreateRankTierMutation,
  useUpdateRankTierMutation,
  useDeleteRankTierMutation,
} = rankAdminApi;
