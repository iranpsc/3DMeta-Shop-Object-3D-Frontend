import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildAvatarsPageSchema } from "@/lib/seo-schemas";
import AvatarsPageClient from "./AvatarsPageClient";

export const metadata: Metadata = {
  title: "ساخت آواتار رایگان",
  description: "ساخت آواتار رایگان به سادگی و با چند کلیک در وب‌سایت ما انجام می‌شود.",
  keywords: "ساخت آواتار رایگان, طراحی آواتار آنلاین, آواتار رایگان",
  openGraph: {
    title: "ساخت آواتار رایگان",
    description:
      "با وب‌سایت ما به راحتی و به صورت رایگان آواتارهای جذاب و حرفه‌ای طراحی کنید.",
    images: ["/home-page/images/avatar.s.png"],
    type: "website",
  },
};

export default function AvatarsPage() {
  return (
    <>
      <JsonLd data={buildAvatarsPageSchema()} />
      <RequireAuth>
        <AvatarsPageClient />
      </RequireAuth>
    </>
  );
}
