import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  crumbs: Array<{ label: string; href?: string }>;
  sideLabel: ReactNode;
};

/** Two-column breadcrumb matching Livewire storefront pages. */
export function StorefrontBreadcrumb({ crumbs, sideLabel }: Props) {
  return (
    <div className="hidden gap-5 lg:flex">
      <div className="flex items-center gap-1 rounded-[10px] bg-white p-3 text-[#828282] lg:w-[70%] xl:w-[80%] dark:bg-[#1A1A18]">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? <span>/</span> : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className={
                  index === crumbs.length - 1
                    ? "font-bold text-[#828282]"
                    : "font-medium text-[#828282]"
                }
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-bold text-[#828282]">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1 rounded-[10px] bg-white p-3 text-[#828282] lg:w-[30%] xl:w-[20%] dark:bg-[#1A1A18]">
        {sideLabel}
      </div>
    </div>
  );
}
