import { test, expect } from "@playwright/test";

test.describe("User area auth gate", () => {
  test("unauthenticated user is sent to OAuth when visiting profile", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL(
        (url) =>
          url.href.includes(`${apiBase}/auth/redirect`) ||
          url.href.includes("accounts.irpsc.com"),
        { timeout: 15000 },
      ),
      page.goto("/profile"),
    ]);
  });

  test("unauthenticated user is sent to OAuth when visiting dashboard", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL(
        (url) =>
          url.href.includes(`${apiBase}/auth/redirect`) ||
          url.href.includes("accounts.irpsc.com"),
        { timeout: 15000 },
      ),
      page.goto("/dashboard"),
    ]);
  });

  test("unauthenticated user is sent to OAuth when visiting tickets", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL(
        (url) =>
          url.href.includes(`${apiBase}/auth/redirect`) ||
          url.href.includes("accounts.irpsc.com"),
        { timeout: 15000 },
      ),
      page.goto("/tickets"),
    ]);
  });
});
