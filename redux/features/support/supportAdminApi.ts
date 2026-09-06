import { apiSlice } from "../api/apiSlice";

export type SupportConfig = {
  email: string;
  telegram: string;
  whatsapp: string;
  hotline: string;
  workingHours: string;
  liveChatUrl: string;
  apkUrl: string;
  businessPlanPdfUrl: string;
  faqUrl: string;
};

export type TicketReply = {
  from: "user" | "admin";
  byName: string;
  message: string;
  emailSent: boolean;
  createdAt: string;
};

export type Ticket = {
  _id: string;
  customerId: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "pending" | "resolved" | "closed";
  replies: TicketReply[];
  lastReplyAt: string;
  createdAt: string;
};

export const supportAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSupportConfig: builder.query<SupportConfig, void>({
      query: () => "/admin/support/config",
      transformResponse: (r: { config: SupportConfig }) => r.config,
      providesTags: ["SupportConfig"],
    }),
    updateSupportConfig: builder.mutation<
      { config: SupportConfig },
      Partial<SupportConfig>
    >({
      query: (body) => ({
        url: "/admin/support/config",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SupportConfig"],
    }),

    listTickets: builder.query<
      {
        tickets: Ticket[];
        total: number;
        byStatus: Record<string, number>;
      },
      { status?: string; q?: string; page?: number }
    >({
      query: ({ status = "", q = "", page = 1 }) => {
        const p = new URLSearchParams({ page: String(page) });
        if (status) p.set("status", status);
        if (q) p.set("q", q);
        return `/admin/support/tickets?${p.toString()}`;
      },
      providesTags: ["SupportTickets"],
    }),
    getTicket: builder.query<Ticket, string>({
      query: (id) => `/admin/support/tickets/${id}`,
      transformResponse: (r: { ticket: Ticket }) => r.ticket,
      providesTags: ["SupportTickets"],
    }),
    replyTicket: builder.mutation<
      { ticket: Ticket; emailSent: boolean },
      { id: string; message: string; emailUser: boolean; status?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/support/tickets/${id}/reply`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportTickets"],
    }),
    setTicketStatus: builder.mutation<
      { ticket: Ticket },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/support/tickets/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SupportTickets"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSupportConfigQuery,
  useUpdateSupportConfigMutation,
  useListTicketsQuery,
  useGetTicketQuery,
  useReplyTicketMutation,
  useSetTicketStatusMutation,
} = supportAdminApi;
