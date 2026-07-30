export type StoreFilterState = {
  search: string;
  category: string;
  tag: string;
  tags: string[];
  sort: string;
  price_min: string;
  price_max: string;
  page: string;
};

export const DEFAULT_STORE_FILTERS: StoreFilterState = {
  search: "",
  category: "",
  tag: "",
  tags: [],
  sort: "newest",
  price_min: "",
  price_max: "",
  page: "1",
};

export function hasActiveStoreFilters(filters: StoreFilterState): boolean {
  return (
    filters.search !== "" ||
    filters.category !== "" ||
    filters.tags.length > 0 ||
    filters.sort !== "newest" ||
    filters.price_min !== "" ||
    filters.price_max !== ""
  );
}

export const PRICE_MAX_DEFAULT = 9000000;
export const PRICE_MIN_LIMIT = 0;
export const PRICE_MAX_LIMIT = 10000000;
export const VISIBLE_TAGS_COUNT = 6;

type SearchParamValue = string | string[] | undefined;
type SearchParams = Record<string, SearchParamValue>;

export function buildStoreQuery(
  parts: Record<string, string | string[] | undefined>,
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(parts)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      for (const entry of value) {
        if (entry) qs.append(key, entry);
      }
      continue;
    }
    qs.set(key, value);
  }
  return qs.toString();
}

export function buildApiParams(
  filters: StoreFilterState,
): Record<string, string | number | undefined> {
  const min = Number(filters.price_min || 0);
  const max = Number(filters.price_max || PRICE_MAX_DEFAULT);

  return {
    search: filters.search || undefined,
    category: filters.category || undefined,
    tag: filters.tags.length > 0 ? filters.tags.join(",") : undefined,
    sort: filters.sort || undefined,
    page: filters.page !== "1" ? filters.page : undefined,
    price_min: min > 0 ? String(min) : undefined,
    price_max: max < PRICE_MAX_DEFAULT ? String(max) : undefined,
  };
}

export function filtersToQueryParts(
  filters: StoreFilterState,
): Record<string, string | string[] | undefined> {
  const min = Number(filters.price_min || 0);
  const max = Number(filters.price_max || PRICE_MAX_DEFAULT);

  return {
    search: filters.search || undefined,
    category: filters.category || undefined,
    tags_filter: filters.tags.length > 0 ? filters.tags : undefined,
    sort: filters.sort !== "newest" ? filters.sort : undefined,
    page: filters.page !== "1" ? filters.page : undefined,
    price_min: min > 0 ? String(min) : undefined,
    price_max: max < PRICE_MAX_DEFAULT ? String(max) : undefined,
  };
}

export function syncStoreUrl(filters: StoreFilterState): void {
  const query = buildStoreQuery(filtersToQueryParts(filters));
  const nextUrl = query ? `/products?${query}` : "/products";
  window.history.replaceState(null, "", nextUrl);
}

function parseTagsFilter(sp: SearchParams): string[] {
  const raw = sp.tags_filter ?? sp.tag;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (raw.includes(",")) return raw.split(",").filter(Boolean);
  return [raw];
}

export function parseStoreFilters(sp: SearchParams): StoreFilterState {
  const tags = parseTagsFilter(sp);

  return {
    search: typeof sp.search === "string" ? sp.search : "",
    category: typeof sp.category === "string" ? sp.category : "",
    tag: tags.join(","),
    tags,
    sort: typeof sp.sort === "string" ? sp.sort : "newest",
    price_min: typeof sp.price_min === "string" ? sp.price_min : "",
    price_max: typeof sp.price_max === "string" ? sp.price_max : "",
    page: typeof sp.page === "string" ? sp.page : "1",
  };
}
