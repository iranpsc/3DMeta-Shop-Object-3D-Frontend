import { test } from "@playwright/test";
import { isAuthRedirectUrl } from "./helpers";

test.describe("Admin area auth gate", () => {
  test("unauthenticated user is sent to OAuth when visiting admin dashboard", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), { timeout: 15000 }),
      page.goto("/admin/dashboard"),
    ]);
  });

  test("unauthenticated user is sent to OAuth when visiting admin products", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), { timeout: 15000 }),
      page.goto("/admin/products"),
    ]);
  });
});
