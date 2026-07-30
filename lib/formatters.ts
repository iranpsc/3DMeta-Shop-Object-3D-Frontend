export function formatDate(
  value?: string | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fa-IR", options);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleString("fa-IR");
}

export function formatPrice(value: number): string {
  return Number(value).toLocaleString("fa-IR");
}

/** @deprecated Prefer formatDate — kept for existing admin imports */
export function formatAdminDate(value?: string | null): string {
  return formatDate(value);
}
