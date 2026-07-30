"use client";

import { useCallback, useEffect, useState } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { EmptyPage } from "@/components/ui/empty-page";
import { Modal } from "@/components/ui/modal";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast } from "@/components/ui/toast";
import { fetchAdminContactMessages } from "@/lib/admin-api";
import type { AdminContactMessage, Paginated } from "@/lib/types";

export default function AdminContactMessagesPageClient() {
  const [messages, setMessages] = useState<Paginated<AdminContactMessage> | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminContactMessage | null>(null);

  const loadMessages = useCallback(() => {
    fetchAdminContactMessages(page)
      .then(setMessages)
      .catch(() => showErrorToast("بارگذاری پیام‌ها با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const rows = messages?.data ?? [];

  return (
    <PageWrapper title="پیام های دریافتی">
      {rows.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>ایمیل</TableHead>
                <TableHead>شماره تلفن</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((message, index) => (
                <TableRow key={message.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{message.name}</TableCell>
                  <TableCell className="text-center">{message.email}</TableCell>
                  <TableCell className="text-center">{message.phone}</TableCell>
                  <TableCell className="text-center">{formatAdminDate(message.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="admin"
                      size="sm"
                      onClick={() => setSelected(message)}
                      className="rounded-[8px] bg-[rgba(38,38,156,0.808)]"
                    >
                      مشاهده پیام
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {messages ? (
            <Pagination currentPage={page} lastPage={messages.meta.last_page} onPageChange={setPage} />
          ) : null}
        </>
      ) : (
        <EmptyPage />
      )}

      <Modal open={Boolean(selected)} title="مشاهده پیام" onClose={() => setSelected(null)}>
        <div className="text-center">
          <p className="whitespace-pre-wrap">{selected?.message}</p>
        </div>
      </Modal>
    </PageWrapper>
  );
}
