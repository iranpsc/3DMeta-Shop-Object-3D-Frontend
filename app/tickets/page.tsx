import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import TicketsPageClient from "./TicketsPageClient";

export const metadata: Metadata = {
  title: "پشتیبانی",
};

export default function TicketsPage() {
  return (
    <RequireAuth>
      <TicketsPageClient />
    </RequireAuth>
  );
}
