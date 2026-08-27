import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import EditTicketPageClient from "./EditTicketPageClient";

export const metadata: Metadata = privatePageMetadata("ایجاد پیام");

type Props = {
  params: Promise<{ ticket: string }>;
};

export default async function EditTicketPage({ params }: Props) {
  const { ticket } = await params;
  return (
    <RequireAuth>
      <EditTicketPageClient ticketId={Number(ticket)} />
    </RequireAuth>
  );
}
