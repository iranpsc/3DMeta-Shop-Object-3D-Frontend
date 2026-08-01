"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getPaginationRange } from "@/lib/pagination";

type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange?: (page: number) => void;
  /** Server Component-safe alternative to hrefForPage (e.g. `/tags/foo?page=`). */
  hrefPrefix?: string;
  hrefForPage?: (page: number) => string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

function PageControl({
  children,
  href,
  disabled,
  onClick,
  ariaLabel,
  style,
}: {
  children: ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  style?: CSSProperties;
}) {
  if (href) {
    return (
      <Link href={href} className="page-item" style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <Button
      variant="unstyled"
      className="page-item"
      style={style}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  hrefPrefix,
  hrefForPage,
  disabled,
  ariaLabel = "صفحه‌بندی",
  className,
}: Props) {
  if (lastPage <= 1) return null;

  const items = getPaginationRange(currentPage, lastPage);

  function controlProps(page: number) {
    if (hrefPrefix) {
      return { href: `${hrefPrefix}${page}` };
    }
    if (hrefForPage) {
      return { href: hrefForPage(page) };
    }
    return {
      disabled,
      onClick: () => onPageChange?.(page),
    };
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={["ui-pagination w-full", className].filter(Boolean).join(" ")}
      style={{ marginTop: 20 }}
    >
      <ul className="pagination flex w-full gap-1 p-1">
        <li className={currentPage <= 1 ? "disabled" : undefined} aria-disabled={currentPage <= 1}>
          {currentPage <= 1 ? (
            <span className="page-item" style={{ fontWeight: "bold" }} aria-hidden="true">
              &lsaquo;
            </span>
          ) : (
            <PageControl
              {...controlProps(currentPage - 1)}
              style={{ fontWeight: "bold" }}
              ariaLabel="صفحه قبل"
            >
              &lsaquo;
            </PageControl>
          )}
        </li>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="disabled" aria-disabled="true">
              <span className="page-item">...</span>
            </li>
          ) : (
            <li
              key={item}
              className={currentPage === item ? "active" : undefined}
              aria-current={currentPage === item ? "page" : undefined}
            >
              {currentPage === item ? (
                <span className="page-item">{item}</span>
              ) : (
                <PageControl {...controlProps(item)}>{item}</PageControl>
              )}
            </li>
          ),
        )}

        <li
          className={currentPage >= lastPage ? "disabled" : undefined}
          aria-disabled={currentPage >= lastPage}
        >
          {currentPage >= lastPage ? (
            <span className="page-item" style={{ fontWeight: "bold" }} aria-hidden="true">
              &rsaquo;
            </span>
          ) : (
            <PageControl
              {...controlProps(currentPage + 1)}
              style={{ fontWeight: "bold" }}
              ariaLabel="صفحه بعد"
            >
              &rsaquo;
            </PageControl>
          )}
        </li>
      </ul>
    </nav>
  );
}
