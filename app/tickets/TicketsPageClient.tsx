"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { EmptyPage } from "@/components/ui/empty-page";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast } from "@/components/ui/toast";
import { deleteTicket, fetchTickets } from "@/lib/user-api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/formatters";
import type { Paginated, TicketItem } from "@/lib/types";

export default function TicketsPageClient() {
  const [tickets, setTickets] = useState<Paginated<TicketItem> | null>(null);
  const { user } = useAuth();
  const userRole = user?.role ?? null;
  const userId = user?.id ?? null;
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const loadTickets = useCallback(() => {
    fetchTickets(page)
      .then(setTickets)
      .catch(() => showErrorToast("بارگذاری پیام‌ها با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  function handleDelete(ticketId: number) {
    if (!window.confirm("آیا از حذف این پیام مطمئن هستید؟")) return;

    startTransition(async () => {
      try {
        await deleteTicket(ticketId);
        loadTickets();
      } catch {
        showErrorToast("حذف تیکت با خطا مواجه شد.");
      }
    });
  }

  const rows = tickets?.data ?? [];

  return (
    <PageWrapper
      title="پیام ها"
      actionBtn
      actionBtnLink="/tickets/create"
      actionBtnText="ایجاد پیام جدید"
    >
      {rows.length > 0 ? (
        <div>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>فرستنده</TableHead>
                <TableHead>موضوع</TableHead>
                <TableHead>اولویت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ ارسال</TableHead>
                <TableHead>جزئیات</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((ticket, index) => (
                <TableRow key={ticket.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{ticket.user?.name}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.response_status_label}</TableCell>
                  <TableCell>
                      {formatDate(ticket.created_at)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket.id}`} className="text-[#000BEE] dark:text-[#E59819]">
                      مشاهده
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {ticket.user?.id === userId ? (
                        <Button
                          variant="admin"
                          size="xs"
                          href={`/tickets/${ticket.id}/edit`}
                          className="rounded bg-blue-500"
                        >
                          ویرایش
                        </Button>
                      ) : null}
                      {userRole === "admin" ? (
                        <Button
                          variant="danger"
                          size="xs"
                          disabled={pending}
                          className="rounded"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          حذف
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={page}
            lastPage={tickets?.meta.last_page ?? 1}
            onPageChange={setPage}
          />
        </div>
      ) : tickets ? (
        <EmptyPage />
      ) : (
        <p className="text-center">در حال بارگذاری...</p>
      )}
    </PageWrapper>
  );
}
