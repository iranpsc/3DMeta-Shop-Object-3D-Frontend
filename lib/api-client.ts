import type { PaginationMeta } from "./types";

export type ApiEnvelope<T> = {
  data: T;
  message?: string | null;
  info?: string | null;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
  links?: Record<string, string | null>;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `API request failed with status ${status}`;

    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
/** Server-only base URL (Docker network hostname). Falls back to public URL. */
const INTERNAL_BASE =
  process.env.API_INTERNAL_URL?.trim() ||
  process.env.INTERNAL_API_URL?.trim() ||
  "";

let csrfReady = false;

function readXsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match?.[1]) {
    return null;
  }

  return decodeURIComponent(match[1]);
}

async function ensureCsrfCookie(): Promise<void> {
  if (csrfReady && readXsrfToken()) {
    return;
  }

  await fetch(`${getApiBaseUrl()}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  csrfReady = true;
}

function isMutatingMethod(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const method = (init.method ?? "GET").toUpperCase();

  if (isMutatingMethod(method)) {
    await ensureCsrfCookie();
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const xsrf = readXsrfToken();
  if (xsrf && isMutatingMethod(method)) {
    headers.set("X-XSRF-TOKEN", xsrf);
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    method,
    credentials: "include",
    headers,
  });

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, body);
  }

  return body as ApiEnvelope<T>;
}

export function getApiBaseUrl(): string {
  // Browser must use the public URL; SSR inside Docker should use the service name.
  if (typeof window === "undefined" && INTERNAL_BASE) {
    return INTERNAL_BASE.replace(/\/$/, "");
  }
  return PUBLIC_BASE.replace(/\/$/, "");
}

export async function prepareCsrfForUpload(): Promise<string | null> {
  await ensureCsrfCookie();
  return readXsrfToken();
}
