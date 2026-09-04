import { Suspense } from "react";
import type { Metadata } from "next";
import { TopLevelCategorySlider } from "@/components/home/TopLevelCategorySlider";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { StorefrontBreadcrumb } from "@/components/layout/StorefrontBreadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { StoreProductsSection } from "@/components/store/StoreProductsSection";
import {
  buildApiParams,
  parseStoreFilters,
  type StoreFilterState,
} from "@/components/store/store-utils";
import {
  fetchStoreFilters,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";
import { serverApiFetch } from "@/lib/server-api";
import { storeMetadata } from "@/lib/page-metadata";
import { buildStorePageSchema } from "@/lib/seo-schemas";
import {
  CategoryStripSkeleton,
  ProductGridSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";
import type { PaginationMeta, ProductCard as ProductType } from "@/lib/types";

export const metadata: Metadata = storeMetadata;

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

async function ProductsCategorySlider() {
  let topLevel: Awaited<ReturnType<typeof fetchTopLevelCategories>> = [];

  try {
    topLevel = await fetchTopLevelCategories();
  } catch {
    // API may be offline during local UI/E2E shell checks
  }

  return <TopLevelCategorySlider categories={topLevel} />;
}

function StoreProductsFallback() {
  return (
    <section className="mx-auto mt-24 flex max-w-[1500px] min-w-0 flex-col gap-5 overflow-x-hidden lg:mt-14 lg:flex-row lg:p-9">
      <div className="hidden h-min w-full shrink-0 space-y-4 lg:block lg:w-1/4 lg:p-5">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <div className="w-full min-w-0 space-y-5 p-5 lg:w-3/4">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <ProductGridSkeleton count={3} />
      </div>
    </section>
  );
}

async function StoreProductsLoader({
  initialFilters,
}: {
  initialFilters: StoreFilterState;
}) {
  const apiParams = buildApiParams(initialFilters);
  let products: ProductType[] = [];
  let meta: PaginationMeta | undefined;
  let filters: Awaited<ReturnType<typeof fetchStoreFilters>> = {
    categories: [],
    tags: [],
  };

  try {
    const [productsRes, storeFilters] = await Promise.all([
      loadProducts(
        Object.fromEntries(
          Object.entries(apiParams).map(([key, value]) => [
            key,
            value !== undefined ? String(value) : undefined,
          ]),
        ),
      ),
      fetchStoreFilters(),
    ]);
    products = productsRes.data ?? [];
    meta = productsRes.meta;
    filters = storeFilters ?? filters;
  } catch {
    // API may be offline during local UI/E2E shell checks
  }

  return (
    <>
      <JsonLd data={await buildStorePageSchema(products)} />
      <StoreProductsSection
        initialProducts={products}
        initialMeta={meta}
        initialFilters={initialFilters}
        categories={filters.categories ?? []}
        tags={filters.tags ?? []}
      />
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const initialFilters = parseStoreFilters(sp);

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
          <Suspense fallback={<CategoryStripSkeleton count={3} />}>
            <ProductsCategorySlider />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<StoreProductsFallback />}>
        <StoreProductsLoader initialFilters={initialFilters} />
      </Suspense>
    </main>
  );
}
