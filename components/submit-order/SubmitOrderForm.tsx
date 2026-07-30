"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormFileInput } from "@/components/form/file-input";
import { FormTextInput } from "@/components/form/text-input";
import { FormTextarea } from "@/components/form/textarea";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { submitSubmitOrder } from "@/lib/storefront-client-api";

const errorStyle = { backgroundColor: "rgba(207, 117, 117, 0.47)" };

export function SubmitOrderForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
    }));
  }, [user]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({});

    startTransition(async () => {
      try {
        const payload = new FormData();
        if (!user) {
          payload.set("name", form.name);
          payload.set("email", form.email);
          payload.set("phone", form.phone);
        }
        payload.set("subject", form.subject);
        payload.set("message", form.message);
        if (attachment) {
          payload.set("attachment", attachment);
        }

        const res = await submitSubmitOrder(payload);
        setSuccessMessage(res.message ?? "سفارش شما با موفقیت ثبت شد.");
        setForm((prev) => ({
          name: user?.name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
          subject: "",
          message: "",
        }));
        setAttachment(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        if (err instanceof ApiError) {
          const body = err.body as {
            errors?: Record<string, string[]>;
            message?: string;
          };
          if (body?.errors) {
            setErrors(body.errors);
          } else {
            setErrors({ form: [err.message] });
          }
        } else {
          setErrors({ form: ["خطا در ثبت سفارش"] });
        }
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {successMessage ? (
        <div className="rounded-lg bg-green-500 p-3 text-center text-white">
          {successMessage}
        </div>
      ) : null}
      {errors.form ? (
        <span
          className="mt-2 block rounded-[10px] px-3.5 py-3.5 text-red-600"
          style={errorStyle}
        >
          {errors.form[0]}
        </span>
      ) : null}

      <div className="grid w-full gap-4 md:gap-7 lg:grid-cols-2">
        <FormTextInput
          name="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder=" نام و نام خانوادگی"
          error={errors.name}
        />
        <FormTextInput
          name="phone"
          type="number"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="شماره تلفن"
          error={errors.phone}
        />
        <FormTextInput
          name="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="پست الکترونیک"
          error={errors.email}
        />
        <FormTextInput
          name="subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="موضوع پیام"
          error={errors.subject}
        />
      </div>

      <div className="mt-2 flex w-full flex-col gap-7 md:mt-5">
        <FormTextarea
          name="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="پیام خود را اینجا بنویسید..."
          error={errors.message}
        />
        <FormFileInput
          ref={fileInputRef}
          name="attachment"
          onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          error={errors.attachment}
          style={{ width: "100%", marginTop: 10 }}
        />
        <Button type="submit" variant="success" fullWidth disabled={isPending}>
          ارسال پیام
        </Button>
      </div>
    </form>
  );
}
