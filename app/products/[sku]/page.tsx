import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGalleryActions } from "@/components/product/ProductGalleryActions";
import { ProductDetailTabs } from "@/components/product/ProductDetailTabs";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { ServerApiError } from "@/lib/server-api";
import { buildProductSchema } from "@/lib/seo-schemas";
import { absoluteUrl } from "@/lib/site";
import { fetchProduct, fetchProductReviews } from "@/lib/storefront-server-api";

type Params = Promise<{ sku: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { sku } = await params;
    const product = await fetchProduct(sku);
    const description =
      product.short_description ?? product.long_description ?? undefined;
    const image = product.images?.[0]?.url ?? product.image?.url ?? null;

    return pageMetadata({
      title: `${product.name} - ${product.sku} - فروشگاه آنلاین`,
      description,
      keywords: product.name,
      ogTitle: product.name,
      ogDescription: product.short_description ?? description,
      ogImage: image,
      path: product.url || `/products/${product.sku}`,
    });
  } catch {
    return { title: "محصول" };
  }
}

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { sku } = await params;

  let product;
  let reviewsData;
  try {
    [product, reviewsData] = await Promise.all([
      fetchProduct(sku),
      fetchProductReviews(sku),
    ]);
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const pageUrl = absoluteUrl(product.url || `/products/${product.sku}`);

  return (
    <main>
      <JsonLd data={buildProductSchema(product, pageUrl)} />
      <section className="mx-auto mt-20 max-w-[1500px] p-4 lg:mt-0 lg:p-9">
        <ProductGalleryActions product={product} />
        {product.tags && product.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {product.tags.map((tag) => (
              <Link
                key={tag.id}
                href={tag.url}
                className="w-max rounded-[10px] bg-[#ffffffa8] px-5 py-3 pb-[13px] text-sm text-[#8E9ABC] dark:bg-[#1A1A18] dark:text-white/70"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <ProductDetailTabs
        product={product}
        reviews={reviewsData.reviews}
        ratingBreakdown={reviewsData.rating_breakdown}
        usersCount={reviewsData.users_count}
      />

      <section className="mx-auto mt-20 max-w-[1500px] p-4 lg:mt-0 lg:p-9">
        <p className="my-8 text-center text-xl font-bold text-[#344054] md:text-right md:text-[30px] dark:text-gray-200">
          موارد مشابه‌ که ممکن است دوست داشته باشید.
        </p>
        <SimilarProducts products={product.similar_products ?? []} />
      </section>
    </main>
  );
}
