import { test, expect } from "@playwright/test";

test.describe("Static public pages", () => {
  test("about us page", async ({ page }) => {
    await page.goto("/about-us", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "درباره ما" })).toBeVisible();
  });

  test("contact us page", async ({ page }) => {
    await page.goto("/contact-us", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "تماس باما" })).toBeVisible();
    await expect(page.getByPlaceholder("نام و نام خانوادگی")).toBeVisible();
    await expect(page.getByRole("button", { name: "ارسال پیام" })).toBeVisible();
  });

  test("categories index page", async ({ page }) => {
    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("لیست دسته ها")).toBeVisible();
  });
});
