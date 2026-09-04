"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { FormTextInput } from "@/components/form/text-input";
import { formControlClassName } from "@/components/form/form-control-classes";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useToastState } from "@/lib/use-toast-message";
import { fetchProfile, updateProfile } from "@/lib/user-api";
import type { UserProfile } from "@/lib/types";

export default function ProfilePageClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { setMessage } = useToastState("success");
  const { setMessage: setInfo } = useToastState("info");
  const { setMessage: setError } = useToastState("error");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone ?? "");
      })
      .catch(() => {
        setLoadFailed(true);
        setError("بارگذاری پروفایل با خطا مواجه شد.");
      });
  }, [setError]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const form = new FormData();
        form.append("name", name);
        form.append("email", email);
        form.append("phone", phone);
        if (avatarFile) {
          form.append("avatar", avatarFile);
        }
        const result = await updateProfile(form);
        setProfile(result.profile);
        setMessage(result.message ?? null);
        setInfo(result.info ?? null);
        setError(null);
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "ذخیره پروفایل با خطا مواجه شد.";
        setError(msg);
      }
    });
  }

  if (!profile) {
    return (
      <PageWrapper title="پروفایل من">
        {loadFailed ? (
          <p className="text-center text-gray-500 dark:text-gray-400">بارگذاری پروفایل با خطا مواجه شد.</p>
        ) : (
          <FormSkeleton fields={4} columns={2} />
        )}
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="پروفایل من">
      <form onSubmit={handleSubmit} className="mt-5 grid gap-7 lg:grid-cols-2">
        <FormTextInput
          name="name"
          label="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام"
          required
        />
        <FormTextInput
          name="email"
          type="email"
          label="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
          required
        />
        <FormTextInput
          name="phone"
          label="تلفن همراه"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="تلفن همراه"
          required
        />
        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4 font-bold">تصویر پروفایل</span>
          <input
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className={formControlClassName}
          />
        </label>
        <div className="lg:col-span-2">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
