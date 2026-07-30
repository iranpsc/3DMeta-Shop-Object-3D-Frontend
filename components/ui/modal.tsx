"use client";

import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title?: string | null;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center dark:text-gray-300">
      <div
        className="pointer-events-none fixed start-0 top-14 z-[80] mx-auto flex w-full flex-col items-center justify-center overflow-x-hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="mt-14 transition-all ease-out">
          <div className="pointer-events-auto flex flex-col rounded-xl bg-white shadow-sm dark:bg-[#1A1A18] dark:shadow-slate-700/[.7]">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
              <Button variant="icon-close" onClick={onClose} aria-label="Close">
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
            <div className="flex flex-col gap-5 overflow-y-auto p-4 text-gray-800 dark:text-white">
              {children}
            </div>
            {footer ? (
              <div className="flex items-center justify-end gap-x-2 border-t p-5 dark:border-gray-700">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
