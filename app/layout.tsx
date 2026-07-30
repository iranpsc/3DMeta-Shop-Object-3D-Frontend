import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import "sweetalert2/dist/sweetalert2.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "سه بعدی متا",
  description:
    "سامانه سه بعدی متا با تعرفه ای ثابت مرکز عرضه جدید ترین مدل سه بعدی ، آیکون ، انیمیشن و دیگر فایل های طراحی میباشد .",
  authors: [{ name: "سه بعدی متا" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" className="loading-site js h-full antialiased">
      <head>
        <link rel="icon" type="image/x-icon" href="/home-page/images/3ddmetaa143.png" />
        <link rel="stylesheet" href="/assets/css/style-rtl.css" />
        <link rel="stylesheet" href="/assets/vendor_assets/css/line-awesome.min.css" />
      </head>
      <body className="min-h-full font-bold">
        <NavigationProgress />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
