import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import EditTicketPageClient from "./EditTicketPageClient";

export const metadata: Metadata = {
  title: "پشتیبانی | بروزرسانی تیکت",
};

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
