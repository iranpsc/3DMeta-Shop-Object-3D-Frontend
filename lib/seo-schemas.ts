import type { CategorySummary, ProductCard, ProductDetail } from "@/lib/types";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import {
  organizationLogo,
  postalAddress,
  resolveMediaUrl,
  SCHEMA_CONTEXT,
  stripEmpty,
  stripHtml,
} from "@/lib/seo-utils";

const ORGANIZATION_NAME = "سه بعدی متا فروشگاه";
const BRAND_NAME = "سه بعدی متا";
const LATIN_BRAND_NAME = "3D Meta";
const ORGANIZATION_DESCRIPTION =
  "سه بعدی متا فروشگاه پیشرو در زمینه چاپ سه بعدی است که خدمات حرفه‌ای و محصولات با کیفیت بالا ارائه می‌دهد.";
const ORGANIZATION_SAME_AS = [
  "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
  "https://discord.gg/xqBe3h9hnN",
  "https://www.instagram.com/modelify3d_com/",
  "https://pin.it/7C5mYf6Q6",
];

function organizationId(siteUrl: string): string {
  return `${absoluteUrl("/", siteUrl)}#organization`;
}

function productImages(product: ProductDetail, siteUrl: string): string[] {
  const urls = new Set<string>();

  for (const image of product.images ?? []) {
    const resolved = resolveMediaUrl(image.url, siteUrl);
    if (resolved) urls.add(resolved);
  }

  const primary = resolveMediaUrl(product.image?.url, siteUrl);
  if (primary) urls.add(primary);

  return [...urls];
}

function buildAggregateRating(product: ProductDetail) {
  const reviewCount = product.approved_reviews_count ?? product.reviews_count ?? 0;
  const ratingValue = Number(product.rating_avg ?? 0);

  if (
    !Number.isInteger(reviewCount) ||
    reviewCount <= 0 ||
    !Number.isFinite(ratingValue) ||
    ratingValue < 1 ||
    ratingValue > 5
  ) {
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
    typeof product.stock_status === "boolean"
      ? product.stock_status
      : typeof product.quantity === "number" && product.quantity > 0;
  const rawPrice = Number(product.final_price ?? product.price ?? 0);

  if (!Number.isFinite(rawPrice) || rawPrice < 0) {
    return undefined;
  }

  return {
    "@type": "Offer",
    url: pageUrl,
    priceCurrency: "IRR",
    price: rawPrice,
    availability: inStock
      ? `${SCHEMA_CONTEXT}/InStock`
      : `${SCHEMA_CONTEXT}/OutOfStock`,
    itemCondition: `${SCHEMA_CONTEXT}/NewCondition`,
    seller: {
      "@type": "OnlineStore",
      "@id": organizationId(siteUrl),
      name: ORGANIZATION_NAME,
      url: siteUrl,
    },
  };
}

export async function buildAvatarsPageSchema() {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl("/avatars", siteUrl);

  // Mirrors Livewire home.blade.php `@script` JSON-LD (avatar WebPage + SoftwareApplication).
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
      "@type": "OnlineStore",
      "@id": organizationId(siteUrl),
      name: ORGANIZATION_NAME,
      url: absoluteUrl("/", siteUrl),
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "ابزار ساخت آواتار",
      operatingSystem: "All",
      applicationCategory: "DesignApplication",
      offers: {
        "@type": "Offer",
        price: "0",
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
    name: "درباره ما - سه بعدی متا فروشگاه",
    description: ORGANIZATION_DESCRIPTION,
    url: pageUrl,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "OnlineStore",
      "@id": organizationId(siteUrl),
      name: ORGANIZATION_NAME,
      alternateName: LATIN_BRAND_NAME,
      url: absoluteUrl("/", siteUrl),
      logo: organizationLogo("/home-page/images/3d.png", siteUrl),
      sameAs: ORGANIZATION_SAME_AS,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+989127855049",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: ["fa", "en"],
      },
      description: ORGANIZATION_DESCRIPTION,
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
    name: "تماس با ما - سه بعدی متا فروشگاه",
    description: "پیام شما میتواند شروع یک مکالمه سازنده باشد.",
    url: pageUrl,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "OnlineStore",
      "@id": organizationId(siteUrl),
      name: ORGANIZATION_NAME,
      alternateName: LATIN_BRAND_NAME,
      url: absoluteUrl("/", siteUrl),
      logo: organizationLogo("/home-page/images/3d.png", siteUrl),
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+989127855049",
          contactType: "customer service",
          areaServed: "IR",
          availableLanguage: ["fa", "en"],
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
      }),
      sameAs: ORGANIZATION_SAME_AS,
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
    stripHtml(product.meta_description) ||
    stripHtml(product.description) ||
    stripHtml(product.short_description) ||
    stripHtml(product.long_description) ||
    undefined;

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: product.name,
    url: pageUrl,
    sku: product.sku,
    description,
    image: images.length > 0 ? images : undefined,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    category: product.category?.name,
    offers: buildOffer(pageUrl, product, siteUrl),
    aggregateRating: buildAggregateRating(product),
  }) as Record<string, unknown>;
}

/** Store listing page: CollectionPage + BreadcrumbList + ItemList of product URLs. */
export async function buildStorePageSchema(
  products: ProductCard[],
): Promise<Record<string, unknown>> {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl("/products", siteUrl);
  const homeUrl = absoluteUrl("/", siteUrl);
  const description =
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت";

  const itemListElement = products
    .map((product, index) => {
      const productUrl = absoluteUrl(
        product.url || `/products/${product.sku}`,
        siteUrl,
      );
      if (!product.name?.trim() || !productUrl) return undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: productUrl,
      };
    })
    .filter(Boolean);

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    name: "فروشگاه",
    description,
    url: pageUrl,
    inLanguage: "fa-IR",
    isPartOf: {
      "@id": `${homeUrl}#website`,
    },
    about: {
      "@id": organizationId(siteUrl),
    },
    breadcrumb: {
      "@id": `${pageUrl}#breadcrumb`,
    },
    mainEntity: {
      "@id": `${pageUrl}#itemlist`,
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "فروشگاه",
        item: pageUrl,
      },
    ],
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    name: "لیست محصولات",
    numberOfItems: itemListElement.length,
    itemListOrder: `${SCHEMA_CONTEXT}/ItemListUnordered`,
    itemListElement: itemListElement.length > 0 ? itemListElement : undefined,
  };

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@graph": [collectionPage, breadcrumb, itemList],
  }) as Record<string, unknown>;
}

type SchemaCrumb = {
  label: string;
  href?: string;
};

function buildBreadcrumbList(
  pageUrl: string,
  crumbs: SchemaCrumb[],
  siteUrl: string,
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => {
      const isLast = index === crumbs.length - 1;
      return stripEmpty({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: !isLast && crumb.href ? absoluteUrl(crumb.href, siteUrl) : undefined,
      });
    }),
  };
}

function buildUrlListItems(
  items: Array<{ name?: string | null; url?: string | null; fallbackPath?: string }>,
  siteUrl: string,
) {
  return items
    .map((item, index) => {
      const path = item.url?.trim() || item.fallbackPath?.trim();
      if (!item.name?.trim() || !path) return undefined;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(path, siteUrl),
      };
    })
    .filter(Boolean);
}

/** Categories index: CollectionPage + BreadcrumbList + ItemList of category URLs. */
export async function buildCategoriesIndexSchema(
  categories: CategorySummary[],
): Promise<Record<string, unknown>> {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl("/categories", siteUrl);
  const homeUrl = absoluteUrl("/", siteUrl);
  const description =
    "مرور دسته بندی محصولات سه بعدی، آیکون، انیمیشن و فایل های طراحی";

  const itemListElement = buildUrlListItems(
    categories.map((category) => ({
      name: category.name,
      url: category.url,
      fallbackPath: `/categories/${category.slug}`,
    })),
    siteUrl,
  );

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: "دسته بندی محصولات",
        description,
        url: pageUrl,
        inLanguage: "fa-IR",
        isPartOf: { "@id": `${homeUrl}#website` },
        about: { "@id": organizationId(siteUrl) },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      buildBreadcrumbList(
        pageUrl,
        [
          { label: "خانه", href: "/" },
          { label: "دسته بندی محصولات" },
        ],
        siteUrl,
      ),
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "لیست دسته ها",
        numberOfItems: itemListElement.length,
        itemListOrder: `${SCHEMA_CONTEXT}/ItemListUnordered`,
        itemListElement: itemListElement.length > 0 ? itemListElement : undefined,
      },
    ],
  }) as Record<string, unknown>;
}

/**
 * Category show page (any depth): CollectionPage + BreadcrumbList + ItemList of
 * child categories when present, otherwise products shown on the page.
 */
export async function buildCategoryPageSchema(
  category: CategorySummary,
  crumbs: SchemaCrumb[],
  products: ProductCard[] = [],
): Promise<Record<string, unknown>> {
  const siteUrl = await getSiteUrl();
  const pageUrl = absoluteUrl(
    category.url || `/categories/${category.slug}`,
    siteUrl,
  );
  const homeUrl = absoluteUrl("/", siteUrl);
  const children = category.children ?? [];
  const image = resolveMediaUrl(category.image?.url, siteUrl);
  const description = stripHtml(category.description);

  const itemListElement =
    children.length > 0
      ? buildUrlListItems(
          children.map((child) => ({
            name: child.name,
            url: child.url,
            fallbackPath: child.slug
              ? `${category.url?.replace(/\/$/, "") || `/categories/${category.slug}`}/${child.slug}`
              : undefined,
          })),
          siteUrl,
        )
      : buildUrlListItems(
          products.map((product) => ({
            name: product.name,
            url: product.url,
            fallbackPath: `/products/${product.sku}`,
          })),
          siteUrl,
        );

  const listName =
    children.length > 0 ? "زیرمجموعه‌های دسته بندی" : "محصولات دسته بندی";

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: category.name,
        description,
        url: pageUrl,
        image,
        inLanguage: "fa-IR",
        isPartOf: { "@id": `${homeUrl}#website` },
        about: { "@id": organizationId(siteUrl) },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      buildBreadcrumbList(pageUrl, crumbs, siteUrl),
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: listName,
        numberOfItems: itemListElement.length,
        itemListOrder: `${SCHEMA_CONTEXT}/ItemListUnordered`,
        itemListElement: itemListElement.length > 0 ? itemListElement : undefined,
      },
    ],
  }) as Record<string, unknown>;
}

export async function buildHomeWebSiteSchema() {
  const siteUrl = await getSiteUrl();
  const homeUrl = absoluteUrl("/", siteUrl);
  const logo = organizationLogo("/home-page/images/3d.png", siteUrl);
  const image = absoluteUrl("/home-page/images/Asset2.png", siteUrl);
  const address = {
    streetAddress: "میرداماد، 824H+JG2",
    addressLocality: "قزوین",
    addressRegion: "استان قزوین",
  };

  const org = {
    "@type": "OnlineStore",
    "@id": organizationId(siteUrl),
    name: ORGANIZATION_NAME,
    alternateName: LATIN_BRAND_NAME,
    url: homeUrl,
    logo,
    image,
    description: ORGANIZATION_DESCRIPTION,
    email: "hq@irpsc.com",
    telephone: "+989127855049",
    address: postalAddress(address),
    sameAs: ORGANIZATION_SAME_AS,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+989127855049",
      email: "hq@irpsc.com",
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: ["fa", "en"],
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    name: BRAND_NAME,
    alternateName: [LATIN_BRAND_NAME, new URL(homeUrl).hostname],
    url: homeUrl,
    image,
    logo,
    description:
      "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
    inLanguage: "fa-IR",
    publisher: {
      "@id": organizationId(siteUrl),
    },
  };

  return stripEmpty({
    "@context": SCHEMA_CONTEXT,
    "@graph": [org, website],
  }) as Record<string, unknown>;
}
