import { test, expect } from "@playwright/test";

test.describe("Home storefront", () => {
  test("renders hero and product tabs", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByText("مدل سه بعدی و تجربه ای متفاوت"),
    ).toBeVisible();
    await expect(page.locator("#order-by-score")).toBeVisible();
    await expect(page.locator("#order-by-newest")).toBeVisible();
    await expect(page.locator("#order-by-sales")).toBeVisible();
    await expect(page.getByPlaceholder("جستجوی محصول").first()).toBeVisible();
  });

  test("search redirects to products", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const desktop = page.locator("div.relative.mt-20.hidden.lg\\:flex");
    const input = desktop.getByPlaceholder("جستجوی محصول");
    await input.waitFor({ state: "visible" });
    await input.click();
    await input.pressSequentially("صندلی چوبی", { delay: 20 });

    await Promise.all([
      page.waitForURL(/\/products\?search=/, { timeout: 15000 }),
      desktop.getByRole("button", { name: "جستجو" }).click(),
    ]);
  });
});
