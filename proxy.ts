import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 proxy (formerly middleware).
 *
 * User/admin auth is enforced client-side via RequireAuth because Laravel
 * Sanctum session cookies belong to the API origin and are not available
 * to server-side fetches during document navigation on the Next.js host.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/avatars/:path*",
    "/tickets/:path*",
    "/admin/:path*",
  ],
};
