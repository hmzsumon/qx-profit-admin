import { apiSlice } from "../api/apiSlice";

export type AdminNotification = {
  _id: string;
  title?: string;
  message?: string;
  category?: string;
  url?: string;
  is_read: boolean;
  createdAt: string;
};

export const adminNotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<
      { success: boolean; notifications: AdminNotification[] },
      void
    >({
      query: () => "/admin-notifications",
      providesTags: ["AdminNotifications"],
    }),
    markAdminNotificationsRead: builder.mutation<
      { success: boolean },
      { notificationIds: string[] }
    >({
      query: (body) => ({
        url: "/update-admin-notification",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminNotifications"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationsReadMutation,
} = adminNotificationApi;
