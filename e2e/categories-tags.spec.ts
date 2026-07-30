import { test, expect } from "@playwright/test";

test.describe("Categories & tags", () => {
  test("categories index mirrors Livewire chrome", async ({ page }) => {
    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("لیست دسته ها")).toBeVisible();
    await expect(page.getByText("دسته بندی محصولات").first()).toBeVisible();
  });

  test("nested category route renders or 404s cleanly", async ({ page }) => {
    const response = await page.goto("/categories/sample-parent/sample-child", {
      waitUntil: "domcontentloaded",
    });
    expect(response).toBeTruthy();
    expect([200, 404]).toContain(response!.status());
  });

  test("tag route renders heading chrome when available or 404", async ({ page }) => {
    const response = await page.goto("/tags/sample-tag", {
      waitUntil: "domcontentloaded",
    });
    expect(response).toBeTruthy();
    expect([200, 404]).toContain(response!.status());
    if (response!.status() === 200) {
      await expect(page.getByRole("heading", { name: /برچسب/ })).toBeVisible();
      await expect(page.getByText("محصولات مرتبط با این برچسب")).toBeVisible();
    }
  });
});
