"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { EmptyPage } from "@/components/ui/empty-page";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast } from "@/components/ui/toast";
import { repayOrder } from "@/lib/checkout-api";
import { fetchOrders } from "@/lib/user-api";
import type { OrderSummary, Paginated } from "@/lib/types";

export default function OrdersPageClient() {
  const [orders, setOrders] = useState<Paginated<OrderSummary> | null>(null);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const loadOrders = useCallback((nextPage: number) => {
    fetchOrders(nextPage)
      .then(setOrders)
      .catch(() => showErrorToast("بارگذاری سفارشات با خطا مواجه شد."));
  }, []);

  useEffect(() => {
    loadOrders(page);
  }, [loadOrders, page]);

  function handlePay(orderId: string) {
    startTransition(async () => {
      try {
        const { redirect_url } = await repayOrder(orderId);
        window.location.href = redirect_url;
      } catch {
        showErrorToast("پرداخت با مشکل مواجه شد. لطفا مجددا تلاش کنید.");
      }
    });
  }

  const rows = orders?.data ?? [];

  return (
    <PageWrapper title="خریدها">
      <style>{`
        table { width: 100%; }
        table, th, td { border: 1px solid gray; padding: 10px; }
      `}</style>

      <div className="flex flex-col items-center justify-center overflow-x-hidden">
        <div className="w-full">
          {rows.length === 0 && orders ? (
            <EmptyPage />
          ) : orders ? (
            <>
              <Table variant="order">
                <TableHeader>
                  <TableRow header>
                    <TableHead>ردیف</TableHead>
                    <TableHead>
                      <span className="userDatatable-title">شناسه سفارش</span>
                    </TableHead>
                    <TableHead>
                      <span className="userDatatable-title">نام محصول</span>
                    </TableHead>
                    <TableHead>
                      <span className="userDatatable-title">مبلغ پرداختی</span>
                    </TableHead>
                    <TableHead>
                      <span className="userDatatable-title">وضعیت</span>
                    </TableHead>
                    <TableHead>
                      <span className="userDatatable-title">عملیات</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((order, index) => (
                    <TableRow key={order.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="orderDatatable-title">{order.tracking_id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="orderDatatable-title">
                          {order.product_names?.join(", ")}
                          {order.product_skus?.length ? (
                            <>
                              <br />
                              {order.product_skus.join(", ")}
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="orderDatatable-title">{order.total_price ?? order.amount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="orderDatatable-title">{order.status_label}</div>
                      </TableCell>
                      <TableCell>
                        {order.is_paid ? (
                          <Button
                            variant="neutral"
                            href={`/orders/${order.id}`}
                            className="block w-full rounded-lg px-2 py-3 text-center bg-[rgb(122,122,122)]"
                          >
                            جزئیات
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            disabled={pending}
                            className="rounded-lg"
                            onClick={() => handlePay(order.id)}
                          >
                            پرداخت
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                currentPage={page}
                lastPage={orders.meta.last_page}
                onPageChange={setPage}
                className="border-t pt-25"
              />
            </>
          ) : (
            <TableSkeleton
              columns={6}
              headers={["ردیف", "شناسه سفارش", "نام محصول", "مبلغ پرداختی", "وضعیت", "عملیات"]}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
