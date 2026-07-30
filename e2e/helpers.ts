import { expect, type APIRequestContext, type Page, test } from "@playwright/test";

/**
 * Adds the first published product to the session cart via the product UI
 * (avoids direct API CSRF calls that conflict with Laravel Debugbar in dev).
 */
export async function seedCartWithFirstProduct(
  page: Page,
  request: APIRequestContext,
): Promise<void> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const productsRes = await request.get(`${apiBase}/api/v1/products?take=1`);
  const productsBody = await productsRes.json();
  const product = productsBody?.data?.[0];

  test.skip(!product?.sku, "No published products in API to test cart/checkout");

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`/products/${product.sku}`, { waitUntil: "domcontentloaded" });

  const addButton = page.getByRole("button", { name: /افزودن به سبد خرید/i });
  await addButton.waitFor({ state: "visible" });
  await addButton.click();

  await expect(
    page.getByText(/به سبد خرید اضافه شد|قبلا به سبد خرید اضافه شده است/i),
  ).toBeVisible({ timeout: 15000 });
}
