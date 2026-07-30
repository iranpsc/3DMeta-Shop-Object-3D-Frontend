import { apiFetch, getApiBaseUrl } from "./api-client";
import type {
  AdminAttribute,
  AdminContactMessage,
  AdminDashboardStats,
  AdminProduct,
  AdminProductFormData,
  AdminReview,
  AdminReviewReply,
  AdminSubmitOrder,
  AdminUser,
  CategorySummary,
  Paginated,
  TagSummary,
} from "./types";

function unwrapPaginated<T>(payload: { data: T[]; meta: Paginated<T>["meta"] }): Paginated<T> {
  return { data: payload.data, meta: payload.meta };
}

export async function fetchAdminDashboard(): Promise<AdminDashboardStats> {
  const res = await apiFetch<AdminDashboardStats>("/api/v1/admin/dashboard");
  return res.data;
}

export async function fetchAdminProducts(search = "", page = 1): Promise<Paginated<AdminProduct>> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  const res = await apiFetch<{ data: AdminProduct[]; meta: Paginated<AdminProduct>["meta"] }>(
    `/api/v1/admin/products?${params}`,
  );
  return unwrapPaginated(res.data);
}

export async function fetchAdminProductFormData(): Promise<AdminProductFormData> {
  const res = await apiFetch<AdminProductFormData>("/api/v1/admin/products/form-data");
  return res.data;
}

export async function fetchAdminProduct(productId: number): Promise<AdminProduct> {
  const res = await apiFetch<AdminProduct>(`/api/v1/admin/products/${productId}`);
  return res.data;
}

export async function createAdminProduct(form: FormData): Promise<{ product: AdminProduct; message?: string }> {
  const res = await apiFetch<AdminProduct>("/api/v1/admin/products", { method: "POST", body: form });
  return { product: res.data, message: res.message ?? undefined };
}

export async function discardAdminTempUpload(path: string, name: string): Promise<void> {
  await apiFetch<null>("/api/v1/admin/products/temp-uploads/discard", {
    method: "POST",
    body: JSON.stringify({ path, name }),
  });
}

export function getAdminProductUploadUrl(): string {
  return `${getApiBaseUrl()}/api/v1/admin/products/upload`;
}

export async function updateAdminProduct(
  productId: number,
  form: FormData,
): Promise<{ product: AdminProduct; message?: string }> {
  const res = await apiFetch<AdminProduct>(`/api/v1/admin/products/${productId}`, {
    method: "PUT",
    body: form,
  });
  return { product: res.data, message: res.message ?? undefined };
}

export async function deleteAdminProduct(productId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/admin/products/${productId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function importAdminProducts(file: File): Promise<string | undefined> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch<null>("/api/v1/admin/products/import", { method: "POST", body: form });
  return res.message ?? undefined;
}

export async function fetchAdminCategories(page = 1): Promise<Paginated<CategorySummary>> {
  const res = await apiFetch<{ data: CategorySummary[]; meta: Paginated<CategorySummary>["meta"] }>(
    `/api/v1/admin/categories?page=${page}`,
  );
  return unwrapPaginated(res.data);
}

export async function fetchAdminCategoryFormData(): Promise<CategorySummary[]> {
  const res = await apiFetch<CategorySummary[]>("/api/v1/admin/categories/form-data");
  return res.data;
}

export async function fetchAdminCategory(categoryId: number): Promise<CategorySummary> {
  const res = await apiFetch<CategorySummary>(`/api/v1/admin/categories/${categoryId}`);
  return res.data;
}

export async function createAdminCategory(form: FormData): Promise<{ category: CategorySummary; message?: string }> {
  const res = await apiFetch<CategorySummary>("/api/v1/admin/categories", { method: "POST", body: form });
  return { category: res.data, message: res.message ?? undefined };
}

export async function updateAdminCategory(
  categoryId: number,
  form: FormData,
): Promise<{ category: CategorySummary; message?: string }> {
  const res = await apiFetch<CategorySummary>(`/api/v1/admin/categories/${categoryId}`, {
    method: "PUT",
    body: form,
  });
  return { category: res.data, message: res.message ?? undefined };
}

export async function deleteAdminCategory(categoryId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/admin/categories/${categoryId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function fetchAdminTags(page = 1): Promise<Paginated<TagSummary>> {
  const res = await apiFetch<{ data: TagSummary[]; meta: Paginated<TagSummary>["meta"] }>(
    `/api/v1/admin/tags?page=${page}`,
  );
  return unwrapPaginated(res.data);
}

export async function createAdminTag(payload: { name: string; slug: string }): Promise<{ tag: TagSummary; message?: string }> {
  const res = await apiFetch<TagSummary>("/api/v1/admin/tags", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { tag: res.data, message: res.message ?? undefined };
}

export async function deleteAdminTag(tagId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/admin/tags/${tagId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function fetchAdminAttributes(page = 1): Promise<Paginated<AdminAttribute>> {
  const res = await apiFetch<{ data: AdminAttribute[]; meta: Paginated<AdminAttribute>["meta"] }>(
    `/api/v1/admin/attributes?page=${page}`,
  );
  return unwrapPaginated(res.data);
}

export async function createAdminAttribute(payload: {
  name: string;
  slug: string;
}): Promise<{ attribute: AdminAttribute; message?: string }> {
  const res = await apiFetch<AdminAttribute>("/api/v1/admin/attributes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { attribute: res.data, message: res.message ?? undefined };
}

export async function deleteAdminAttribute(attributeId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/admin/attributes/${attributeId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function fetchAdminReviews(page = 1): Promise<Paginated<AdminReview>> {
  const res = await apiFetch<{ data: AdminReview[]; meta: Paginated<AdminReview>["meta"] }>(
    `/api/v1/admin/reviews?page=${page}`,
  );
  return unwrapPaginated(res.data);
}

export async function approveAdminReview(reviewId: number): Promise<string | undefined> {
  const res = await apiFetch<AdminReview>(`/api/v1/admin/reviews/${reviewId}/approve`, { method: "POST" });
  return res.message ?? undefined;
}

export async function deleteAdminReview(reviewId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/admin/reviews/${reviewId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function fetchAdminReviewReplies(reviewId: number): Promise<{
  review: AdminReview;
  replies: AdminReviewReply[];
}> {
  const res = await apiFetch<{ review: AdminReview; replies: AdminReviewReply[] }>(
    `/api/v1/admin/reviews/${reviewId}/replies`,
  );
  return res.data;
}

export async function createAdminReviewReply(
  reviewId: number,
  comment: string,
): Promise<AdminReviewReply> {
  const res = await apiFetch<AdminReviewReply>(`/api/v1/admin/reviews/${reviewId}/replies`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
  return res.data;
}

export async function approveAdminReviewReply(replyId: number): Promise<string | undefined> {
  const res = await apiFetch<AdminReviewReply>(`/api/v1/admin/review-replies/${replyId}/approve`, {
    method: "POST",
  });
  return res.message ?? undefined;
}

export async function deleteAdminReviewReply(replyId: number): Promise<string | undefined> {
  const res = await apiFetch<null>(`/api/v1/admin/review-replies/${replyId}`, { method: "DELETE" });
  return res.message ?? undefined;
}

export async function fetchAdminUsers(search = "", page = 1): Promise<Paginated<AdminUser>> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  const res = await apiFetch<{ data: AdminUser[]; meta: Paginated<AdminUser>["meta"] }>(
    `/api/v1/admin/users?${params}`,
  );
  return unwrapPaginated(res.data);
}

export async function fetchAdminSubmitOrders(page = 1): Promise<Paginated<AdminSubmitOrder>> {
  const res = await apiFetch<{ data: AdminSubmitOrder[]; meta: Paginated<AdminSubmitOrder>["meta"] }>(
    `/api/v1/admin/orders?page=${page}`,
  );
  return unwrapPaginated(res.data);
}

export async function fetchAdminSubmitOrder(orderId: number): Promise<AdminSubmitOrder> {
  const res = await apiFetch<AdminSubmitOrder>(`/api/v1/admin/orders/${orderId}`);
  return res.data;
}

export async function fetchAdminContactMessages(page = 1): Promise<Paginated<AdminContactMessage>> {
  const res = await apiFetch<{ data: AdminContactMessage[]; meta: Paginated<AdminContactMessage>["meta"] }>(
    `/api/v1/admin/contact-messages?page=${page}`,
  );
  return unwrapPaginated(res.data);
}
