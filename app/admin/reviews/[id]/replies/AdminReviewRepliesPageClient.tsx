"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { FormTextarea } from "@/components/form/textarea";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import {
  approveAdminReviewReply,
  createAdminReviewReply,
  deleteAdminReviewReply,
  fetchAdminReviewReplies,
  updateAdminReviewReply,
} from "@/lib/admin-api";
import type { AdminReview, AdminReviewReply } from "@/lib/types";

type AdminReviewRepliesPageClientProps = {
  reviewId: number;
};

export default function AdminReviewRepliesPageClient({ reviewId }: AdminReviewRepliesPageClientProps) {
  const [review, setReview] = useState<AdminReview | null>(null);
  const [replies, setReplies] = useState<AdminReviewReply[]>([]);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState<AdminReviewReply | null>(null);
  const [editComment, setEditComment] = useState("");
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

  function openEdit(reply: AdminReviewReply) {
    setEditing(reply);
    setEditComment(reply.comment);
  }

  function handleUpdate() {
    if (!editing) return;
    startTransition(async () => {
      try {
        const msg = await updateAdminReviewReply(editing.id, editComment);
        showSuccessToast(msg ?? "پاسخ ویرایش شد و در انتظار تایید مجدد است.");
        setEditing(null);
        loadReplies();
      } catch {
        showErrorToast("ویرایش پاسخ با خطا مواجه شد.");
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
      {review ? (
        <div className="mb-6 rounded-[10px] bg-[#EFEFEF] p-5 dark:bg-[#4A4E7C]">
          <p className="font-bold">{review.user?.name}</p>
          <p className="mt-2">{review.comment}</p>
        </div>
      ) : null}

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
                  <Button variant="admin" size="sm" disabled={pending} onClick={() => openEdit(reply)}>
                    ویرایش
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={pending || reply.approved}
                    title={reply.approved ? "پاسخ تایید شده قابل حذف نیست" : undefined}
                    onClick={() => handleDelete(reply.id)}
                  >
                    حذف
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={editing !== null}
        title="ویرایش پاسخ"
        onClose={() => setEditing(null)}
        footer={
          <div className="flex gap-3">
            <Button
              variant="admin"
              onClick={handleUpdate}
              disabled={pending || editComment.trim().length < 3}
            >
              ذخیره
            </Button>
            <Button variant="danger" onClick={() => setEditing(null)}>
              بستن
            </Button>
          </div>
        }
      >
        <FormTextarea
          name="reply-comment"
          label="متن"
          value={editComment}
          onChange={(event) => setEditComment(event.target.value)}
          rows={4}
          wrapperClassName="min-w-[min(100%,32rem)]"
        />
      </Modal>
    </PageWrapper>
  );
}
