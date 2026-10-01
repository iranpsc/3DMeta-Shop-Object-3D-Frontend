import type { ProductDetail, ReviewItem } from "./types";
import { getProductGalleryImages } from "./product-images";

/**
 * Returns the canonical site base URL.
 * Prefers NEXT_PUBLIC_SITE_URL or SITE_URL environment variables,
 * falling back to production domain https://3dmeta.ir.
 */
export function getSiteUrl(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
      : "") ||
    "https://3dmeta.ir";

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, "");
}

export const SITE_URL = getSiteUrl();

/**
 * Converts a relative path or absolute URL into a fully-qualified absolute URL
 * required by Google Search Console and Schema.org specifications.
 */
export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Core Organization structured data for 3DMeta storefront.
 */
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "سه بعدی متا فروشگاه",
  alternateName: "3DMeta",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/home-page/images/3d.png"),
    caption: "سه بعدی متا",
  },
  image: absoluteUrl("/home-page/images/Asset2.png"),
  description:
    "سامانه سه بعدی متا با تعرفه ای ثابت مرکز عرضه جدید ترین مدل سه بعدی ، آیکون ، انیمیشن و دیگر فایل های طراحی میباشد .",
  parentOrganization: {
    "@type": "Organization",
    name: "هولدینگ زنجیره تامین بهشت",
    url: "https://uni.irpsc.com/member/paradise-supply-chain/",
  },
  foundingDate: "2020",
  sameAs: [
    "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
    "https://discord.gg/xqBe3h9hnN",
    "https://www.instagram.com/modelify3d_com/",
    "https://pin.it/7C5mYf6Q6",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+989127855049",
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: ["Persian", "English"],
      email: "hq@irpsc.com",
    },
    {
      "@type": "ContactPoint",
      telephone: "+989127855049",
      contactType: "sales",
      areaServed: "IR",
      availableLanguage: "Persian",
      email: "hq@irpsc.com",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mirdamad, 824H+JG2",
    addressLocality: "Qazvin",
    addressRegion: "Qazvin Province",
    postalCode: "123456789",
    addressCountry: "IR",
  },
};

/**
 * WebSite structured data with SearchAction for Google Sitelinks Searchbox.
 */
export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "سه بعدی متا",
  alternateName: "3DMeta Shop",
  description:
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: "fa-IR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Builds standard BreadcrumbList structured data with absolute URLs.
 */
export function createBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

/**
 * Builds valid Google-compliant Product structured data (Merchant Listings / Product Snippets).
 */
export function createProductSchema(
  product: ProductDetail,
  reviewsData?: {
    reviews?: ReviewItem[];
    rating_breakdown?: Record<string, number>;
    users_count?: number;
  }
) {
  const productUrl = absoluteUrl(`/products/${product.sku}`);

  // Resolve images to absolute URLs
  const galleryImages = getProductGalleryImages(product);
  const images = (
    galleryImages.length > 0
      ? galleryImages.map((img) => absoluteUrl(img.url))
      : product.image?.url
        ? [absoluteUrl(product.image.url)]
        : [absoluteUrl("/home-page/images/default-product.jpg")]
  ).filter(Boolean);

  const price = Number(product.final_price ?? product.price ?? 0);
  const isInStock = product.stock_status !== false;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name,
    description:
      product.short_description ||
      product.name ||
      "مدل سه بعدی با کیفیت بالا در فروشگاه سه بعدی متا",
    sku: product.sku,
    url: productUrl,
    image: images,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: price,
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "سه بعدی متا فروشگاه",
        url: SITE_URL,
      },
    },
  };

  if (product.category?.name) {
    schema.category = product.category.name;
  }

  // Google Rich Results requires valid ratingValue and reviewCount > 0
  const reviewCount =
    product.approved_reviews_count ||
    product.reviews_count ||
    reviewsData?.users_count ||
    reviewsData?.reviews?.length ||
    0;
  const ratingValue = Number(product.rating_avg || 0);

  if (reviewCount > 0 && ratingValue > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (reviewsData?.reviews && reviewsData.reviews.length > 0) {
    schema.review = reviewsData.reviews.slice(0, 5).map((rev) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: rev.user?.name || "کاربر سه بعدی متا",
      },
      reviewBody: rev.comment,
      datePublished: rev.created_at,
    }));
  }

  return schema;
}

/**
 * Builds CollectionPage structured data for listing pages (categories, tags, store).
 */
export function createCollectionPageSchema({
  title,
  description,
  url,
}: {
  title: string;
  description?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(url),
    url: absoluteUrl(url),
    name: title,
    description: description || title,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };
}
