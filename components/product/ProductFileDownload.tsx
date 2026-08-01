"use client";

import { useEffect, useRef, useState } from "react";
import { loginRedirect } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export type ProductDownloadFile = {
  id: number;
  name?: string | null;
  size?: string | number | null;
  url?: string | null;
};

type Props = {
  files: ProductDownloadFile[];
  /** When false, clicking download sends the user to login (free products for guests). */
  canDownload: boolean;
  className?: string;
};

function DownloadIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/img/svg/download.svg" alt="" className="svg" aria-hidden />
  );
}

export function ProductFileDownload({ files, canDownload, className }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function handleDownload(file?: ProductDownloadFile) {
    if (!canDownload) {
      loginRedirect();
      return;
    }

    const target = file ?? files[0];
    if (!target?.url) {
      return;
    }

    // Resolve relative `/download/...?signature=` against the current HTTPS origin.
    // Absolute http:// URLs from APP_URL were blocked as Mixed Content on this page.
    window.location.assign(new URL(target.url, window.location.origin).href);
  }

  if (files.length === 0) {
    return <span className="text-sm text-gray-400">فایلی موجود نیست</span>;
  }

  if (files.length === 1) {
    return (
      <Button
        variant="success"
        fullWidth
        onClick={() => handleDownload(files[0])}
        className={`flex h-12 items-center justify-center gap-5 rounded-full text-sm ${className ?? ""}`}
      >
        <DownloadIcon />
        دانلود
      </Button>
    );
  }

  return (
    <div ref={rootRef} className={`relative w-full ${className ?? ""}`}>
      <Button
        type="button"
        variant="success"
        fullWidth
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 items-center justify-center gap-3 rounded-full text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <DownloadIcon />
        دانلود
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      {open ? (
        <div
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1A1A18]"
        >
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              role="option"
              onClick={() => {
                setOpen(false);
                handleDownload(file);
              }}
              className="w-full break-all border-b border-gray-100 px-4 py-3 text-right text-sm last:border-0 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              {file.name ?? `فایل ${file.id}`}
              {file.size ? (
                <span className="mt-1 block text-xs text-gray-400">{file.size}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
