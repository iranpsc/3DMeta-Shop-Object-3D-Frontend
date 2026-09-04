"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { formControlClassName } from "@/components/form/form-control-classes";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TicketDetailSkeleton } from "@/components/ui/skeleton";
import { useToastState } from "@/lib/use-toast-message";
import { fetchTicket, respondToTicket } from "@/lib/user-api";
import { getApiBaseUrl } from "@/lib/api-client";
import { formatDate, formatDateTime } from "@/lib/formatters";
import type { TicketItem } from "@/lib/types";

function avatarSrc(avatar: string | null | undefined) {
  if (!avatar) return "/img/ellipse11.png";
  if (avatar.startsWith("http")) return avatar;
  return `${getApiBaseUrl()}/storage/${avatar}`;
}

function attachmentHref(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${getApiBaseUrl()}/storage/${path}`;
}

function priorityBadgeClass(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-600 ring-red-100 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/50";
    case "low":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/50";
    default:
      return "bg-[#FFF6E5] text-[#E59819] ring-[#F5E0B8] dark:bg-[#3A2A10] dark:text-[#E59819] dark:ring-[#5A4120]";
  }
}

function statusBadgeClass(status: string) {
  if (status === "closed" || status === "resolved") {
    return "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700";
  }
  return "bg-[#E8EEFF] text-[#000BEE] ring-[#C9D4FF] dark:bg-[#2A2418] dark:text-[#E59819] dark:ring-[#4A3A18]";
}

export default function ShowTicketPageClient({ ticketId }: { ticketId: number }) {
  const [ticket, setTicket] = useState<TicketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const { setMessage: setError } = useToastState("error");
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const responsesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchTicket(ticketId)
      .then(setTicket)
      .catch(() => {
        setTicket(null);
        setError("بارگذاری تیکت با خطا مواجه شد.");
      })
      .finally(() => setLoading(false));
  }, [ticketId, setError]);

  useEffect(() => {
    responsesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [ticket?.responses?.length]);

  function handleRespond(e: FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append("message", message);
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      form.append("attachment", file);
    }

    startTransition(async () => {
      try {
        const updated = await respondToTicket(ticketId, form);
        setTicket(updated);
        setMessage("");
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch {
        setError("ارسال پاسخ با خطا مواجه شد.");
      }
    });
  }

  if (loading) {
    return (
      <PageWrapper title="جزئیات تیکت">
        <TicketDetailSkeleton />
      </PageWrapper>
    );
  }

  if (!ticket) {
    return (
      <PageWrapper title="جزئیات تیکت">
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">تیکت یافت نشد.</p>
      </PageWrapper>
    );
  }

  const attachmentUrl = attachmentHref(ticket.attachment);

  return (
    <PageWrapper title="جزئیات تیکت">
      <div className="space-y-6">
        <Link
          href="/tickets"
          className="group inline-flex items-center gap-2 text-sm font-bold text-[#000BEE] transition hover:gap-3 dark:text-[#E59819]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/svg/arrow-left.svg"
            alt=""
            className="h-4 w-4 opacity-80 transition group-hover:opacity-100 dark:invert"
          />
          بازگشت
        </Link>

        <div className="grid gap-5 lg:grid-cols-12">
          <section className="overflow-hidden rounded-2xl border border-[#E8EEF8] bg-gradient-to-br from-white via-white to-[#F3F7FF] p-5 shadow-[0_8px_30px_rgba(0,11,238,0.04)] dark:border-[#2A2A28] dark:from-[#141412] dark:via-[#1A1A18] dark:to-[#1A1A18] dark:shadow-none sm:p-7 lg:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E8EEF8] pb-5 dark:border-[#2A2A28]">
              <h2
                className="font-rokh max-w-xl text-xl font-bold leading-relaxed text-[#171717] dark:text-white md:text-2xl"
              >
                {ticket.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityBadgeClass(ticket.priority)}`}
                >
                  اولویت: {ticket.priority_label}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusBadgeClass(ticket.status)}`}
                >
                  وضعیت: {ticket.status_label}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl bg-[#F7FAFF] p-4 dark:bg-[#111110]">
                <span className="mb-3 block text-xs text-[#8A94A6] dark:text-gray-400">
                  درخواست شده توسط
                </span>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc(ticket.user?.avatar)}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#2A2A28]"
                  />
                  <h6 className="text-sm font-bold dark:text-white">{ticket.user?.name}</h6>
                </div>
              </div>
              <div className="rounded-xl bg-[#F7FAFF] p-4 dark:bg-[#111110]">
                <span className="mb-3 block text-xs text-[#8A94A6] dark:text-gray-400">
                  تاریخ ایجاد
                </span>
                <h6 className="text-sm font-bold leading-6 dark:text-white">
                  {formatDate(ticket.created_at, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h6>
              </div>
              <div className="rounded-xl bg-[#F7FAFF] p-4 dark:bg-[#111110]">
                <span className="mb-3 block text-xs text-[#8A94A6] dark:text-gray-400">
                  تاریخ به‌روزرسانی
                </span>
                <h6 className="text-sm font-bold leading-6 dark:text-white">
                  {formatDate(ticket.updated_at ?? ticket.created_at, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h6>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-[#D5DFF5] bg-white/70 p-5 dark:border-[#333] dark:bg-[#111110]/70">
              <h4 className="mb-3 text-base font-bold text-[#171717] dark:text-white">متن پیام</h4>
              <p className="whitespace-pre-wrap text-[15px] font-normal leading-8 text-[#5B6577] dark:text-gray-300">
                {ticket.message}
              </p>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="h-full rounded-2xl border border-[#E8EEF8] bg-white p-5 shadow-[0_8px_30px_rgba(0,11,238,0.04)] dark:border-[#2A2A28] dark:bg-[#141412] dark:shadow-none sm:p-6">
              <h3 className="font-rokh mb-5 text-lg font-bold dark:text-white">
                فایل پیوست
              </h3>
              {ticket.attachment && attachmentUrl ? (
                <a
                  href={attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-[#E8EEF8] bg-[#F7FAFF] p-4 transition hover:border-[#000BEE]/30 hover:bg-[#EEF3FF] dark:border-[#2A2A28] dark:bg-[#111110] dark:hover:border-[#E59819]/40 dark:hover:bg-[#1F1A12]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#000BEE]/10 text-[#000BEE] dark:bg-[#E59819]/15 dark:text-[#E59819]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-6 w-6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h6 className="truncate text-sm font-bold text-[#3A4254] group-hover:text-[#000BEE] dark:text-gray-200 dark:group-hover:text-[#E59819]">
                      {ticket.attachment_name ?? "فایل پیوست"}
                    </h6>
                    <span className="mt-1 block text-xs text-[#8A94A6]">دانلود / مشاهده</span>
                  </div>
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-[#F5E0B8] bg-[#FFF9EF] px-4 py-8 text-center dark:border-[#5A4120] dark:bg-[#2A2110]">
                  <p className="text-sm font-bold text-[#E59819]">فایلی پیوست نشده است</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#E8EEF8] bg-white shadow-[0_8px_30px_rgba(0,11,238,0.04)] dark:border-[#2A2A28] dark:bg-[#141412] dark:shadow-none">
          <div className="flex items-center justify-between border-b border-[#E8EEF8] px-5 py-4 dark:border-[#2A2A28] sm:px-7">
            <h3 className="font-rokh text-lg font-bold dark:text-white">
              پاسخ‌ها
            </h3>
            <span className="rounded-full bg-[#E8EEFF] px-3 py-1 text-xs font-bold text-[#000BEE] dark:bg-[#2A2418] dark:text-[#E59819]">
              {ticket.responses?.length ?? 0} پاسخ
            </span>
          </div>

          <div className="max-h-[360px] space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
            {ticket.responses && ticket.responses.length > 0 ? (
              ticket.responses.map((response) => (
                <article
                  key={response.id}
                  className="flex gap-3 rounded-2xl bg-[#F7FAFF] p-4 dark:bg-[#111110]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc(response.user?.avatar)}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-[#2A2A28]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <h6 className="text-sm font-bold dark:text-white">{response.user?.name}</h6>
                      <time className="text-xs text-[#8A94A6] dark:text-gray-500">
                        {formatDateTime(response.created_at)}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-[15px] font-normal leading-7 text-[#5B6577] dark:text-gray-300">
                      {response.message}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E8EEF8] py-12 text-center dark:border-[#2A2A28]">
                <p className="text-sm text-[#8A94A6] dark:text-gray-400">پاسخی یافت نشد.</p>
              </div>
            )}
            <div ref={responsesEndRef} />
          </div>

          <form
            onSubmit={handleRespond}
            className="border-t border-[#E8EEF8] bg-[#F7FAFF]/80 px-4 py-4 dark:border-[#2A2A28] dark:bg-[#111110]/80 sm:px-6"
          >
            {fileName ? (
              <div className="mb-3 flex items-center gap-2 text-xs text-[#5B6577] dark:text-gray-400">
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E8EEF8] dark:bg-[#1A1A18] dark:ring-[#2A2A28]">
                  📎 {fileName}
                </span>
                <button
                  type="button"
                  className="text-red-500 hover:underline"
                  onClick={() => {
                    setFileName(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  حذف
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_4px_20px_rgba(0,11,238,0.06)] ring-1 ring-[#E8EEF8] transition focus-within:ring-2 focus-within:ring-[#000BEE]/25 dark:bg-[#1A1A18] dark:ring-[#2A2A28] dark:focus-within:ring-[#E59819]/40 sm:gap-3 sm:px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/svg/smile.svg" alt="" className="hidden h-5 w-5 opacity-50 sm:block dark:invert" />
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${formControlClassName} box-shadow-none flex-1 border-0 bg-transparent px-1 py-2 text-sm shadow-none focus:ring-0`}
                type="text"
                placeholder="پیام خود را تایپ کنید..."
                aria-label="پیام پاسخ"
                required
                maxLength={500}
              />
              <input
                ref={fileInputRef}
                type="file"
                name="attachment"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              <Button
                type="button"
                variant="unstyled"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0F3F8] text-[#6B7280] transition hover:bg-[#E4E9F2] dark:bg-[#252522] dark:text-gray-300 dark:hover:bg-[#30302C]"
                onClick={() => fileInputRef.current?.click()}
                aria-label="افزودن پیوست"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/svg/paperclip.svg" alt="" className="h-5 w-5 dark:invert" />
              </Button>
              <Button
                type="submit"
                variant="unstyled"
                disabled={pending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#000BEE] text-white transition hover:brightness-110 active:scale-95 disabled:opacity-60 dark:bg-[#E59819] dark:text-black"
                aria-label="ارسال پاسخ"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/svg/send.svg"
                  alt=""
                  className="h-5 w-5 brightness-0 invert dark:invert-0"
                />
              </Button>
            </div>
          </form>
        </section>
      </div>
    </PageWrapper>
  );
}
