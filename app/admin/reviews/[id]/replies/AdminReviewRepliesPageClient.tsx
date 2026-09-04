"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { FormTextarea } from "@/components/form/textarea";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import {
  approveAdminReviewReply,
  createAdminReviewReply,
  deleteAdminReviewReply,
  fetchAdminReviewReplies,
} from "@/lib/admin-api";
import type { AdminReview, AdminReviewReply } from "@/lib/types";

type AdminReviewRepliesPageClientProps = {
  reviewId: number;
};

export default function AdminReviewRepliesPageClient({ reviewId }: AdminReviewRepliesPageClientProps) {
  const [review, setReview] = useState<AdminReview | null>(null);
  const [replies, setReplies] = useState<AdminReviewReply[]>([]);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  const loadReplies = useCallback(() => {
    fetchAdminReviewReplies(reviewId)
      .then((data) => {
        setReview(data.review);
        setReplies(data.replies);
      })
      .catch(() => showErrorToast("بارگذاری پاسخ‌ها با خطا مواجه شد."));
  }, [reviewId]);

  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  function handleCreateReply() {
    startTransition(async () => {
      try {
        await createAdminReviewReply(reviewId, comment);
        showSuccessToast("پاسخ ثبت شد.");
        setComment("");
        loadReplies();
      } catch {
        showErrorToast("ثبت پاسخ با خطا مواجه شد.");
      }
    });
  }

  function handleApprove(replyId: number) {
    startTransition(async () => {
      try {
        const msg = await approveAdminReviewReply(replyId);
        showSuccessToast(msg ?? "پاسخ تایید شد.");
        loadReplies();
      } catch {
        showErrorToast("تایید پاسخ با خطا مواجه شد.");
      }
    });
  }

  function handleDelete(replyId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا از حذف این پاسخ مطمئن هستید؟",
      });
      if (!confirmed) return;

      try {
        await deleteAdminReviewReply(replyId);
        showSuccessToast("پاسخ حذف شد.");
        loadReplies();
      } catch {
        showErrorToast("حذف پاسخ با خطا مواجه شد.");
      }
    });
  }

  return (
    <PageWrapper title="پاسخ های دیدگاه">
      {!review ? (
        <TableSkeleton
          columns={5}
          headers={["کاربر", "متن", "وضعیت", "تاریخ", "عملیات"]}
        />
      ) : (
        <>
      <div className="mb-6 rounded-[10px] bg-[#EFEFEF] p-5 dark:bg-[#4A4E7C]">
        <p className="font-bold">{review.user?.name}</p>
        <p className="mt-2">{review.comment}</p>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <FormTextarea
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="min-h-[100px]"
          placeholder="پاسخ جدید"
        />
        <Button
          variant="admin"
          disabled={pending || !comment.trim()}
          onClick={handleCreateReply}
          className="w-max disabled:opacity-50"
        >
          ثبت پاسخ
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow header>
            <TableHead>کاربر</TableHead>
            <TableHead>متن</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {replies.map((reply) => (
            <TableRow key={reply.id}>
              <TableCell>{reply.user?.name}</TableCell>
              <TableCell>{reply.comment}</TableCell>
              <TableCell>{reply.approved ? "منتشر شده" : "منتشر نشده"}</TableCell>
              <TableCell>{formatAdminDate(reply.created_at)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {!reply.approved ? (
                    <Button
                      variant="admin-success"
                      size="sm"
                      disabled={pending}
                      onClick={() => handleApprove(reply.id)}
                    >
                      تایید
                    </Button>
                  ) : null}
                  {reply.can_delete ? (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={pending}
                      onClick={() => handleDelete(reply.id)}
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
        </>
      )}
    </PageWrapper>
  );
}
