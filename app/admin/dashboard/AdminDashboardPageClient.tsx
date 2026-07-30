"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/components/admin/admin-utils";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { fetchAdminDashboard } from "@/lib/admin-api";
import type { AdminDashboardStats } from "@/lib/types";

export default function AdminDashboardPageClient() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then(setStats)
      .catch(() => setError("بارگذاری داشبورد با خطا مواجه شد."));
  }, []);

  if (error) {
    return (
      <PageWrapper title="داشبورد مدیریت">
        <p className="text-center text-red-600">{error}</p>
      </PageWrapper>
    );
  }

  if (!stats) {
    return (
      <PageWrapper title="داشبورد مدیریت">
        <p className="text-center">در حال بارگذاری...</p>
      </PageWrapper>
    );
  }

  const cards = [
    { label: "کل محصولات", value: stats.products_count, icon: "uil-briefcase-alt", color: "color-primary" },
    { label: "کل سفارشات", value: stats.orders_total, icon: "uil-shopping-cart-alt", color: "color-info" },
    { label: "فروش کل", value: formatPrice(stats.total_sales), icon: "uil-usd-circle", color: "color-secondary" },
    { label: "مشتریان", value: stats.users_count, icon: "uil-users-alt", color: "color-warning" },
  ];

  return (
    <PageWrapper title="داشبورد مدیریت">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="ap-po-details ap-po-details--2 radius-xl flex justify-between p-6"
          >
            <div className="overview-content w-full">
              <div className="ap-po-details-content flex flex-wrap justify-between">
                <div className="ap-po-details__titlebar">
                  <h1 className="text-3xl font-bold">{card.value}</h1>
                  <p>{card.label}</p>
                </div>
                <div className="ap-po-details__icon-area">
                  <div className={`svg-icon order-bg-opacity-primary ${card.color}`}>
                    <i className={`uil ${card.icon}`} />
                  </div>
                </div>
              </div>
              <div className="ap-po-details-time mt-3 text-sm text-gray-500">
                <span>پرداخت شده: {stats.orders_paid.toLocaleString("fa-IR")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
