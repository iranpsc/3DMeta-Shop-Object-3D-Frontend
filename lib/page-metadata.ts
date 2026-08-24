import type { Metadata } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { stripHtml } from "@/lib/seo-utils";

/** Default Open Graph image used when a page does not set its own. */
export const DEFAULT_OG_IMAGE = "/home-page/images/Asset2.png";

const DEFAULT_KEYWORDS =
  "مدل سه بعدی, فروشگاه مدل سه بعدی, انیمیشن سه بعدی, آیکون, طراحی سه بعدی, 3d, 3dmeta, 3drgb";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "سه بعدی متا",
  description:
    "سامانه سه بعدی متا با تعرفه ای ثابت مرکز عرضه جدید ترین مدل سه بعدی ، آیکون ، انیمیشن و دیگر فایل های طراحی میباشد .",
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: "سه بعدی متا" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "سه بعدی متا",
    title: "سه بعدی متا",
    description:
      "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی",
    images: [DEFAULT_OG_IMAGE],
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "سه بعدی متا",
    description:
      "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی",
    images: [DEFAULT_OG_IMAGE],
  },
};

type PageMetaInput = {
  title: string;
  description?: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | null;
  /** Livewire used `product` on product/category pages; Next typed OG uses website. */
  ogType?: "website" | "article";
  path?: string;
};

/** Build Next.js Metadata mirroring Livewire @section title/description/og fields. */
export function pageMetadata({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  path,
}: PageMetaInput): Metadata {
  const image = ogImage || DEFAULT_OG_IMAGE;
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = stripHtml(ogDescription ?? description);
  const cleanDescription = stripHtml(description);
  const url = path ? absoluteUrl(path) : undefined;

  return {
    title,
    description: cleanDescription,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: "fa_IR",
      siteName: "سه بعدی متا",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: image ? [image] : undefined,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: image ? [image] : undefined,
    },
  };
}

export const homeMetadata = pageMetadata({
  title: "سه بعدی متا - فروشگاه مدل های سه بعدی",
  description:
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
  keywords:
    "مدل سه بعدی, فروشگاه مدل سه بعدی, انیمیشن سه بعدی, آیکون, طراحی سه بعدی",
  ogTitle: "سه بعدی متا",
  ogDescription:
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی",
  ogImage: "/home-page/images/Asset2.png",
  path: "/",
});

export const avatarsMetadata = pageMetadata({
  title: "ساخت آواتار رایگان",
  description:
    "ساخت آواتار رایگان به سادگی و با چند کلیک در وب‌سایت ما انجام می‌شود.",
  keywords: "ساخت آواتار رایگان, طراحی آواتار آنلاین, آواتار رایگان",
  ogTitle: "ساخت آواتار رایگان",
  ogDescription:
    "با وب‌سایت ما به راحتی و به صورت رایگان آواتارهای جذاب و حرفه‌ای طراحی کنید.",
  ogImage: "/home-page/images/avatar.s.png",
  path: "/avatars",
});

export const aboutUsMetadata = pageMetadata({
  title: "درباره ما",
  description:
    "سه بعدی متا فروشگاه پیشرو در زمینه چاپ سه بعدی است که خدمات حرفه‌ای و محصولات با کیفیت بالا ارائه می‌دهد.",
  ogTitle: "درباره ما - سه بعدی متا فروشگاه",
  ogDescription:
    "سه بعدی متا فروشگاه پیشرو در زمینه چاپ سه بعدی است که خدمات حرفه‌ای و محصولات با کیفیت بالا ارائه می‌دهد.",
  ogImage: "/home-page/images/3d.png",
  path: "/about-us",
});

export const contactUsMetadata = pageMetadata({
  title: "تماس با ما",
  description: "پیام شما میتواند شروع یک مکالمه سازنده باشد.",
  ogTitle: "تماس با ما - سه بعدی متا فروشگاه",
  ogDescription: "پیام شما میتواند شروع یک مکالمه سازنده باشد.",
  ogImage: "/home-page/images/3d.png",
  path: "/contact-us",
});

export const storeMetadata = pageMetadata({
  title: "محصولات",
  description:
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی با تعرفه ثابت",
  ogTitle: "محصولات",
  ogDescription:
    "مرکز عرضه جدیدترین مدل سه بعدی، آیکون، انیمیشن و فایل های طراحی",
  path: "/products",
});

export const categoriesIndexMetadata = pageMetadata({
  title: "دسته بندی محصولات",
  description:
    "مرور دسته بندی محصولات سه بعدی، آیکون، انیمیشن و فایل های طراحی",
  ogTitle: "دسته بندی محصولات",
  path: "/categories",
});
