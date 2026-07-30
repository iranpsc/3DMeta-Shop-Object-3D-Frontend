import { test, expect } from "@playwright/test";

test.describe("Products listing", () => {
  test("renders store page chrome", async ({ page }) => {
    await page.goto("/products");

    await expect(page.getByText("لیست محصولات")).toBeVisible();
    await expect(page.getByText("مرتب سازی :")).toBeVisible();
    await expect(page.getByRole("tab", { name: "جدید ترین" })).toBeVisible();
    await expect(page.getByPlaceholder("جستجو")).toBeVisible();
    await expect(page.getByText("فیلتر براساس قیمت ( تومان )")).toBeVisible();
    await expect(page.getByText("برچسب ها")).toBeVisible();
  });
});
