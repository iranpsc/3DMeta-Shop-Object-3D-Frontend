import type { Metadata } from "next";
import { TopLevelCategorySlider } from "@/components/home/TopLevelCategorySlider";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { StorefrontBreadcrumb } from "@/components/layout/StorefrontBreadcrumb";
import { StoreProductsSection } from "@/components/store/StoreProductsSection";
import {
  buildApiParams,
  parseStoreFilters,
} from "@/components/store/store-utils";
import {
  fetchStoreFilters,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";
import { serverApiFetch } from "@/lib/server-api";
import type { PaginationMeta, ProductCard as ProductType } from "@/lib/types";

export const metadata: Metadata = {
  title: "محصولات",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function loadProducts(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  return serverApiFetch<ProductType[]>(
    `/api/v1/products${query ? `?${query}` : ""}`,
  ) as Promise<{
    data: ProductType[];
    meta?: PaginationMeta;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const initialFilters = parseStoreFilters(sp);
  const apiParams = buildApiParams(initialFilters);

  let products: ProductType[] = [];
  let meta: PaginationMeta | undefined;
  let filters: Awaited<ReturnType<typeof fetchStoreFilters>> = {
    categories: [],
    tags: [],
  };
  let topLevel: Awaited<ReturnType<typeof fetchTopLevelCategories>> = [];

  try {
    const [productsRes, storeFilters, top] = await Promise.all([
      loadProducts(
        Object.fromEntries(
          Object.entries(apiParams).map(([key, value]) => [
            key,
            value !== undefined ? String(value) : undefined,
          ]),
        ),
      ),
      fetchStoreFilters(),
      fetchTopLevelCategories(),
    ]);
    products = productsRes.data ?? [];
    meta = productsRes.meta;
    filters = storeFilters ?? filters;
    topLevel = top;
  } catch {
    // API may be offline during local UI/E2E shell checks
  }

  return (
    <main className="overflow-x-hidden">
      <LegalTopBar />
      <section className="mx-auto mt-24 max-w-[1500px] overflow-x-hidden p-4 lg:mt-4 lg:p-9 lg:pt-0">
        <StorefrontBreadcrumb
          crumbs={[
            { label: "خانه", href: "/" },
            { label: "فروشگاه" },
          ]}
          sideLabel={<span>لیست محصولات</span>}
        />
        <div className="relative mt-10 w-full min-w-0 overflow-x-hidden">
          <TopLevelCategorySlider categories={topLevel} />
        </div>
      </section>

      <StoreProductsSection
        initialProducts={products}
        initialMeta={meta}
        initialFilters={initialFilters}
        categories={filters.categories ?? []}
        tags={filters.tags ?? []}
      />
    </main>
  );
}
