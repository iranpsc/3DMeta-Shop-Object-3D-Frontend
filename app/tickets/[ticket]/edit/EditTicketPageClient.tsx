"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormTextInput } from "@/components/form/text-input";
import { FormTextarea } from "@/components/form/textarea";
import { formControlClassName } from "@/components/form/form-control-classes";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { fetchTicket, updateTicket } from "@/lib/user-api";

export default function EditTicketPageClient({ ticketId }: { ticketId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchTicket(ticketId)
      .then((ticket) => {
        setTitle(ticket.title);
        setMessage(ticket.message);
        setPriority(ticket.priority);
      })
      .catch(() => showErrorToast("بارگذاری تیکت با خطا مواجه شد."));
  }, [ticketId]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set("title", title);
    form.set("message", message);
    form.set("priority", priority);

    startTransition(async () => {
      try {
        const result = await updateTicket(ticketId, form);
        showSuccessToast(result.message ?? "تیکت شما با موفقیت بروزرسانی شد.");
        router.push("/tickets");
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "بروزرسانی تیکت با خطا مواجه شد.";
        showErrorToast(msg);
      }
    });
  }

  return (
    <PageWrapper title="ایجاد پیام">
      <div className="row my-5 justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormTextInput
                  name="title"
                  label="موضوع"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="موضوع پیام را وارد کنید"
                />
                <label className="flex flex-col gap-3">
                  <span className="form-col-label col-sm-4 font-bold">اولویت</span>
                  <select
                    name="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={formControlClassName}
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                  </select>
                </label>
                <label className="flex flex-col gap-3">
                  <span className="form-col-label col-sm-4 font-bold">فایل ضمیمه</span>
                  <input name="attachment" type="file" className={formControlClassName} />
                </label>
                <FormTextarea
                  name="message"
                  label="متن پیام"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  cols={5}
                  placeholder="متن پیام را وارد کنید"
                />
                <Button type="submit" variant="primary" disabled={pending}>
                  {pending ? "در حال ارسال..." : "ارسال"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
