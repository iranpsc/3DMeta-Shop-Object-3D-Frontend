import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ShowTicketPageClient from "./ShowTicketPageClient";

export const metadata: Metadata = {
  title: "جزئیات تیکت",
};

type Props = {
  params: Promise<{ ticket: string }>;
};

export default async function ShowTicketPage({ params }: Props) {
  const { ticket } = await params;
  return (
    <RequireAuth>
      <ShowTicketPageClient ticketId={Number(ticket)} />
    </RequireAuth>
  );
}
