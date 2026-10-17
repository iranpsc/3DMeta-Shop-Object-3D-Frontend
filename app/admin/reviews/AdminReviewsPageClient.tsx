"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FormTextarea } from "@/components/form/textarea";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { approveAdminReview, deleteAdminReview, fetchAdminReviews, updateAdminReview } from "@/lib/admin-api";
import type { AdminReview, Paginated } from "@/lib/types";

export default function AdminReviewsPageClient() {
  const [reviews, setReviews] = useState<Paginated<AdminReview> | null>(null);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

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

  function openEdit(review: AdminReview) {
    setEditing(review);
    setComment(review.comment);
    setRating(review.rating);
  }

  function handleUpdate() {
    if (!editing) return;
    startTransition(async () => {
      try {
        const msg = await updateAdminReview(editing.id, { comment, rating });
        showSuccessToast(msg ?? "دیدگاه ویرایش شد و در انتظار تایید مجدد است.");
        setEditing(null);
        loadReviews();
      } catch {
        showErrorToast("ویرایش دیدگاه با خطا مواجه شد.");
      }
    });
  }

  const rows = reviews?.data ?? [];

  return (
    <PageWrapper title="دیدگاه های کاربران">
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
                    <Button
                      variant="admin"
                      size="sm"
                      disabled={pending}
                      onClick={() => openEdit(review)}
                    >
                      ویرایش
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={pending || review.approved}
                      title={review.approved ? "دیدگاه تایید شده قابل حذف نیست" : undefined}
                      onClick={() => handleDelete(review.id)}
                    >
                      حذف
                    </Button>
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

      <Modal
        open={editing !== null}
        title="ویرایش دیدگاه"
        onClose={() => setEditing(null)}
        footer={
          <div className="flex gap-3">
            <Button variant="admin" onClick={handleUpdate} disabled={pending || comment.trim().length < 3}>
              ذخیره
            </Button>
            <Button variant="danger" onClick={() => setEditing(null)}>
              بستن
            </Button>
          </div>
        }
      >
        <div className="flex min-w-[min(100%,32rem)] flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            امتیاز
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="rounded-[10px] border border-[#EFEFEF] bg-white p-2 dark:border-gray-700 dark:bg-black"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <FormTextarea
            name="review-comment"
            label="متن"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </PageWrapper>
  );
}
