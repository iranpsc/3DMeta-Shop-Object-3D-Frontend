import { apiFetch } from "./api-client";
import type {
  AvatarItem,
  DashboardSummary,
  OrderDetail,
  OrderSummary,
  Paginated,
  TicketItem,
  UserProfile,
} from "./types";

export async function fetchDashboard(): Promise<DashboardSummary> {
  const res = await apiFetch<DashboardSummary>("/api/v1/user/dashboard");
  return res.data;
}

export async function fetchOrders(page = 1): Promise<Paginated<OrderSummary>> {
  const res = await apiFetch<Paginated<OrderSummary>>(`/api/v1/user/orders?page=${page}`);
  return res.data;
}

export async function fetchOrder(orderId: string): Promise<OrderDetail> {
  const res = await apiFetch<OrderDetail>(`/api/v1/user/orders/${orderId}`);
  return res.data;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await apiFetch<UserProfile>("/api/v1/user/profile");
  return res.data;
}

export async function updateProfile(form: FormData): Promise<{
  profile: UserProfile;
  message?: string;
  info?: string;
}> {
  const res = await apiFetch<UserProfile>("/api/v1/user/profile", {
    method: "PUT",
    body: form,
  });

  return {
    profile: res.data,
    message: res.message ?? undefined,
    info: res.info ?? undefined,
  };
}

export async function fetchAvatars(search = "", page = 1): Promise<Paginated<AvatarItem>> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) {
    params.set("search", search);
  }
  const res = await apiFetch<Paginated<AvatarItem>>(`/api/v1/user/avatars?${params}`);
  return res.data;
}

export async function createAvatar(payload: {
  name: string;
  avatar_url: string;
  avatar_image_url: string;
}): Promise<{ avatar: AvatarItem; message?: string }> {
  const res = await apiFetch<AvatarItem>("/api/v1/user/avatars", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { avatar: res.data, message: res.message ?? undefined };
}

export async function fetchTickets(page = 1): Promise<Paginated<TicketItem>> {
  const res = await apiFetch<Paginated<TicketItem>>(`/api/v1/tickets?page=${page}`);
  return res.data;
}

export async function fetchTicket(ticketId: number): Promise<TicketItem> {
  const res = await apiFetch<TicketItem>(`/api/v1/tickets/${ticketId}`);
  return res.data;
}

export async function createTicket(form: FormData): Promise<{ ticket: TicketItem; message?: string }> {
  const res = await apiFetch<TicketItem>("/api/v1/tickets", {
    method: "POST",
    body: form,
  });
  return { ticket: res.data, message: res.message ?? undefined };
}

export async function updateTicket(
  ticketId: number,
  form: FormData,
): Promise<{ ticket: TicketItem; message?: string }> {
  const res = await apiFetch<TicketItem>(`/api/v1/tickets/${ticketId}`, {
    method: "PUT",
    body: form,
  });
  return { ticket: res.data, message: res.message ?? undefined };
}

export async function deleteTicket(ticketId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/tickets/${ticketId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function respondToTicket(
  ticketId: number,
  form: FormData,
): Promise<TicketItem> {
  const res = await apiFetch<TicketItem>(`/api/v1/tickets/${ticketId}/responses`, {
    method: "POST",
    body: form,
  });
  return res.data;
}
