import { apiFetch } from "./api-client";
import type { PaginatedEnvelope, ProductCard } from "./types";

export async function submitContactUs(payload: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return apiFetch<{ id: number }>("/api/v1/contact-us", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitSubmitOrder(form: FormData) {
  return apiFetch<{ id: number }>("/api/v1/submit-order", {
    method: "POST",
    body: form,
  });
}

export async function submitReview(sku: string, payload: { comment: string; rating: number }) {
  return apiFetch("/api/v1/products/" + sku + "/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitReviewReply(reviewId: number, comment: string) {
  return apiFetch(`/api/v1/reviews/${reviewId}/replies`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

/** Client-side product list (tab switching / store filters). */
export async function clientFetchProducts(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      qs.set(key, String(value));
    }
  }
  const query = qs.toString();
  return apiFetch<ProductCard[]>(`/api/v1/products${query ? `?${query}` : ""}`) as Promise<
    PaginatedEnvelope<ProductCard[]>
  >;
}
