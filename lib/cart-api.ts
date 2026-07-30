import { apiFetch } from "./api-client";
import type { CartSnapshot } from "./types";

export async function fetchCart(): Promise<CartSnapshot> {
  const res = await apiFetch<CartSnapshot>("/api/v1/cart");
  return res.data;
}

export async function addToCart(
  productId: number,
  quantity = 1,
): Promise<{ cart: CartSnapshot; message?: string }> {
  const res = await apiFetch<CartSnapshot>(`/api/v1/cart/${productId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
  return { cart: res.data, message: res.message ?? undefined };
}

export async function updateCartItem(
  productId: number,
  quantity: number,
): Promise<CartSnapshot> {
  const res = await apiFetch<CartSnapshot>(`/api/v1/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
  return res.data;
}

export async function removeFromCart(productId: number): Promise<{
  cart: CartSnapshot;
  message?: string;
}> {
  const res = await apiFetch<CartSnapshot>(`/api/v1/cart/${productId}`, {
    method: "DELETE",
  });
  return { cart: res.data, message: res.message ?? undefined };
}
