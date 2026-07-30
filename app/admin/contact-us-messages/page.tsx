import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminContactMessagesPageClient from "./AdminContactMessagesPageClient";

export const metadata: Metadata = {
  title: "پیام های دریافتی",
};

export default function AdminContactMessagesPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminContactMessagesPageClient />
    </RequireAuth>
  );
}
