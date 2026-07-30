import { apiFetch } from "./api-client";
import type { CartSnapshot, CheckoutState, VerifyPaymentResult } from "./types";

export type CheckoutAccountAction = "login" | "register";

export async function fetchCheckout(): Promise<CheckoutState> {
  const res = await apiFetch<CheckoutState>("/api/v1/checkout");
  return res.data;
}

export async function checkoutAccountRedirect(
  action: CheckoutAccountAction,
  intendedUrl?: string,
): Promise<{ action: CheckoutAccountAction; redirect_url: string }> {
  const body: { action: CheckoutAccountAction; intended?: string } = { action };
  const intended = intendedUrl ?? (typeof window !== "undefined" ? window.location.href : "");

  if (intended) {
    body.intended = intended;
  }

  const res = await apiFetch<{
    action: CheckoutAccountAction;
    redirect_url: string;
  }>("/api/v1/checkout/account", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function initiateCheckoutPayment(): Promise<{ redirect_url: string }> {
  const res = await apiFetch<{ redirect_url: string }>("/api/v1/checkout/payment", {
    method: "POST",
  });
  return res.data;
}

export async function verifyCheckoutPayment(
  params: Record<string, string>,
): Promise<{ result: VerifyPaymentResult; message?: string }> {
  const query = new URLSearchParams(params).toString();
  const res = await apiFetch<VerifyPaymentResult>(`/api/v1/checkout/verify?${query}`);
  return { result: res.data, message: res.message ?? undefined };
}

export async function repayOrder(orderId: string): Promise<{ redirect_url: string }> {
  const res = await apiFetch<{ redirect_url: string }>(`/api/v1/orders/${orderId}/pay`, {
    method: "POST",
  });
  return res.data;
}

export type { CartSnapshot };
