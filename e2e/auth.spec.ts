import { test, expect } from "@playwright/test";
import { isAuthRedirectUrl } from "./helpers";

test.describe("Auth shell", () => {
  test("login redirect points to Laravel OAuth", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await page.setViewportSize({ width: 1280, height: 720 });

    // Use a light shell page (home mounts Three.js and can stall Firefox clicks).
    const clientReady = page.waitForResponse(
      (res) => res.url().includes("/api/v1/") && res.request().method() === "GET",
      { timeout: 15000 },
    );
    await page.goto("/about-us", { waitUntil: "domcontentloaded" });
    await clientReady;

    const login = page.getByRole("button", { name: "login" });
    await login.waitFor({ state: "visible" });

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), {
        timeout: 20000,
        waitUntil: "commit",
      }),
      login.click(),
    ]);

    expect(isAuthRedirectUrl(new URL(page.url()), apiBase)).toBeTruthy();
  });
});
