import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import {
  fetchCategoriesPage,
  fetchProducts,
  fetchStoreFilters,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about-us"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/contact-us"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let tagRoutes: MetadataRoute.Sitemap = [];

  try {
    const [productsRes, topCategories, categoriesRes, filters] =
      await Promise.allSettled([
        fetchProducts({ take: 200 }),
        fetchTopLevelCategories(),
        fetchCategoriesPage(1),
        fetchStoreFilters(),
      ]);

    // Products
    if (productsRes.status === "fulfilled" && productsRes.value?.data) {
      const items = Array.isArray(productsRes.value.data)
        ? productsRes.value.data
        : [];
      productRoutes = items.map((product) => ({
        url: absoluteUrl(`/products/${product.sku}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }

    // Categories
    const categorySlugs = new Set<string>();

    if (topCategories.status === "fulfilled" && Array.isArray(topCategories.value)) {
      for (const cat of topCategories.value) {
        if (cat.slug) categorySlugs.add(cat.slug);
      }
    }

    if (categoriesRes.status === "fulfilled" && categoriesRes.value?.data) {
      for (const cat of categoriesRes.value.data) {
        if (cat.slug) categorySlugs.add(cat.slug);
        if (Array.isArray(cat.children)) {
          for (const child of cat.children) {
            if (child.slug) categorySlugs.add(child.slug);
          }
        }
      }
    }

    categoryRoutes = Array.from(categorySlugs).map((slug) => ({
      url: absoluteUrl(`/categories/${slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Tags
    if (filters.status === "fulfilled" && Array.isArray(filters.value?.tags)) {
      tagRoutes = filters.value.tags
        .filter((tag) => Boolean(tag.slug))
        .map((tag) => ({
          url: absoluteUrl(`/tags/${tag.slug}`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        }));
    }
  } catch {
    // Keep static routes if API is temporarily unavailable
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...tagRoutes];
}
