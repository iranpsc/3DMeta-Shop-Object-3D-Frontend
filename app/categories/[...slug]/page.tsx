import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyPage } from "@/components/ui/empty-page";
import { ProductCard } from "@/components/ui/product-card";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { StorefrontBreadcrumb } from "@/components/layout/StorefrontBreadcrumb";
import { TopLevelCategorySlider } from "@/components/home/TopLevelCategorySlider";
import {
  fetchCategory,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";
import type { ProductCard as ProductType } from "@/lib/types";

type Params = Promise<{ slug: string[] }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await fetchCategory(slug.join("/"));
    return {
      title: category.name,
      description: category.description ?? undefined,
    };
  } catch {
    return { title: "دسته بندی" };
  }
}

const DEFAULT_IMAGE = "/home-page/images/default-product.jpg";

export default async function CategoryShowPage({ params }: { params: Params }) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  let category;
  let topLevel: Awaited<ReturnType<typeof fetchTopLevelCategories>> = [];
  try {
    [category, topLevel] = await Promise.all([
      fetchCategory(slugPath),
      fetchTopLevelCategories(),
    ]);
  } catch {
    notFound();
  }

  const children = category.children ?? [];
  const productsPayload = category.products;
  const products: ProductType[] =
    productsPayload && !Array.isArray(productsPayload)
      ? productsPayload.data
      : [];

  const crumbs = [
    { label: "خانه", href: "/" },
    ...slug.map((segment, index) => ({
      label: index === slug.length - 1 ? category.name : segment,
      href:
        index === slug.length - 1
          ? undefined
          : `/categories/${slug.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <main>
      <LegalTopBar />
      <section className="mx-auto mt-24 max-w-[1500px] p-4 lg:mt-4 lg:p-9 lg:pt-0">
        <StorefrontBreadcrumb
          crumbs={crumbs}
          sideLabel={
            <>
              <span>دسته بندی : </span>
              <span>{category.name}</span>
            </>
          }
        />
        <div className="relative w-full">
          <TopLevelCategorySlider categories={topLevel} />
        </div>
      </section>

      <section className="mx-auto mt-24 flex max-w-[1500px] flex-col gap-5 lg:mt-14 lg:p-9">
        <div className="px-5">
          <div className="flex flex-col gap-5 rounded-[20px] bg-[#ECF4FE] p-3 md:flex-row dark:bg-[#1A1A18]">
            <div className="w-full md:w-1/3 xl:w-1/4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="aspect-square w-full rounded-[10px]"
                alt={`دسته بندی ${category.name}`}
                src={category.image?.url ?? DEFAULT_IMAGE}
              />
            </div>
            <div className="flex w-full flex-col gap-5 px-5 py-2 md:w-2/3 xl:w-3/4">
              <h1 className="text-xl font-bold text-[#000BEE] md:text-[30px] dark:text-white">
                {category.name}
              </h1>
              <p className="text-justify text-[#868B90] md:text-xl dark:text-[#989898]">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full space-y-5 px-5" id="products-list">
          <div className="grid gap-5 transition duration-500 lg:grid-cols-2 xl:grid-cols-4">
            {children.length > 0
              ? children.map((child) => (
                  <div key={child.id} className="product">
                    <div className="flex w-full flex-col items-center overflow-hidden rounded-[20px] bg-[#ECF4FE] p-2 text-center transition-all duration-500 dark:bg-[#1A1A18]">
                      <Link href={child.url} className="w-full p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="rounded-[10px]"
                          src={child.image?.url ?? DEFAULT_IMAGE}
                          loading="lazy"
                          alt={`دسته ${child.name}`}
                        />
                      </Link>
                      <div className="flex w-full flex-col items-center justify-center gap-3">
                        <Link
                          href={child.url}
                          className="py-[10px] text-sm font-bold text-stone-800 lg:text-xl dark:text-white"
                        >
                          {child.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : products.length > 0
                ? products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : (
                    <div className="col-span-full">
                      <EmptyPage message="محصولی یافت نشد" />
                    </div>
                  )}
          </div>
        </div>
      </section>
    </main>
  );
}
