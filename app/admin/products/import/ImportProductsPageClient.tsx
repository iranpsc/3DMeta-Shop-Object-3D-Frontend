"use client";

import { useState, useTransition } from "react";
import { formControlClassName } from "@/components/form/form-control-classes";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { useToastMessage } from "@/lib/use-toast-message";
import { importAdminProducts } from "@/lib/admin-api";

export default function ImportProductsPageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useToastMessage(message, "success");
  useToastMessage(error, "error");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;

    startTransition(async () => {
      try {
        const result = await importAdminProducts(file);
        setMessage(result ?? "محصولات با موفقیت درون ریزی شدند.");
        setFile(null);
      } catch {
        setError("درون ریزی با خطا مواجه شد.");
      }
    });
  }

  return (
    <PageWrapper title="درون ریزی محصولات">
      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className={formControlClassName}
        />
        <Button
          type="submit"
          variant="admin"
          size="lg"
          disabled={!file || pending}
          className="w-max disabled:opacity-50"
        >
          درون ریزی
        </Button>
      </form>
    </PageWrapper>
  );
}
