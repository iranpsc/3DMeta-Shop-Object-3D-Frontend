"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchDashboard } from "@/lib/user-api";
import { formatPrice } from "@/lib/formatters";
import type { DashboardSummary } from "@/lib/types";

export default function DashboardPageClient() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setError("بارگذاری داشبورد با خطا مواجه شد."));
  }, []);

  if (error) {
    return (
      <PageWrapper title="داشبورد">
        <p className="text-center text-red-600">{error}</p>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper title="داشبورد">
        <p className="text-center">در حال بارگذاری...</p>
      </PageWrapper>
    );
  }

  const { stats, recent_orders: recentOrders } = data;

  return (
    <PageWrapper title="داشبورد">
      <div className="demo5 mb-25 mt-30">
        <div className="mb-25 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "کل سفارشات", value: stats.orders_total, color: "from-[#0A3FFF] to-[#3F90FC]", icon: "🛒" },
            { label: "پرداخت شده", value: stats.orders_paid, color: "from-[#0CCE6B] to-[#1FC988]", icon: "✅" },
            { label: "پرداخت نشده", value: stats.orders_unpaid, color: "from-[#FF6C22] to-[#FFC93C]", icon: "⏳" },
            { label: "محصولات من", value: stats.products_owned, color: "from-[#5F2EEA] to-[#B8A1F7]", icon: "📦" },
            { label: "تیکت باز", value: stats.tickets_open, color: "from-[#FF2657] to-[#FFA5B6]", icon: "🎫" },
          ].map((item) => (
            <div
              key={item.label}
              className={`
                relative flex flex-col items-center justify-between overflow-hidden rounded-[16px] bg-gradient-to-br ${item.color}
                p-6 shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl dark:bg-gradient-to-br dark:from-[#232526] dark:to-[#414345]
              `}
              style={{
                minHeight: 140,
              }}
            >
              <div className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center text-3xl opacity-30 pointer-events-none select-none">
                {item.icon}
              </div>
              <span className="z-10 mt-4 text-sm font-medium tracking-wider text-white/70 dark:text-[#E59819]">{item.label}</span>
              <span className="z-10 mt-4 mb-2 text-4xl font-extrabold tracking-tight text-white drop-shadow dark:text-[#E59819]">
                {item.value.toLocaleString("fa-IR")}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10 rounded-b-[16px]"></div>
            </div>
          ))}
        </div>
   

        <div className="card border-0 px-6 pb-6">
          <div className="card-header border-0 px-0">
            <h6>سفارشات اخیر</h6>
          </div>
          {recentOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow header className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead>شناسه سفارش</TableHead>
                  <TableHead>محصولات</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <TableCell>{order.tracking_id}</TableCell>
                    <TableCell>{order.product_names?.join("، ") ?? "—"}</TableCell>
                    <TableCell>{formatPrice(order.amount)}</TableCell>
                    <TableCell>{order.status_label}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-6 text-center text-[#868B90]">سفارشی ثبت نشده است.</p>
          )}
          <div className="mt-6 text-center">
            <Link href="/orders" className="text-[#000BEE] dark:text-[#E59819]">
              مشاهده همه سفارشات
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
