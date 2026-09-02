import { apiSlice } from "../api/apiSlice";

export const qxBrokerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrokerConfig: builder.query<
      { success: boolean; config: { brokerUrl?: string } },
      void
    >({
      query: () => "/admin/qx-broker/config",
      providesTags: ["QxBroker"],
    }),
    updateBrokerConfig: builder.mutation<any, { brokerUrl: string }>({
      query: (body) => ({
        url: "/admin/qx-broker/config",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["QxBroker"],
    }),
  }),
});

export const { useGetBrokerConfigQuery, useUpdateBrokerConfigMutation } =
  qxBrokerApi;
