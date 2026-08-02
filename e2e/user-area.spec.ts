import { test } from "@playwright/test";
import { isAuthRedirectUrl } from "./helpers";

test.describe("User area auth gate", () => {
  test("unauthenticated user is sent to OAuth when visiting profile", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), {
        timeout: 20000,
        waitUntil: "commit",
      }),
      page.goto("/profile", { waitUntil: "domcontentloaded" }),
    ]);
  });

  test("unauthenticated user is sent to OAuth when visiting dashboard", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), {
        timeout: 20000,
        waitUntil: "commit",
      }),
      page.goto("/dashboard", { waitUntil: "domcontentloaded" }),
    ]);
  });

  test("unauthenticated user is sent to OAuth when visiting tickets", async ({ page }) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    await Promise.all([
      page.waitForURL((url) => isAuthRedirectUrl(url, apiBase), {
        timeout: 20000,
        waitUntil: "commit",
      }),
      page.goto("/tickets", { waitUntil: "domcontentloaded" }),
    ]);
  });
});
