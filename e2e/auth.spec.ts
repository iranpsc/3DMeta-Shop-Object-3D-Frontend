import { test, expect } from "@playwright/test";
import { isAuthRedirectUrl } from "./helpers";

test.describe("Auth shell", () => {
  test("login redirect points to Laravel OAuth", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), { timeout: 15000 }),
      page.getByRole("button", { name: "login" }).click(),
    ]);

    expect(isAuthRedirectUrl(new URL(page.url()), apiBase)).toBeTruthy();
  });
});
