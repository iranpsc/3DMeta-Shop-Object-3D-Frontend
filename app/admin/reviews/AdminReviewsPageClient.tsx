"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { approveAdminReview, deleteAdminReview, fetchAdminReviews } from "@/lib/admin-api";
import type { AdminReview, Paginated } from "@/lib/types";

export default function AdminReviewsPageClient() {
  const [reviews, setReviews] = useState<Paginated<AdminReview> | null>(null);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const loadReviews = useCallback(() => {
    fetchAdminReviews(page)
      .then(setReviews)
      .catch(() => showErrorToast("بارگذاری دیدگاه‌ها با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  function handleApprove(reviewId: number) {
    startTransition(async () => {
      try {
        const msg = await approveAdminReview(reviewId);
        showSuccessToast(msg ?? "دیدگاه تایید شد.");
        loadReviews();
      } catch {
        showErrorToast("تایید دیدگاه با خطا مواجه شد.");
      }
    });
  }

  function handleDelete(reviewId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا می خواهید این دیدگاه را حذف کنید؟",
      });
      if (!confirmed) return;

      try {
        await deleteAdminReview(reviewId);
        showSuccessToast("دیدگاه حذف شد.");
        loadReviews();
      } catch {
        showErrorToast("حذف دیدگاه با خطا مواجه شد.");
      }
    });
  }

  const rows = reviews?.data ?? [];

  return (
    <PageWrapper title="دیدگاه های کاربران">
      {!reviews ? (
        <TableSkeleton
          columns={8}
          headers={["ردیف", "نام کاربر", "محصول", "متن", "امتیاز", "وضعیت", "پاسخ ها", "عملیات"]}
        />
      ) : (
        <>
      <Table>
        <TableHeader>
          <TableRow header>
            <TableHead>ردیف</TableHead>
            <TableHead>نام کاربر</TableHead>
            <TableHead>محصول</TableHead>
            <TableHead>متن</TableHead>
            <TableHead>امتیاز</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>پاسخ ها</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-6 text-center text-[#868B90]">
                دیدگاهی وجود ندارد.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((review, index) => (
              <TableRow key={review.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{review.user?.name}</TableCell>
                <TableCell>
                  {review.product ? (
                    <Link href={`/products/${review.product.sku}`} className="text-blue-500">
                      {review.product.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.approved ? "منتشر شده" : "منتشر نشده"}</TableCell>
                <TableCell>
                  <Link href={`/admin/reviews/${review.id}/replies`} className="text-blue-500">
                    مشاهده
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {!review.approved ? (
                      <Button
                        variant="admin-success"
                        size="sm"
                        disabled={pending}
                        onClick={() => handleApprove(review.id)}
                      >
                        تایید
                      </Button>
                    ) : null}
                    {review.can_delete ? (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={pending}
                        onClick={() => handleDelete(review.id)}
                      >
                        حذف
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {reviews ? (
        <Pagination currentPage={page} lastPage={reviews.meta.last_page} onPageChange={setPage} />
      ) : null}
        </>
      )}
    </PageWrapper>
  );
}
