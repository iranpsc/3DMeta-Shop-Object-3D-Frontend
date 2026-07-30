import { apiFetch, ApiError, getApiBaseUrl } from "./api-client";
import type { UserProfile } from "./types";

export type AuthUser = UserProfile & {
  role: "admin" | "user" | string;
};

/**
 * Fetch the current Sanctum session user, or null when unauthenticated.
 */
export async function getUser(): Promise<AuthUser | null> {
  try {
    const res = await apiFetch<AuthUser>("/api/v1/user");
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

/**
 * End the Laravel SPA session.
 */
export async function logout(): Promise<void> {
  await apiFetch<null>("/api/v1/logout", { method: "POST" });
}

function getCurrentPageUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href;
}

function buildAuthRedirectUrl(path: string, intendedUrl?: string): string {
  const url = new URL(`${getApiBaseUrl()}${path}`);
  const intended = intendedUrl ?? getCurrentPageUrl();

  if (intended) {
    url.searchParams.set("intended", intended);
  }

  return url.toString();
}

/**
 * Navigate the browser to the Laravel OAuth redirect endpoint.
 */
export function loginRedirect(intendedUrl?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = buildAuthRedirectUrl("/auth/redirect", intendedUrl);
}

/**
 * Navigate the browser to the Laravel OAuth register endpoint.
 */
export function registerRedirect(intendedUrl?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = buildAuthRedirectUrl("/auth/register", intendedUrl);
}
