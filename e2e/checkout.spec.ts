import { test, expect } from "@playwright/test";
import { seedCartWithFirstProduct } from "./helpers";

test.describe("Checkout page", () => {
  test("empty checkout redirects messaging", async ({ page }) => {
    await page.goto("/checkout", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("تسویه حساب").first()).toBeVisible();
    await expect(page.getByText(/سبد خرید شما خالی است/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("link", { name: /بازگشت به سبد خرید/i })).toBeVisible();
  });

  test("guest with cart sees create-account step", async ({ page, request }) => {
    await seedCartWithFirstProduct(page, request);

    await page.goto("/checkout", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "ورود" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ثبت نام" })).toBeVisible();
  });
});
