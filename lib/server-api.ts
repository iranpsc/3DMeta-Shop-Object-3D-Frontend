import type { ApiEnvelope } from "./api-client";
import { getApiBaseUrl } from "./api-client";

export class ServerApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
  }
}

/**
 * Server-side API fetch (no cookies / CSRF). Used by Server Components.
 */
export async function serverApiFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false } },
): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    next: init?.next ?? { revalidate: 30 },
    signal: init?.signal ?? AbortSignal.timeout(5000),
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
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `API request failed with status ${res.status}`;
    throw new ServerApiError(res.status, message);
  }

  return body as ApiEnvelope<T>;
}
