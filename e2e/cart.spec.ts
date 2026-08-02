import { test, expect } from "@playwright/test";
import { seedCartWithFirstProduct } from "./helpers";

test.describe("Cart page", () => {
  test("empty cart shows empty state", async ({ page }) => {
    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 4, name: "سبد خرید" })).toBeVisible();
    await expect(page.getByText("بدون دیتا")).toBeVisible({ timeout: 15000 });
  });

  test("cart page has checkout link when populated via UI", async ({ page, request }) => {
    await seedCartWithFirstProduct(page, request);

    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: /تسویه حساب/i })).toBeVisible();
  });
});
