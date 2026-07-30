"use client";

import { useState, useTransition } from "react";
import { FormTextarea } from "@/components/form/textarea";
import { Button } from "@/components/ui/button";
import { useToastMessage } from "@/lib/use-toast-message";
import { submitReview, submitReviewReply } from "@/lib/storefront-client-api";
import { ApiError } from "@/lib/api-client";
import { loginRedirect } from "@/lib/auth";
import type { ReviewItem } from "@/lib/types";

type Props = {
  sku: string;
  initialReviews: ReviewItem[];
  ratingBreakdown: Record<string, number>;
  usersCount: number;
  ratingAvg?: number | null;
  canReviewHint: boolean;
};

const STAR_PATH =
  "M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z";

function Stars({ filled }: { filled: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`ms-1 h-5 w-5 ${i < filled ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"}`}
          aria-hidden
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div
      dir="rtl"
      role="group"
      aria-label="امتیاز محصول"
      className="stars-rating flex cursor-pointer items-center gap-3"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1} از 5`}
          aria-pressed={i < value}
          className={`star-icon las la-star border-0 bg-transparent p-0 ${i < value ? "active" : ""}`}
          onClick={() => onChange(i + 1)}
        />
      ))}
    </div>
  );
}

function RatingBar({
  stars,
  count,
  usersCount,
}: {
  stars: number;
  count: number;
  usersCount: number;
}) {
  const pct = usersCount > 0 ? (count / usersCount) * 100 : 0;
  return (
    <dl className="w-full">
      <dd className="flex w-full items-center gap-4">
        <div className="me-2 h-2.5 w-[50%] rounded bg-gray-200 md:w-[60%] 2xl:w-[65%] 3xl:w-[70%] dark:bg-gray-700">
          <div
            className="h-2.5 rounded bg-blue-600 dark:bg-[#E59819]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex w-[50%] items-center gap-4 md:w-[40%] 2xl:w-[35%] 3xl:w-[30%]">
          <Stars filled={stars} />
        </div>
      </dd>
    </dl>
  );
}

/** Storefront reviews panel (parity with Livewire Reviews). */
export function Reviews({
  sku,
  initialReviews,
  ratingBreakdown,
  usersCount,
  ratingAvg,
  canReviewHint,
}: Props) {
  const [reviews] = useState(initialReviews);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmitReview() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitReview(sku, { comment, rating });
        setMessage(
          res.message ??
          "نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.",
        );
        setComment("");
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          loginRedirect();
          return;
        }
        setError(e instanceof ApiError ? e.message : "خطا در ثبت نظر");
      }
    });
  }

  function onSubmitReply(reviewId: number) {
    const text = replyText[reviewId]?.trim() ?? "";
    if (!text) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitReviewReply(reviewId, text);
        setMessage(
          res.message ??
          "پاسخ شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.",
        );
        setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          loginRedirect();
          return;
        }
        setError(e instanceof ApiError ? e.message : "خطا در ثبت پاسخ");
      }
    });
  }

  useToastMessage(message, "success");
  useToastMessage(error, "error");

  return (
    <div className="w-full space-y-10 lg:w-[60%]">
      <div className="my-5 flex w-full flex-col-reverse items-center justify-center gap-5 md:flex-row">
        <div className="flex w-full flex-col items-center justify-center gap-5 rounded-[10px] bg-white p-8 md:w-[70%] dark:bg-[#1A1A18]">
          <RatingBar stars={5} count={ratingBreakdown.five ?? 0} usersCount={usersCount} />
          <RatingBar stars={4} count={ratingBreakdown.four ?? 0} usersCount={usersCount} />
          <RatingBar stars={3} count={ratingBreakdown.three ?? 0} usersCount={usersCount} />
          <RatingBar stars={2} count={ratingBreakdown.two ?? 0} usersCount={usersCount} />
          <RatingBar stars={1} count={ratingBreakdown.one ?? 0} usersCount={usersCount} />
        </div>
        <div className="flex w-full flex-row-reverse items-center justify-between gap-5 rounded-[10px] bg-white p-5 md:min-h-[264px] md:w-[30%] md:flex-col md:p-[34px] lg:gap-10 dark:bg-[#1A1A18]">
          <div className="flex flex-col items-center justify-center gap-5 lg:gap-10">
            <p className="text-2xl font-bold text-[#4F547B] md:text-5xl dark:text-gray-300">
              {Math.floor(ratingAvg ?? 0)}
            </p>
            <Stars filled={Math.floor(ratingAvg ?? 0)} />
          </div>
          <p className="text-[#4F547B] dark:text-gray-300">رتبه بندی محصول</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="my-5 text-center text-gray-500">نظری ثبت نشده است.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="mt-10 w-full">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#164C96] text-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    review.user?.avatar
                      ? `/storage/${review.user.avatar}`
                      : "/home-page/images/default.jpg"
                  }
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-[#1D2939] dark:text-gray-200">
                  <p className="font-bold">{review.user?.name ?? "کاربر"}</p>
                </div>
                <div className="product-details__availability my-2">
                  <div className="stars-rating flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`star-icon las la-star ${i < review.rating ? "active" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-5 text-sm text-[#1d29399d] dark:text-gray-200">
              <p>{review.comment}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <FormTextarea
                  name={`reply-${review.id}`}
                  rows={1}
                  placeholder="پاسخ خود را بنویسید"
                  value={replyText[review.id] ?? ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [review.id]: e.target.value,
                    }))
                  }
                  wrapperClassName="w-full gap-0"
                  className="rounded-xl border border-[#ECEEF3] bg-[#FBFDFF] px-5 py-3 placeholder:text-[#A8ABB4] focus:ring-0 dark:border-transparent dark:bg-[#1A1A18] dark:text-[#A8ABB4]"
                />
                <div className="flex items-center justify-end gap-4">
                  <Button
                    variant="unstyled"
                    disabled={isPending}
                    className="text-xs text-red-600"
                    onClick={() => onSubmitReply(review.id)}
                  >
                    Replay
                  </Button>
                </div>
              </div>
              {review.replies?.map((reply) => (
                <div
                  key={reply.id}
                  className="mr-6 mt-3 rounded bg-gray-50 p-3 text-sm dark:bg-[#271A04]"
                >
                  <div className="font-bold">{reply.user?.name}</div>
                  <p>{reply.comment}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {canReviewHint ? (
        <div className="flex flex-col gap-7 text-[#1D2939] dark:text-gray-200">
          <div className="text-xl font-bold">یک نظر بنویسید</div>
          <div className="flex flex-col gap-3">
            <p>محصول چگونه است؟</p>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
          <FormTextarea
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="نظر شما در باره این محصول چیست؟"
            rows={4}
          />
          <Button
            variant="primary"
            disabled={isPending}
            onClick={onSubmitReview}
            className="w-max rounded-lg"
          >
            ارسال بررسی
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          برای ارسال نظر باید وارد حساب کاربری خود شوید.
        </p>
      )}
    </div>
  );
}
