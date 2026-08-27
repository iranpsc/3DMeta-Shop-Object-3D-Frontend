import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CreateTicketPageClient from "./CreateTicketPageClient";

export const metadata: Metadata = privatePageMetadata("ایجاد پیام");

export default function CreateTicketPage() {
  return (
    <RequireAuth>
      <CreateTicketPageClient />
    </RequireAuth>
  );
}
