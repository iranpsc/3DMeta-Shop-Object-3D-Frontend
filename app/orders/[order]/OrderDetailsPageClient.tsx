"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchOrder } from "@/lib/user-api";
import type { OrderDetail } from "@/lib/types";

function formatJalaliDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fa-IR");
  } catch {
    return iso;
  }
}

export default function OrderDetailsPageClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder(orderId)
      .then(setOrder)
      .catch(() => setError("بارگذاری جزئیات سفارش با خطا مواجه شد."));
  }, [orderId]);

  if (error) {
    return (
      <PageWrapper title="جزئیات سفارش">
        <p className="text-center text-red-600">{error}</p>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper title="جزئیات سفارش">
        <p className="text-center">در حال بارگذاری...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="جزئیات سفارش">
      <style>{`
        table { width: 100%; }
        table, th, td { border: 1px solid gray; padding: 10px; text-align: center; }
      `}</style>

      <div className="flex flex-col gap-5">
        <Table variant="order">
          <TableHeader>
            <TableRow header>
              <TableHead>
                <span className="userDatatable-title">شناسه سفارش</span>
              </TableHead>
              <TableHead>
                <span className="userDatatable-title">مبلغ پرداختی</span>
              </TableHead>
              <TableHead>
                <span className="userDatatable-title">وضعیت</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="orderDatatable-title">{order.tracking_id}</div>
              </TableCell>
              <TableCell>
                <div className="orderDatatable-title">{order.amount}</div>
              </TableCell>
              <TableCell>
                <div className="orderDatatable-title">{order.status_label}</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-7">
          <Table variant="order">
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>
                  <span className="userDatatable-title">نام محصول</span>
                </TableHead>
                <TableHead>
                  <span className="userDatatable-title">تعداد</span>
                </TableHead>
                <TableHead>
                  <span className="userDatatable-title">تعداد دانلود</span>
                </TableHead>
                <TableHead>
                  <span className="userDatatable-title">آخرین دانلود</span>
                </TableHead>
                <TableHead>
                  <span className="userDatatable-title">عملیات</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="orderDatatable-title">{product.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="orderDatatable-title">{product.quantity}</div>
                  </TableCell>
                  <TableCell>
                    <div className="orderDatatable-title">{product.download_count}</div>
                  </TableCell>
                  <TableCell>
                    <div className="orderDatatable-title">{formatJalaliDate(product.downloaded_at)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="orderDatatable-title flex flex-col gap-2">
                      {product.files.map((file) => (
                        <a
                          key={file.id}
                          href={file.url}
                          className="text-[#000BEE] dark:text-[#E59819]"
                        >
                          دانلود {file.name}
                        </a>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageWrapper>
  );
}
