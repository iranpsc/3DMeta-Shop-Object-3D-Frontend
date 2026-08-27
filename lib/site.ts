/** Strip trailing slash and whitespace from an origin URL. */
function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/**
 * Explicit public frontend origin from env (preferred for canonicals / OG).
 * Never hardcode a production domain — the app may run on another host.
 */
function siteUrlFromEnv(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return normalizeOrigin(configured);

  const vercel =
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = normalizeOrigin(vercel);
    return /^https?:\/\//i.test(host) ? host : `https://${host}`;
  }

  return undefined;
}

/**
 * Sync origin for module-level metadata (`metadataBase`) and build-time use.
 * Prefer `NEXT_PUBLIC_SITE_URL`; otherwise localhost (not a fixed production domain).
 */
export function getSiteUrlSync(): string {
  return siteUrlFromEnv() ?? "http://localhost:3000";
}

/**
 * Runtime origin for JSON-LD / absolute links in Server Components.
 * Uses env when set; otherwise the request Host (actual app base URL).
 */
export async function getSiteUrl(): Promise<string> {
  const fromEnv = siteUrlFromEnv();
  if (fromEnv) return fromEnv;

  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const isLocal =
        host.includes("localhost") ||
        host.startsWith("127.") ||
        host.startsWith("0.0.0.0");
      const proto = h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
      return normalizeOrigin(`${proto}://${host}`);
    }
  } catch {
    // Outside a request (build, scripts).
  }

  return getSiteUrlSync();
}

/** @deprecated Prefer getSiteUrl() / getSiteUrlSync() — kept for static metadata imports. */
export const SITE_URL = getSiteUrlSync();

export function absoluteUrl(path = "/", baseUrl: string = getSiteUrlSync()): string {
  if (/^https?:\/\//i.test(path)) {
    try {
      const parsed = new URL(path);
      return `${baseUrl}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return path;
    }
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

export async function absoluteUrlAsync(path = "/"): Promise<string> {
  return absoluteUrl(path, await getSiteUrl());
}
