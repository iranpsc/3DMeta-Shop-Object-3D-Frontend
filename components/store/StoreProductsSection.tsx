"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { EmptyPage } from "@/components/ui/empty-page";
import { ProductCard } from "@/components/ui/product-card";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { clientFetchProducts } from "@/lib/storefront-client-api";
import type {
  CategorySummary,
  PaginationMeta,
  ProductCard as ProductType,
  TagSummary,
} from "@/lib/types";
import { StoreFilters, StoreSearchSort } from "./StoreFilters";
import { Pagination } from "@/components/ui/pagination";
import {
  buildApiParams,
  DEFAULT_STORE_FILTERS,
  hasActiveStoreFilters,
  syncStoreUrl,
  type StoreFilterState,
} from "./store-utils";

type Props = {
  initialProducts: ProductType[];
  initialMeta?: PaginationMeta;
  initialFilters: StoreFilterState;
  categories: CategorySummary[];
  tags: TagSummary[];
};

export function StoreProductsSection({
  initialProducts,
  initialMeta,
  initialFilters,
  categories,
  tags,
}: Props) {
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [isPending, startTransition] = useTransition();
  const filtersRef = useRef(initialFilters);
  filtersRef.current = filters;

  const loadProducts = useCallback(
    (nextFilters: StoreFilterState, scrollToList = false) => {
      startTransition(async () => {
        syncStoreUrl(nextFilters);

        try {
          const res = await clientFetchProducts(buildApiParams(nextFilters));
          setProducts(res.data ?? []);
          setMeta(res.meta);
        } catch {
          setProducts([]);
          setMeta(undefined);
        }

        if (scrollToList) {
          document
            .getElementById("products-list")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    [],
  );

  const applyFilters = useCallback(
    (updates: Partial<StoreFilterState>, scrollToList = false) => {
      const next: StoreFilterState = {
        ...filtersRef.current,
        ...updates,
        page: updates.page ?? "1",
      };
      setFilters(next);
      loadProducts(next, scrollToList);
    },
    [loadProducts],
  );

  return (
    <section className="mx-auto mt-24 flex max-w-[1500px] min-w-0 flex-col gap-5 overflow-x-hidden lg:mt-14 lg:flex-row lg:p-9">
      <div className="h-min w-full min-w-0 shrink-0 lg:w-1/4 lg:p-5">
        <StoreFilters
          categories={categories}
          tags={tags}
          current={filters}
          isPending={isPending}
          onNavigate={applyFilters}
        />
      </div>

      <div
        className="w-full min-w-0 space-y-5 p-5 lg:w-3/4"
        id="products-list"
      >
        {hasActiveStoreFilters(filters) ? (
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => applyFilters(DEFAULT_STORE_FILTERS)}
            className="rounded-full px-3 py-1 text-[#848383] disabled:opacity-60 dark:bg-red-900 dark:text-white"
          >
            حذف فیلترها
          </Button>
        ) : null}

        <StoreSearchSort
          current={filters}
          isPending={isPending}
          onNavigate={applyFilters}
        />

        <div
          aria-busy={isPending}
          className={isPending && products.length > 0 ? "pointer-events-none opacity-60" : undefined}
        >
          {isPending && products.length === 0 ? (
            <ProductGridSkeleton count={3} />
          ) : products.length === 0 ? (
            <EmptyPage message="محصولی یافت نشد" />
          ) : (
            <div className="grid gap-5 transition duration-500 lg:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  imagePriority={index < 3}
                />
              ))}
            </div>
          )}
        </div>

        {meta ? (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            disabled={isPending}
            ariaLabel="صفحه‌بندی محصولات"
            onPageChange={(page) =>
              applyFilters({ page: String(page) }, true)
            }
          />
        ) : null}
      </div>
    </section>
  );
}
