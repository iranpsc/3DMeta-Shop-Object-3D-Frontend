import { serverApiFetch } from "./server-api";
import type {
  CategorySummary,
  PaginatedEnvelope,
  PaginationMeta,
  ProductCard,
  ProductDetail,
  ReviewItem,
  TagSummary,
} from "./types";

export async function fetchProducts(params: Record<string, string | number | undefined> = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      qs.set(key, String(value));
    }
  }
  const query = qs.toString();
  return serverApiFetch<ProductCard[] | undefined>(
    `/api/v1/products${query ? `?${query}` : ""}`,
  ) as Promise<PaginatedEnvelope<ProductCard[]>>;
}

export async function fetchHomeProducts(sort: "newest" | "score" | "sales" = "newest") {
  const res = await serverApiFetch<ProductCard[]>(`/api/v1/products?sort=${sort}&take=15`);
  return res.data ?? [];
}

export async function fetchPopularCategories(take = 12) {
  const res = await serverApiFetch<CategorySummary[]>(`/api/v1/categories/popular?take=${take}`);
  return res.data ?? [];
}

export async function fetchTopLevelCategories() {
  const res = await serverApiFetch<CategorySummary[]>(`/api/v1/categories/top-level`);
  return res.data ?? [];
}

export async function fetchProduct(sku: string) {
  const res = await serverApiFetch<ProductDetail>(`/api/v1/products/${sku}`, {
    next: { revalidate: 0 },
  });
  return res.data;
}

export async function fetchProductReviews(sku: string) {
  const res = await serverApiFetch<{
    reviews: ReviewItem[];
    rating_breakdown: Record<string, number>;
    users_count: number;
  }>(`/api/v1/products/${sku}/reviews`, { next: { revalidate: 0 } });
  return res.data;
}

export async function fetchCategoriesPage(page = 1) {
  return serverApiFetch<CategorySummary[]>(`/api/v1/categories?page=${page}`) as Promise<
    PaginatedEnvelope<CategorySummary[]>
  >;
}

export async function fetchCategory(slugPath: string) {
  const res = await serverApiFetch<CategorySummary>(`/api/v1/categories/${slugPath}`, {
    next: { revalidate: 0 },
  });
  return res.data;
}

export async function fetchTagProducts(slug: string, page = 1) {
  const res = await serverApiFetch<{
    tag: TagSummary;
    products: { data: ProductCard[]; meta: PaginationMeta };
  }>(`/api/v1/tags/${slug}/products?page=${page}`);
  return res.data;
}

export async function fetchStoreFilters() {
  const res = await serverApiFetch<{
    categories: CategorySummary[];
    tags: TagSummary[];
  }>(`/api/v1/products/store-filters`);
  return res.data;
}
