import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type PageWrapperProps = {
  title: string;
  actionBtn?: boolean;
  actionBtnLink?: string;
  actionBtnText?: string;
  onActionClick?: () => void;
  children: ReactNode;
};

export function PageWrapper({
  title,
  actionBtn = false,
  actionBtnLink = "#",
  actionBtnText = "Create",
  onActionClick,
  children,
}: PageWrapperProps) {
  return (
    <div className="w-full px-5 lg:px-0">
      <div
        className="mx-auto mb-10 flex w-full max-w-[90%] flex-col justify-between gap-6 px-5 pt-14"
      >
        <div className="breadcrumb-action mt-10 flex-wrap justify-content-center lg:mt-0">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-1 rounded-[10px] bg-white p-3 text-[#828282] lg:w-[70%] xl:w-[80%] dark:bg-[#1A1A18]">
              <li>
                <Link href="/">خانه /</Link>
              </li>
              <li className="font-bold" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>
        </div>
        <div>
          <h4 className="px-2 text-2xl font-bold dark:text-white">{title}</h4>
        </div>
      </div>
      <div className="mx-auto w-full rounded-xl bg-white p-5 dark:bg-[#1A1A18] dark:text-white lg:w-[70%] lg:p-7">
        <div className="pb-5 font-bold">{title}</div>
        {actionBtn ? (
          <div className="p-5 px-0">
            {onActionClick ? (
              <Button variant="admin" onClick={onActionClick} className="px-5 py-1">
                {actionBtnText}
              </Button>
            ) : (
              <Button variant="admin" href={actionBtnLink} className="px-5 py-1">
                {actionBtnText}
              </Button>
            )}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
