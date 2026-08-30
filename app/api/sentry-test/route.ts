import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SENTRY_DSN is not configured" },
      { status: 500 },
    );
  }

  Sentry.captureMessage("Sentry server test message", "info");

  throw new Error("Sentry server test error");
}
