import { absoluteUrl } from "@/lib/site";

export const SCHEMA_CONTEXT = "https://schema.org";

export const DEFAULT_PRODUCT_IMAGE = "/home-page/images/Asset2.png";

/** Strip HTML tags from a string. Helpful for SEO descriptions. */
export function stripHtml(html?: string | null): string | undefined {
  if (!html) return undefined;
  let text = "";
  let inTag = false;
  for (const char of html) {
    if (char === "<") {
      inTag = true;
    } else if (char === ">") {
      inTag = false;
    } else if (!inTag) {
      text += char;
    }
  }
  const trimmed = text.trim();
  return trimmed || undefined;
}

/** Remove null/undefined and empty objects/arrays so Google validators don't see invalid fields. */
export function stripEmpty(value: unknown): unknown {
  if (value === null || value === undefined || value === "") return undefined;
  if (Array.isArray(value)) {
    const cleaned = value
      .map(stripEmpty)
      .filter((item) => item !== undefined);
    return cleaned.length ? cleaned : undefined;
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      const cleaned = stripEmpty(nested);
      if (cleaned !== undefined) out[key] = cleaned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return value;
}

/** Resolve image URLs to absolute https URLs required by Google Product schema. */
export function resolveMediaUrl(
  url?: string | null,
  baseUrl?: string,
): string | undefined {
  if (!url?.trim()) return undefined;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return absoluteUrl(trimmed, baseUrl);
}

export function organizationLogo(path: string, baseUrl?: string) {
  return {
    "@type": "ImageObject",
    url: resolveMediaUrl(path, baseUrl) ?? absoluteUrl(path, baseUrl),
  };
}

/** ISO 8601 date one year ahead — recommended for Offer.priceValidUntil. */
export function offerPriceValidUntil(days = 365): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function postalAddress({
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
}: {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
}) {
  return stripEmpty({
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry: "IR",
  });
}
