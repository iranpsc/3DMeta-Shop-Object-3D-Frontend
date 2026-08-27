import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import TicketsPageClient from "./TicketsPageClient";

export const metadata: Metadata = privatePageMetadata("پیام ها");

export default function TicketsPage() {
  return (
    <RequireAuth>
      <TicketsPageClient />
    </RequireAuth>
  );
}
