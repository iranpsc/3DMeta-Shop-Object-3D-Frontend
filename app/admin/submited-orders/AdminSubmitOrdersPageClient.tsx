"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { Pagination } from "@/components/ui/pagination";
import { EmptyPage } from "@/components/ui/empty-page";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast } from "@/components/ui/toast";
import { fetchAdminSubmitOrders } from "@/lib/admin-api";
import type { AdminSubmitOrder, Paginated } from "@/lib/types";

export default function AdminSubmitOrdersPageClient() {
  const [orders, setOrders] = useState<Paginated<AdminSubmitOrder> | null>(null);
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(() => {
    fetchAdminSubmitOrders(page)
      .then(setOrders)
      .catch(() => showErrorToast("بارگذاری سفارشات با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const rows = orders?.data ?? [];

  return (
    <PageWrapper title="سفارشات ثبت شده">
      {rows.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>ایمیل</TableHead>
                <TableHead>موضوع</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.subject}</TableCell>
                  <TableCell>{formatAdminDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/submited-orders/${order.id}`}
                      className="rounded-[10px] px-2 py-1 text-white"
                      style={{ backgroundColor: "rgba(38, 38, 156, 0.808)" }}
                    >
                      مشاهده
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders ? (
            <Pagination currentPage={page} lastPage={orders.meta.last_page} onPageChange={setPage} />
          ) : null}
        </>
      ) : (
        <EmptyPage />
      )}
    </PageWrapper>
  );
}
