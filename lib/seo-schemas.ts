import type { ProductDetail } from "@/lib/types";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import {
  DEFAULT_PRODUCT_IMAGE,
  offerPriceValidUntil,
  organizationLogo,
  postalAddress,
  resolveMediaUrl,
  SCHEMA_CONTEXT,
  stripEmpty,
  stripHtml,
} from "@/lib/seo-utils";

const ORGANIZATION_NAME = "سه بعدی متا فروشگاه";
const BRAND_NAME = "سه بعدی متا";

function productImages(product: ProductDetail, siteUrl: string): string[] {
  const urls = new Set<string>();

  for (const image of product.images ?? []) {
    const resolved = resolveMediaUrl(image.url, siteUrl);
    if (resolved) urls.add(resolved);
  }

  const primary = resolveMediaUrl(product.image?.url, siteUrl);
  if (primary) urls.add(primary);

  if (urls.size === 0) {
    urls.add(absoluteUrl(DEFAULT_PRODUCT_IMAGE, siteUrl));
  }

  return [...urls];
}

function buildAggregateRating(product: ProductDetail) {
  const reviewCount = product.approved_reviews_count ?? product.reviews_count ?? 0;
  const ratingValue = Number(product.rating_avg ?? 0);

  if (reviewCount <= 0 || !Number.isFinite(ratingValue) || ratingValue <= 0) {
    return undefined;
  }

  return {
    "@type": "AggregateRating",
    ratingValue: Math.round(ratingValue * 10) / 10,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

function buildOffer(pageUrl: string, product: ProductDetail, siteUrl: string) {
  const inStock =
    product.stock_status === true ||
    (typeof product.quantity === "number" && product.quantity > 0);
  const rawPrice = Number(product.final_price ?? product.price ?? 0);
  const price = Number.isFinite(rawPrice) ? rawPrice : 0;

  return {
    "@type": "Offer",
    url: pageUrl,
    priceCurrency: "IRR",
    price,
    priceValidUntil: offerPriceValidUntil(),
    availability: inStock
      ? `${SCHEMA_CONTEXT}/InStock`
      : `${SCHEMA_CONTEXT}/OutOfStock`,
    itemCondition: `${SCHEMA_CONTEXT}/NewCondition`,
    seller: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: siteUrl,
    },
  };
}

export async function buildAvatarsPageSchema() {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl("/avatars", siteUrl);

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: "ساخت آواتار رایگان",
    description:
      "فقط با چند کلیک، یک آواتار سفارشی مطابق با سلیقه خودتان بسازید. کاملاً رایگان و بدون محدودیت!",
    url: pageUrl,
    inLanguage: "fa-IR",
    author: {
      "@type": "Organization",
      name: "سبعدی متا",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "ابزار ساخت آواتار",
      url: pageUrl,
      operatingSystem: "Web",
      applicationCategory: "DesignApplication",
      offers: {
        "@type": "Offer",
        url: pageUrl,
        price: 0,
        priceCurrency: "IRR",
        availability: `${SCHEMA_CONTEXT}/InStock`,
      },
    },
  }) as Record<string, unknown>;
}

export async function buildAboutPageSchema() {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl("/about-us", siteUrl);

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@type": "AboutPage",
    "@id": `${pageUrl}#aboutpage`,
    name: "About Us - سه بعدی متا فروشگاه",
    url: pageUrl,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: ORGANIZATION_NAME,
      url: siteUrl,
      logo: organizationLogo("/home-page/images/3d.png", siteUrl),
      sameAs: [
        "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
        "https://discord.gg/xqBe3h9hnN",
        "https://www.instagram.com/modelify3d_com/",
        "https://pin.it/7C5mYf6Q6",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+989127855049",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: ["fa", "en"],
      },
      description:
        "سه بعدی متا فروشگاه پیشرو در زمینه چاپ سه بعدی است که خدمات حرفه‌ای و محصولات با کیفیت بالا ارائه می‌دهد.",
      parentOrganization: {
        "@type": "Organization",
        name: "هولدینگ زنجیره تامین بهشت",
      },
      foundingDate: "2020",
      address: postalAddress({
        streetAddress: "Mirdamad, 824H+JG2",
        addressLocality: "Qazvin",
        addressRegion: "Qazvin Province",
      }),
    },
  }) as Record<string, unknown>;
}

export async function buildContactPageSchema() {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl("/contact-us", siteUrl);

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@type": "ContactPage",
    "@id": `${pageUrl}#contactpage`,
    name: "Contact Us - سه بعدی متا فروشگاه",
    url: pageUrl,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: ORGANIZATION_NAME,
      url: siteUrl,
      logo: organizationLogo("/home-page/images/3d.png", siteUrl),
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+989127855049",
          contactType: "customer service",
          areaServed: "IR",
          availableLanguage: ["fa", "en"],
          email: "info@example.com",
        },
        {
          "@type": "ContactPoint",
          telephone: "+989127855049",
          contactType: "sales",
          areaServed: "IR",
          availableLanguage: ["fa"],
          email: "hq@irpsc.com",
        },
      ],
      address: postalAddress({
        streetAddress: "Mirdamad, 824H+JG2",
        addressLocality: "Qazvin",
        addressRegion: "Qazvin Province",
        postalCode: "123456789",
      }),
      sameAs: [
        "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
        "https://discord.gg/xqBe3h9hnN",
        "https://www.instagram.com/modelify3d_com/",
        "https://pin.it/7C5mYf6Q6",
      ],
    },
  }) as Record<string, unknown>;
}

export async function buildProductSchema(
  product: ProductDetail,
  pageUrl: string,
): Promise<Record<string, unknown>> {
  const siteUrl = await getSiteUrl();
  const images = productImages(product, siteUrl);
  const description =
    stripHtml(product.short_description) || stripHtml(product.long_description) || undefined;

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: product.name,
    url: pageUrl,
    sku: product.sku,
    description,
    image: images,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    category: product.category?.name,
    offers: buildOffer(pageUrl, product, siteUrl),
    aggregateRating: buildAggregateRating(product),
  }) as Record<string, unknown>;
}

export async function buildHomeWebSiteSchema() {
  const siteUrl = await getSiteUrl();

  const org = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: ORGANIZATION_NAME,
    url: siteUrl,
    logo: organizationLogo("/home-page/images/3d.png", siteUrl),
  };

  const website = {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: "سه بعدی متا",
    url: siteUrl,
    description:
      "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
    inLanguage: "fa-IR",
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return stripEmpty([org, website]) as Record<string, unknown>[];
}
