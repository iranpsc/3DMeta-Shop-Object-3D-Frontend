import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CreateTicketPageClient from "./CreateTicketPageClient";

export const metadata: Metadata = {
  title: "ایجاد پیام",
};

export default function CreateTicketPage() {
  return (
    <RequireAuth>
      <CreateTicketPageClient />
    </RequireAuth>
  );
}
