import { stripEmpty } from "@/lib/seo-utils";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Renders JSON-LD with empty fields removed and `<` scrubbed to mitigate XSS. */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? data.map((item) => stripEmpty(item))
    : stripEmpty(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
