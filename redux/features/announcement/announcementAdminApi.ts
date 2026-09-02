import { apiSlice } from "../api/apiSlice";

export type Announcement = {
  _id: string;
  title: string;
  message?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
};

export const announcementAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnnouncements: builder.query<
      { success: boolean; items: Announcement[]; total: number },
      { page?: number; limit?: number } | void
    >({
      query: (arg) =>
        `/admin/announcements?page=${arg?.page ?? 1}&limit=${arg?.limit ?? 50}`,
      providesTags: ["Announcements"],
    }),
    createAnnouncement: builder.mutation<
      { success: boolean; announcement: Announcement },
      FormData
    >({
      query: (body) => ({ url: "/admin/announcements", method: "POST", body }),
      invalidatesTags: ["Announcements"],
    }),
    updateAnnouncement: builder.mutation<
      { success: boolean; announcement: Announcement },
      { id: string; body: FormData | Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/announcements/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),
    deleteAnnouncement: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const {
  useGetAdminAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementAdminApi;
