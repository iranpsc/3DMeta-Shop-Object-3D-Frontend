import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/profile",
          "/profile/*",
          "/orders",
          "/orders/*",
          "/cart",
          "/checkout",
          "/tickets",
          "/tickets/*",
          "/submit-order",
          "/verify",
          "/api/*",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
