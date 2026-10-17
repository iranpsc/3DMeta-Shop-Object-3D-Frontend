const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "font",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const ALLOWED_STYLES = new Set([
  "color",
  "background-color",
  "text-align",
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
]);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeStyle(style: string): string {
  return style
    .split(";")
    .map((part) => {
      const separator = part.indexOf(":");
      if (separator === -1) return "";
      const prop = part.slice(0, separator).trim().toLowerCase();
      const value = part.slice(separator + 1).trim();
      if (!ALLOWED_STYLES.has(prop)) return "";
      if (/url\s*\(|expression\s*\(|javascript:|@import/i.test(value)) return "";
      if (!/^[#a-z0-9\s.,%()\-]+$/i.test(value)) return "";
      return `${prop}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

function sanitizeAttrs(tag: string, raw: string): string {
  const attrs: string[] = [];
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrRe.exec(raw))) {
    const name = match[1].toLowerCase();
    const value = (match[3] ?? match[4] ?? match[5] ?? "").trim();
    if (name.startsWith("on")) continue;

    if (name === "href" && tag === "a") {
      if (/^(https?:|mailto:|\/|#)/i.test(value)) {
        attrs.push(`href="${escapeAttr(value)}"`, 'rel="noopener noreferrer"');
      }
      continue;
    }

    if (name === "src" && tag === "img") {
      if (/^(https?:|\/)/i.test(value)) {
        attrs.push(`src="${escapeAttr(value)}"`);
      }
      continue;
    }

    if (name === "alt" && tag === "img") {
      attrs.push(`alt="${escapeAttr(value)}"`);
      continue;
    }

    if (name === "style") {
      const safe = sanitizeStyle(value);
      if (safe) attrs.push(`style="${escapeAttr(safe)}"`);
      continue;
    }

    if (name === "target" && value === "_blank") {
      attrs.push('target="_blank"');
      continue;
    }

    if (["width", "height", "colspan", "rowspan", "align"].includes(name)) {
      attrs.push(`${name}="${escapeAttr(value)}"`);
    }
  }

  return attrs.length ? ` ${attrs.join(" ")}` : "";
}

function decodeEscapedMarkup(value: string): string {
  const looksEscaped = /&lt;\/?[a-z]/i.test(value) && !/<\/?[a-z][\s\S]*>/i.test(value);
  if (!looksEscaped) return value;

  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Keep product-description markup from the editor and drop executable content. */
export function sanitizeHtml(value: string): string {
  const html = decodeEscapedMarkup(value);

  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tag: string, attrs: string) => {
      const name = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      if (match.startsWith("</")) return `</${name}>`;
      return `<${name}${sanitizeAttrs(name, attrs.replace(/\/\s*$/, ""))}>`;
    });
}
