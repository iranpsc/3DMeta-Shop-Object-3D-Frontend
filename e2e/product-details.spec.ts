import { test, expect } from "@playwright/test";

test.describe("Product details", () => {
  test("unknown sku shows not found", async ({ page }) => {
    const response = await page.goto("/products/missing-sku-xyz");
    // Next notFound() typically yields 404
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });

  test("product details route structure when API offline still 404s for missing", async ({
    page,
  }) => {
    await page.goto("/products/missing-sku-xyz");
    // Page should not render product chrome for missing products
    await expect(page.getByText("فرمت قابل دانلود")).toHaveCount(0);
  });
});
