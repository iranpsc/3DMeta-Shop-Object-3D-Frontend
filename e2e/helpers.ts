import { expect, type APIRequestContext, type Page, test } from "@playwright/test";

const OAUTH_ACCOUNTS_HOST = "accounts.irpsc.com";

export function isOAuthAccountsHost(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return host === OAUTH_ACCOUNTS_HOST || host.endsWith(`.${OAUTH_ACCOUNTS_HOST}`);
}

export function isAuthRedirectUrl(url: URL, apiBase: string): boolean {
  try {
    const base = new URL(apiBase);
    if (url.origin === base.origin && url.pathname.startsWith("/auth/redirect")) {
      return true;
    }
  } catch {
    // ignore invalid apiBase in test env
  }

  return url.pathname.includes("/oauth/authorize") || isOAuthAccountsHost(url);
}

/**
 * Adds the first published product to the session cart via the product UI
 * (avoids direct API CSRF calls that conflict with Laravel Debugbar in dev).
 */
export async function seedCartWithFirstProduct(
  page: Page,
  request: APIRequestContext,
): Promise<void> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  // Free products show download, not add-to-cart — pick a paid one.
  const productsRes = await request.get(`${apiBase}/api/v1/products?take=20`);
  const productsBody = await productsRes.json();
  const product = (productsBody?.data ?? []).find(
    (item: { sku?: string; is_free?: boolean }) => item?.sku && !item.is_free,
  );

  test.skip(!product?.sku, "No paid published products in API to test cart/checkout");

  await page.setViewportSize({ width: 1280, height: 720 });

  const clientReady = page.waitForResponse(
    (res) => res.url().includes("/api/v1/") && res.request().method() === "GET",
    { timeout: 15000 },
  );
  await page.goto(`/products/${product.sku}`, { waitUntil: "domcontentloaded" });
  await clientReady;

  // Related product cards also expose this label — use the primary CTA.
  const addButton = page.getByRole("button", { name: /افزودن به سبد خرید/i }).first();
  await addButton.waitFor({ state: "visible" });
  await expect(addButton).toBeEnabled();

  const cartPost = page.waitForResponse(
    (res) =>
      res.request().method() === "POST" &&
      /\/api\/v1\/cart\/\d+/.test(res.url()),
    { timeout: 15000 },
  );

  await addButton.click();
  const response = await cartPost;
  expect(
    response.ok(),
    `add-to-cart failed: ${response.status()} ${await response.text()}`,
  ).toBeTruthy();

  // Primary CTA flips to this label on success (more stable than flash copy).
  await expect(page.getByRole("button", { name: /در سبد خرید/i }).first()).toBeVisible({
    timeout: 15000,
  });
}
