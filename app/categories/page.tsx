import type { Metadata } from "next";
import { EmptyPage } from "@/components/ui/empty-page";
import { Pagination } from "@/components/ui/pagination";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { StorefrontBreadcrumb } from "@/components/layout/StorefrontBreadcrumb";
import { TopLevelCategorySlider } from "@/components/home/TopLevelCategorySlider";
import {
  fetchCategoriesPage,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";
import Link from "next/link";

import { categoriesIndexMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = categoriesIndexMetadata;

const DEFAULT_IMAGE = "/home-page/images/default-product.jpg";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, Number(pageParam) || 1);

  let categories: Awaited<ReturnType<typeof fetchCategoriesPage>>["data"] = [];
  let topLevel: Awaited<ReturnType<typeof fetchTopLevelCategories>> = [];
  let meta: Awaited<ReturnType<typeof fetchCategoriesPage>>["meta"];

  try {
    const [res, top] = await Promise.all([
      fetchCategoriesPage(page),
      fetchTopLevelCategories(),
    ]);
    categories = res.data ?? [];
    meta = res.meta;
    topLevel = top;
  } catch {
    // API may be offline during local UI/E2E shell checks
  }

  return (
    <main>
      <LegalTopBar />
      <section className="mx-auto mt-24 max-w-[1500px] p-4 lg:mt-4 lg:p-9 lg:pt-0">
        <StorefrontBreadcrumb
          crumbs={[
            { label: "خانه", href: "/" },
            { label: "دسته بندی محصولات" },
          ]}
          sideLabel={<span>لیست دسته ها</span>}
        />
        <div className="relative w-full">
          <TopLevelCategorySlider categories={topLevel} />
        </div>
      </section>

      <section className="mx-auto mt-24 flex max-w-[1500px] flex-col gap-5 lg:mt-14 lg:flex-row lg:p-9">
        <div className="mx-auto w-full space-y-5 p-5 lg:w-3/4" id="products-list">
          {categories.length === 0 ? (
            <EmptyPage message="دسته بندی تعریف نشده است." />
          ) : (
            <div className="grid gap-5 transition duration-500 lg:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <div key={category.id} className="product">
                  <div className="flex w-full flex-col items-center overflow-hidden rounded-[20px] bg-[#ECF4FE] p-2 text-center transition-all duration-500 dark:bg-[#1A1A18]">
                    <Link href={category.url} className="w-full p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="rounded-[10px]"
                        src={category.image?.url ?? DEFAULT_IMAGE}
                        loading="lazy"
                        alt={`دسته بندی ${category.name}`}
                      />
                    </Link>
                    <div className="flex w-full flex-col items-center justify-center gap-3">
                      <Link
                        href={category.url}
                        className="py-[10px] text-sm font-bold text-stone-800 lg:text-xl dark:text-white"
                      >
                        {category.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {meta ? (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              hrefPrefix="/categories?page="
              ariaLabel="صفحه‌بندی دسته‌بندی‌ها"
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
