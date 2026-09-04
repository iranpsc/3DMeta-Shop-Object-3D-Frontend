"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { DetailListSkeleton } from "@/components/ui/skeleton";
import { fetchAdminSubmitOrder } from "@/lib/admin-api";
import type { AdminSubmitOrder } from "@/lib/types";

type AdminSubmitOrderShowPageClientProps = {
  orderId: number;
};

export default function AdminSubmitOrderShowPageClient({ orderId }: AdminSubmitOrderShowPageClientProps) {
  const [order, setOrder] = useState<AdminSubmitOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminSubmitOrder(orderId)
      .then(setOrder)
      .catch(() => setError("بارگذاری سفارش با خطا مواجه شد."));
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
        <DetailListSkeleton rows={7} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="جزئیات سفارش">
      <div className="max-w-2xl rounded-[10px] bg-[#EFEFEF] p-5 dark:bg-[#9A9ECC] dark:text-[#2C2F32]">
        <h4 className="mb-6 font-bold">اطلاعات مشتری</h4>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p>نام :</p>
            <p>{order.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>ایمیل :</p>
            <p>{order.email}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>شماره تلفن :</p>
            <p>{order.phone}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>موضوع :</p>
            <p>{order.subject}</p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:justify-between">
            <p>پیام :</p>
            <p className="whitespace-pre-wrap md:w-[80%]">{order.message}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>تاریخ ایجاد :</p>
            <p>{formatAdminDate(order.created_at)}</p>
          </div>
          {order.attachment_url ? (
            <div className="flex items-center justify-between">
              <p>فایل ضمیمه :</p>
              <a
                href={order.attachment_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-[8px] px-2 py-1 text-white"
                style={{ backgroundColor: "rgba(38, 38, 156, 0.808)" }}
              >
                مشاهده
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <Link href="/admin/submited-orders" className="mt-6 inline-block text-blue-600">
        بازگشت به لیست
      </Link>
    </PageWrapper>
  );
}
