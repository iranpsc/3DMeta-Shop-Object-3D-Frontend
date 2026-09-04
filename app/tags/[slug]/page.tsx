import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyPage } from "@/components/ui/empty-page";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/components/ui/product-card";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { StorefrontBreadcrumb } from "@/components/layout/StorefrontBreadcrumb";
import { TopLevelCategorySlider } from "@/components/home/TopLevelCategorySlider";
import { pageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site";
import {
  fetchTagProducts,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await fetchTagProducts(slug);
    return pageMetadata({
      title: data.tag.name,
      description: `محصولات برچسب ${data.tag.name}`,
      keywords: data.tag.name,
      ogTitle: data.tag.name,
      path: `/tags/${slug}`,
      siteUrl: await getSiteUrl(),
    });
  } catch {
    return { title: "برچسب" };
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, Number(pageParam) || 1);

  let data;
  let topLevel: Awaited<ReturnType<typeof fetchTopLevelCategories>> = [];
  try {
    [data, topLevel] = await Promise.all([
      fetchTagProducts(slug, page),
      fetchTopLevelCategories(),
    ]);
  } catch {
    notFound();
  }

  const products = data.products.data ?? [];

  return (
    <main>
      <LegalTopBar />
      <section className="mx-auto mt-24 max-w-[1500px] p-4 lg:mt-4 lg:p-9 lg:pt-0">
        <StorefrontBreadcrumb
          crumbs={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/products" },
            { label: data.tag.name },
          ]}
          sideLabel={
            <>
              <span>برچسب : </span>
              <span>{data.tag.name}</span>
            </>
          }
        />
        <div className="relative w-full">
          <TopLevelCategorySlider categories={topLevel} />
        </div>
      </section>

      <section className="mx-auto mt-24 flex max-w-[1500px] flex-col gap-5 lg:mt-14 lg:p-9">
        <div className="px-4 sm:px-5">
          <div className="flex flex-col gap-3 rounded-[20px] bg-[#ECF4FE] p-4 sm:p-5 dark:bg-[#1A1A18]">
            <h1 className="text-xl font-bold text-[#000BEE] sm:text-2xl md:text-[30px] dark:text-white">
              برچسب {data.tag.name}
            </h1>
            <p className="text-sm text-[#868B90] sm:text-base md:text-xl dark:text-[#989898]">
              محصولات مرتبط با این برچسب
            </p>
          </div>
        </div>

        <div className="mx-auto w-full space-y-5 px-4 sm:px-5" id="products-list">
          <div className="grid grid-cols-1 gap-4 transition duration-500 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {products.length === 0 ? (
              <div className="col-span-full">
                <EmptyPage message="محصولی یافت نشد" />
              </div>
            ) : (
              products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  imagePriority={index < 3}
                />
              ))
            )}
          </div>
          <Pagination
            currentPage={data.products.meta.current_page}
            lastPage={data.products.meta.last_page}
            hrefPrefix={`/tags/${slug}?page=`}
            ariaLabel="صفحه‌بندی محصولات برچسب"
          />
        </div>
      </section>
    </main>
  );
}
