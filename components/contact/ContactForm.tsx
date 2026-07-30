"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormTextInput } from "@/components/form/text-input";
import { FormTextarea } from "@/components/form/textarea";
import { ApiError } from "@/lib/api-client";
import { submitContactUs } from "@/lib/storefront-client-api";

const errorStyle = { backgroundColor: "rgba(207, 117, 117, 0.47)" };

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({});
    startTransition(async () => {
      try {
        const res = await submitContactUs(form);
        setSuccessMessage(res.message ?? "پیام شما با موفقیت ارسال شد.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
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
          setErrors({ form: ["خطا در ارسال پیام"] });
        }
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {successMessage ? (
        <div className="mb-2 rounded-lg bg-green-500 p-3 text-center text-white md:mb-7">
          {successMessage}
        </div>
      ) : null}
      {errors.form ? (
        <span
          className="mb-2 mt-2 block rounded-[10px] px-3.5 py-3.5 text-red-600 md:mb-7"
          style={errorStyle}
        >
          {errors.form[0]}
        </span>
      ) : null}

      <div className="grid gap-2 md:gap-7 lg:grid-cols-2">
        <FormTextInput
          name="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="نام و نام خانوادگی"
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

      <div className="mt-2 flex w-full flex-col gap-2 md:mt-5 md:gap-7">
        <FormTextarea
          name="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="پیام خود را اینجا بنویسید..."
          error={errors.message}
        />
        <Button type="submit" variant="success" fullWidth disabled={isPending} className="p-4" style={{ marginTop: 4 }}>
          ارسال پیام
        </Button>
      </div>
    </form>
  );
}
