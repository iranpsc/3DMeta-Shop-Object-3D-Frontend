import type { ProductDetail } from "@/lib/types";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export function buildAvatarsPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ساخت آواتار رایگان",
    description:
      "فقط با چند کلیک، یک آواتار سفارشی مطابق با سلیقه خودتان بسازید. کاملاً رایگان و بدون محدودیت!",
    url: absoluteUrl("/avatars"),
    author: {
      "@type": "Organization",
      name: "سبعدی متا",
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
        availability: "https://schema.org/InStock",
      },
    },
  };
}

export function buildAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Us - سه بعدی متا فروشگاه",
    url: absoluteUrl("/about-us"),
    mainEntity: {
      "@type": "Organization",
      name: "سه بعدی متا فروشگاه",
      url: SITE_URL,
      logo: absoluteUrl("/home-page/images/3d.png"),
      sameAs: [
        "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
        "https://discord.gg/xqBe3h9hnN",
        "https://www.instagram.com/modelify3d_com/",
        "https://pin.it/7C5mYf6Q6",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+989127855049",
        contactType: "Customer Service",
        areaServed: "IR",
        availableLanguage: "Persian",
      },
      description:
        "سه بعدی متا فروشگاه پیشرو در زمینه چاپ سه بعدی است که خدمات حرفه‌ای و محصولات با کیفیت بالا ارائه می‌دهد.",
      parentOrganization: {
        "@type": "Organization",
        name: "هولدینگ زنجیره تامین بهشت",
      },
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Iran",
        addressLocality: "Qazvin",
        addressRegion: "Qazvin Province",
        streetAddress: "Mirdamad, 824H+JG2",
      },
    },
  };
}

export function buildContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us - سه بعدی متا فروشگاه",
    url: absoluteUrl("/contact-us"),
    mainEntity: {
      "@type": "Organization",
      name: "سه بعدی متا فروشگاه",
      url: SITE_URL,
      logo: absoluteUrl("/home-page/images/3d.png"),
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+989127855049",
          contactType: "Customer Service",
          areaServed: "IR",
          availableLanguage: ["Persian", "English"],
          email: "info@example.com",
        },
        {
          "@type": "ContactPoint",
          telephone: "+989127855049",
          contactType: "Sales",
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
        addressCountry: "Iran",
      },
      sameAs: [
        "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
        "https://discord.gg/xqBe3h9hnN",
        "https://www.instagram.com/modelify3d_com/",
        "https://pin.it/7C5mYf6Q6",
      ],
    },
  };
}

export function buildProductSchema(
  product: ProductDetail,
  pageUrl: string,
): Record<string, unknown> {
  const inStock =
    product.stock_status === true ||
    (typeof product.quantity === "number" && product.quantity > 0);
  const reviewCount = product.approved_reviews_count ?? product.reviews_count ?? 0;
  const ratingValue = product.rating_avg ?? 0;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    category: product.category?.name,
    image: product.images?.[0]?.url ?? product.image?.url,
    description: product.short_description ?? undefined,
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "IRR",
      price: String(product.final_price ?? product.price),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "سه بعدی متا",
      },
    },
  };

  if (reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(Math.round(Number(ratingValue))),
      reviewCount: String(reviewCount),
    };
  }

  return schema;
}

export function buildHomeWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "سه بعدی متا",
    url: SITE_URL,
    description:
      "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
    inLanguage: "fa-IR",
    publisher: {
      "@type": "Organization",
      name: "سه بعدی متا فروشگاه",
      url: SITE_URL,
      logo: absoluteUrl("/home-page/images/3d.png"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
