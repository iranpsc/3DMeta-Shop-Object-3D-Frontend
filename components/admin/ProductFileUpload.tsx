"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import {
  discardAdminTempUpload,
  getAdminProductUploadUrl,
} from "@/lib/admin-api";
import { prepareCsrfForUpload } from "@/lib/api-client";
import type { ChunkUploadedFile } from "@/lib/types";

type UploadItem = {
  uid: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  response: ChunkUploadedFile | null;
};

type ProductFileUploadProps = {
  label?: string;
  maxFiles?: number;
  maxFileSizeMb?: number;
  required?: boolean;
  value: ChunkUploadedFile[];
  onChange: (files: ChunkUploadedFile[]) => void;
};

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "fbx", "gltf", "glb", "bin"];

export function ProductFileUpload({
  label = "فایل‌ها",
  maxFiles = 20,
  maxFileSizeMb = 100,
  required = false,
  value,
  onChange,
}: ProductFileUploadProps) {
  const reactId = useId().replace(/:/g, "");
  const id = `product-files-${reactId}`;
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resumableReady, setResumableReady] = useState(false);
  const [closeEnabled, setCloseEnabled] = useState(true);

  const browseBtnRef = useRef<HTMLButtonElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<UploadItem[]>([]);
  const uploadingCountRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const resumableRef = useRef<{
    assignBrowse: (el: HTMLElement) => void;
    assignDrop: (el: HTMLElement) => void;
    upload: () => void;
    removeFile: (file: { uniqueIdentifier: string }) => void;
    on: (event: string, cb: (...args: unknown[]) => void) => void;
  } | null>(null);

  onChangeRef.current = onChange;

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  function syncDoneFiles(nextItems: UploadItem[]) {
    const done = nextItems
      .filter((item) => item.status === "done" && item.response)
      .map((item) => item.response as ChunkUploadedFile);
    onChangeRef.current(done);
  }

  function resetSummernoteDropzone() {
    document.querySelectorAll(".note-dropzone").forEach((el) => {
      el.classList.remove("hover");
      (el as HTMLElement).style.display = "none";
    });
  }

  useEffect(() => {
    if (!resumableReady || typeof window.Resumable === "undefined" || resumableRef.current) {
      return;
    }

    let cancelled = false;

    async function initResumable() {
      const xsrf = await prepareCsrfForUpload();
      if (cancelled || !browseBtnRef.current || !dropzoneRef.current || typeof window.Resumable === "undefined") {
        return;
      }

      const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;
      const resumable = new window.Resumable({
        headers: {
          Accept: "application/json",
          ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
        },
        withCredentials: true,
        target: getAdminProductUploadUrl(),
        chunkSize: 1 * 1024 * 1024,
        simultaneousUploads: 3,
        testChunks: false,
        throttleProgressCallbacks: 1,
        fileType: ALLOWED_EXTENSIONS,
      });

      resumable.assignBrowse(browseBtnRef.current);
      resumable.assignDrop(dropzoneRef.current);
      resumableRef.current = resumable;

      resumable.on("fileAdded", (file: {
        uniqueIdentifier: string;
        fileName: string;
        size: number;
      }) => {
        setError(null);
        resetSummernoteDropzone();

        const extension = (file.fileName.split(".").pop() || "").toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
          resumable.removeFile(file);
          setError(`پسوند فایل مجاز نیست: ${extension}`);
          return;
        }

        if (file.size > maxFileSizeBytes) {
          resumable.removeFile(file);
          setError(`حجم فایل نباید بیشتر از ${maxFileSizeMb} مگابایت باشد.`);
          return;
        }

        const doneOrUploading = itemsRef.current.filter(
          (item) => item.status === "done" || item.status === "uploading",
        ).length;

        if (doneOrUploading >= maxFiles) {
          resumable.removeFile(file);
          setError(`حداکثر ${maxFiles} فایل در هر آپلود مجاز است.`);
          return;
        }

        uploadingCountRef.current += 1;
        setCloseEnabled(false);
        setItems((prev) => [
          ...prev,
          {
            uid: file.uniqueIdentifier,
            name: file.fileName,
            progress: 0,
            status: "uploading",
            response: null,
          },
        ]);
        resumable.upload();
      });

      resumable.on("fileProgress", (file: { uniqueIdentifier: string; progress: () => number }) => {
        setItems((prev) =>
          prev.map((item) =>
            item.uid === file.uniqueIdentifier
              ? { ...item, progress: Math.floor(file.progress() * 100) }
              : item,
          ),
        );
      });

      resumable.on("fileSuccess", (file: { uniqueIdentifier: string }, message: string) => {
        uploadingCountRef.current = Math.max(0, uploadingCountRef.current - 1);
        resumable.removeFile(file);

        const response = JSON.parse(message) as ChunkUploadedFile;
        const next = itemsRef.current.map((item) =>
          item.uid === file.uniqueIdentifier
            ? {
                ...item,
                status: "done" as const,
                progress: 100,
                response,
              }
            : item,
        );
        itemsRef.current = next;
        setItems(next);

        if (uploadingCountRef.current === 0) {
          setCloseEnabled(true);
          syncDoneFiles(next);
        }
      });

      resumable.on("fileError", (file: { uniqueIdentifier: string; fileName: string }, message: string) => {
        uploadingCountRef.current = Math.max(0, uploadingCountRef.current - 1);
        resumable.removeFile(file);
        setError(`خطا در آپلود فایل: ${message || file.fileName}`);
        if (uploadingCountRef.current === 0) {
          setCloseEnabled(true);
        }
        setItems((prev) =>
          prev.map((item) =>
            item.uid === file.uniqueIdentifier ? { ...item, status: "error" as const } : item,
          ),
        );
      });
    }

    void initResumable();

    return () => {
      cancelled = true;
    };
  }, [resumableReady, maxFileSizeMb, maxFiles]);

  async function removeFileAt(index: number) {
    const item = items[index];
    if (!item || item.status === "uploading") {
      return;
    }

    if (item.response?.path && item.response.name) {
      try {
        await discardAdminTempUpload(item.response.path, item.response.name);
      } catch {
        // Keep UI removable even if discard fails (same as silent Livewire path checks).
      }
    }

    const next = items.filter((_, i) => i !== index);
    itemsRef.current = next;
    setItems(next);
    syncDoneFiles(next);
  }

  function openModal() {
    setError(null);
    resetSummernoteDropzone();
    setOpen(true);
  }

  function closeModal() {
    if (uploadingCountRef.current > 0) {
      setError("تا پایان آپلود همه فایل‌ها صبر کنید.");
      return;
    }
    resetSummernoteDropzone();
    setOpen(false);
    syncDoneFiles(itemsRef.current);
  }

  const doneFiles = items.filter((item) => item.status === "done" && item.response);
  const openLabel =
    doneFiles.length > 0
      ? `${doneFiles.length} فایل انتخاب شده — افزودن یا ویرایش`
      : "انتخاب و آپلود فایل‌ها";

  return (
    <div className="flex flex-col gap-3">
      <Script
        src="https://cdn.jsdelivr.net/npm/resumablejs@1.1.0"
        strategy="afterInteractive"
        onLoad={() => setResumableReady(true)}
        onReady={() => {
          if (typeof window.Resumable !== "undefined") {
            setResumableReady(true);
          }
        }}
      />

      <label className="form-col-label col-sm-4">{label}</label>
      <Button
        variant="unstyled"
        onClick={openModal}
        aria-required={required}
        className="w-full cursor-pointer rounded-[10px] border-0 bg-[#F8F9FA] p-4 text-right dark:bg-[#4A4E7C]"
      >
        {openLabel}
      </Button>

      <input type="hidden" name="files" value={JSON.stringify(value)} readOnly />

      <div className="mt-3 flex flex-col gap-2">
        {doneFiles.map((item) => {
          const index = items.findIndex((entry) => entry.uid === item.uid);
          return (
            <div
              key={item.uid}
              className="flex items-center justify-between gap-3 rounded-[10px] bg-[#F8F9FA] p-3 dark:bg-[#4A4E7C]"
            >
              <span className="break-all text-sm">
                {item.response?.name} ({item.response?.size})
              </span>
              <Button
                variant="unstyled"
                className="text-sm font-bold text-red-500"
                onClick={() => {
                  if (index >= 0) {
                    void removeFileAt(index);
                  }
                }}
              >
                حذف
              </Button>
            </div>
          );
        })}
      </div>

      <div
        className={`${open ? "flex" : "hidden"} fixed inset-0 z-[90] items-center justify-center bg-black/50 p-4`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetSummernoteDropzone();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetSummernoteDropzone();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetSummernoteDropzone();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetSummernoteDropzone();
        }}
      >
          <div className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-lg dark:bg-[#001448]">
            <div className="flex items-center justify-between border-b p-5 dark:border-gray-700">
              <h6 className="font-bold text-gray-800 dark:text-white">آپلود فایل‌ها</h6>
              <Button
                variant="icon-close"
                disabled={!closeEnabled}
                onClick={closeModal}
                className={closeEnabled ? "" : "opacity-50"}
              >
                <svg
                  className="size-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                حداکثر {maxFiles} فایل، هر فایل تا {maxFileSizeMb} مگابایت. پسوندهای مجاز:{" "}
                {ALLOWED_EXTENSIONS.join(", ")}
              </p>

              <div
                ref={dropzoneRef}
                id={`${id}-dropzone`}
                className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-[#06CC85] dark:border-gray-600"
                onClick={(e) => {
                  if (e.target === browseBtnRef.current || browseBtnRef.current?.contains(e.target as Node)) {
                    return;
                  }
                  browseBtnRef.current?.click();
                }}
              >
                <p className="mb-3 text-gray-600 dark:text-gray-300">فایل‌ها را اینجا رها کنید</p>
                <Button
                  ref={browseBtnRef}
                  id={`${id}-browse`}
                  variant="success"
                >
                  انتخاب از سیستم
                </Button>
              </div>

              {error ? <div className="text-sm text-red-600">{error}</div> : null}

              <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <div key={item.uid} className="rounded-[10px] border border-gray-200 p-3 dark:border-gray-600">
                    <div className="flex items-start justify-between gap-3">
                      <p className="break-all text-sm font-bold">{item.name}</p>
                      {item.status !== "uploading" ? (
                        <Button
                          variant="unstyled"
                          className="text-sm font-bold text-red-500"
                          onClick={() => removeFileAt(index)}
                        >
                          حذف
                        </Button>
                      ) : null}
                    </div>
                    {item.status === "uploading" ? (
                      <>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-[#06CC85]"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs">{item.progress}%</p>
                      </>
                    ) : item.status === "done" ? (
                      <p className="mt-1 text-xs text-green-600">آپلود شد ({item.response?.size})</p>
                    ) : (
                      <p className="mt-1 text-xs text-red-600">خطا در آپلود</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-2 border-t p-5 dark:border-gray-700">
              <Button
                variant="success"
                disabled={!closeEnabled}
                onClick={closeModal}
                className={`disabled:opacity-50 ${closeEnabled ? "" : "opacity-50"}`}
              >
                تأیید
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}
