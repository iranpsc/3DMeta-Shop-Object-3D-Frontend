import { test, expect } from "@playwright/test";

test.describe("Auth shell", () => {
  test("login redirect points to Laravel OAuth", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await Promise.all([
      page.waitForURL(
        (url) => {
          const href = url.href;
          return (
            href.includes(`${apiBase}/auth/redirect`) ||
            href.includes("/oauth/authorize") ||
            href.includes("accounts.irpsc.com")
          );
        },
        { timeout: 15000 },
      ),
      page.getByRole("button", { name: "login" }).click(),
    ]);

    expect(
      page.url().includes("/auth/redirect") ||
        page.url().includes("/oauth/authorize") ||
        page.url().includes("accounts.irpsc.com"),
    ).toBeTruthy();
  });
});
