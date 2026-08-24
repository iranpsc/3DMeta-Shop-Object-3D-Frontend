type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Renders JSON-LD with `<` scrubbed to mitigate XSS in stringified payloads. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
