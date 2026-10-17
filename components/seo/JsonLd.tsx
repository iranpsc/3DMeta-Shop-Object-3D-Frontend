import type { JSX } from "react";

type JsonLdProps<T extends Record<string, unknown>> = {
  data: T | T[];
};

/**
 * Renders JSON-LD structured data with XSS prevention (escaping < character).
 */
export function JsonLd<T extends Record<string, unknown>>({
  data,
}: JsonLdProps<T>): JSX.Element {
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
