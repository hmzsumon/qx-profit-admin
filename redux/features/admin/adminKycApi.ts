import { apiSlice } from "../api/apiSlice";

export const adminKycApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminKycRequests: builder.query<
      any,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status = "pending" }) => ({
        url: `/admin/kyc?page=${page}&limit=${limit}&status=${status}`,
      }),
      providesTags: ["User"],
    }),

    getAdminKycRequestById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/kyc/${id}`,
      }),
      providesTags: ["User"],
    }),

    approveAdminKycRequest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/kyc/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    rejectAdminKycRequest: builder.mutation<
      any,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/kyc/${id}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAdminKycRequestsQuery,
  useGetAdminKycRequestByIdQuery,
  useApproveAdminKycRequestMutation,
  useRejectAdminKycRequestMutation,
} = adminKycApi;
