import { test, expect } from "@playwright/test";

test.describe("Phase 0 shell", () => {
  test("home renders RTL layout shell", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa-IR");
    await expect(page.getByText("مدل سه بعدی و تجربه ای متفاوت")).toBeVisible();
  });
});
