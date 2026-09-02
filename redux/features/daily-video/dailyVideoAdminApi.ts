import { apiSlice } from "../api/apiSlice";

export type DailyVideo = {
  _id: string;
  title: string;
  description?: string;
  objectKey: string;
  url: string;
  posterUrl?: string;
  contentType: string;
  sizeBytes?: number;
  durationSec?: number;
  publishDate: string;
  status: "pending" | "ready";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type UploadUrlResponse = {
  success: boolean;
  id: string;
  key: string;
  uploadUrl: string;
  publicUrl: string;
};

export const dailyVideoAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDailyVideoUploadUrl: builder.mutation<
      UploadUrlResponse,
      { fileName: string; contentType: string; sizeBytes: number }
    >({
      query: (body) => ({
        url: "/admin/daily-videos/upload-url",
        method: "POST",
        body,
      }),
    }),
    confirmDailyVideo: builder.mutation<
      { success: boolean; video: DailyVideo },
      {
        id: string;
        title: string;
        description?: string;
        publishDate?: string;
        durationSec?: number;
      }
    >({
      query: (body) => ({ url: "/admin/daily-videos", method: "POST", body }),
      invalidatesTags: ["DailyVideos"],
    }),
    getAdminDailyVideos: builder.query<
      { success: boolean; videos: DailyVideo[]; total: number },
      { page?: number; limit?: number } | void
    >({
      query: (arg) =>
        `/admin/daily-videos?page=${arg?.page ?? 1}&limit=${arg?.limit ?? 30}`,
      providesTags: ["DailyVideos"],
    }),
    updateDailyVideo: builder.mutation<
      { success: boolean; video: DailyVideo },
      { id: string; body: Partial<Pick<DailyVideo, "title" | "description" | "isActive" | "publishDate">> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/daily-videos/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DailyVideos"],
    }),
    deleteDailyVideo: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/daily-videos/${id}`, method: "DELETE" }),
      invalidatesTags: ["DailyVideos"],
    }),
  }),
});

export const {
  useCreateDailyVideoUploadUrlMutation,
  useConfirmDailyVideoMutation,
  useGetAdminDailyVideosQuery,
  useUpdateDailyVideoMutation,
  useDeleteDailyVideoMutation,
} = dailyVideoAdminApi;
