import { apiFetch } from "./api-client";
import type { ProductDetail } from "./types";

export async function fetchProductWithAuth(sku: string): Promise<ProductDetail | undefined> {
  const res = await apiFetch<ProductDetail>(`/api/v1/products/${encodeURIComponent(sku)}`);
  return res.data;
}
