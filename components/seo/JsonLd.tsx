import { stripEmpty } from "@/lib/seo-utils";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Renders JSON-LD with empty fields removed and `<` scrubbed to mitigate XSS. */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? data.map((item) => stripEmpty(item)).filter(Boolean)
    : stripEmpty(data);

  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    return null;
  }

  return (
    <script
      id="schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
      suppressHydrationWarning
    />
  );
}
