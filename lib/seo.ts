import type { ProductDetail, ReviewItem } from "./types";
import { getProductGalleryImages } from "./product-images";

function normalizeSiteUrl(url: string): string {
  let value = url.trim();
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  return value.replace(/\/+$/, "");
}

/** Used when no site URL is set, including `next build` page-data collection. */
const DEFAULT_SITE_URL = "http://localhost:3000";

let missingSiteUrlWarned = false;

/**
 * Public site origin from the environment.
 * Reads NEXT_PUBLIC_SITE_URL, SITE_URL, then FRONTEND_URL on every call.
 * Falls back to localhost so production image builds can collect page data
 * when those variables are not passed in.
 */
export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    process.env.FRONTEND_URL?.trim();

  if (!configured) {
    if (!missingSiteUrlWarned && process.env.NODE_ENV === "production") {
      missingSiteUrlWarned = true;
      console.warn(
        "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL, SITE_URL, or FRONTEND_URL. Using http://localhost:3000.",
      );
    }
    return DEFAULT_SITE_URL;
  }

  return normalizeSiteUrl(configured);
}

export function organizationId(): string {
  return `${getSiteUrl()}/#organization`;
}

export function websiteId(): string {
  return `${getSiteUrl()}/#website`;
}

/**
 * Converts a relative path or absolute URL into a fully-qualified absolute URL
 * required by Google Search Console and Schema.org specifications.
 */
export function absoluteUrl(path = ""): string {
  if (!path) return getSiteUrl();
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${cleanPath}`;
}

/**
 * Rewrites storage files onto the public site origin.
 * API responses often use an internal host such as http://3drgb-api, which
 * Googlebot cannot crawl.
 */
export function publicAssetUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const storageAt = parsed.pathname.indexOf("/storage/");
      if (storageAt >= 0) {
        return `${getSiteUrl()}${parsed.pathname.slice(storageAt)}${parsed.search}`;
      }
      return trimmed;
    } catch {
      return absoluteUrl(trimmed);
    }
  }
  return absoluteUrl(trimmed);
}

function plainText(value: string | null | undefined, fallback = ""): string {
  if (!value) return fallback;
  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text || fallback;
}

function toIsoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

/**
 * Core Organization structured data for 3DMeta storefront.
 */
export function createOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId(),
  name: "سه بعدی متا فروشگاه",
  alternateName: "3DMeta",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/home-page/images/3d.png"),
    contentUrl: absoluteUrl("/home-page/images/3d.png"),
    width: 512,
    height: 512,
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
}

/**
 * WebSite structured data with SearchAction for Google Sitelinks Searchbox.
 */
export function createWebsiteSchema() {
  const siteUrl = getSiteUrl();
  return {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId(),
  url: siteUrl,
  name: "سه بعدی متا",
  alternateName: "3DMeta Shop",
  description:
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
  publisher: {
    "@id": organizationId(),
  },
  inLanguage: "fa-IR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  };
}

/**
 * Builds standard BreadcrumbList structured data with absolute URLs.
 */
export function createBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  const list = items
    .map((item) => ({ name: item.name.trim(), url: item.url?.trim() }))
    .filter((item) => item.name.length > 0);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, index) => ({
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

  const galleryImages = getProductGalleryImages(product);
  const images = (
    galleryImages.length > 0
      ? galleryImages.map((img) => publicAssetUrl(img.url))
      : product.image?.url
        ? [publicAssetUrl(product.image.url)]
        : [absoluteUrl("/home-page/images/default-product.jpg")]
  ).filter((url) => url.startsWith("https://") || url.startsWith("http://"));
  const productImages =
    images.length > 0
      ? images
      : [absoluteUrl("/home-page/images/default-product.jpg")];

  const rawPrice = Number(product.final_price ?? product.price ?? 0);
  const price = Number.isFinite(rawPrice) && rawPrice >= 0 ? rawPrice : 0;
  const priceText = Number.isInteger(price) ? String(price) : price.toFixed(2);
  const isInStock = product.stock_status !== false;
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name,
    description: plainText(
      product.meta_description || product.short_description,
      product.name || "مدل سه بعدی با کیفیت بالا در فروشگاه سه بعدی متا",
    ),
    sku: product.sku,
    url: productUrl,
    image: productImages,
    brand: {
      "@type": "Brand",
      name: "سه بعدی متا",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: priceText,
      priceValidUntil: validUntil.toISOString().slice(0, 10),
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "سه بعدی متا فروشگاه",
        url: getSiteUrl(),
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IR",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "IRR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  if (product.category?.name) {
    schema.category = product.category.name;
  }

  // Google Rich Results requires valid ratingValue and reviewCount > 0
  const reviewCount = Number(
    product.approved_reviews_count ||
      product.reviews_count ||
      reviewsData?.users_count ||
      reviewsData?.reviews?.length ||
      0,
  );
  const ratingValue = Number(product.rating_avg || 0);

  if (
    Number.isInteger(reviewCount) &&
    reviewCount > 0 &&
    ratingValue >= 1 &&
    ratingValue <= 5
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const reviews = (reviewsData?.reviews ?? [])
    .map((rev) => {
      const rating = Number(rev.rating);
      const reviewBody = plainText(rev.comment);
      const datePublished = toIsoDate(rev.created_at);
      if (!reviewBody || !Number.isFinite(rating) || rating < 1 || rating > 5) {
        return null;
      }
      return {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          "@type": "Person",
          name: rev.user?.name?.trim() || "کاربر سه بعدی متا",
        },
        reviewBody,
        ...(datePublished ? { datePublished } : {}),
      };
    })
    .filter((review) => review !== null)
    .slice(0, 5);

  if (reviews.length > 0) {
    schema.review = reviews;
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
  image,
}: {
  title: string;
  description?: string;
  url: string;
  image?: string | null;
}) {
  const pageUrl = absoluteUrl(url);
  const imageUrl = image ? publicAssetUrl(image) : "";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: title,
    description: plainText(description, title),
    inLanguage: "fa-IR",
    isPartOf: {
      "@id": websiteId(),
    },
    ...(imageUrl
      ? {
          image: imageUrl,
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: imageUrl,
          },
        }
      : {}),
  };
}
