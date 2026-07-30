"use client";

import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type TableVariant = "default" | "bordered" | "order" | "plain";

type TableContextValue = {
  variant: TableVariant;
};

const TableContext = createContext<TableContextValue>({ variant: "default" });

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const tableClassByVariant: Record<TableVariant, string> = {
  default: "w-full border-collapse text-sm",
  bordered: "w-full border-collapse border border-gray-300 text-sm",
  order: "table mb-0 w-full table-borderless border-0",
  plain: "",
};

const headRowClassByVariant: Record<TableVariant, string> = {
  default: "border-b",
  bordered: "border-b",
  order: "userDatatable-header",
  plain: "",
};

const bodyRowClassByVariant: Record<TableVariant, string> = {
  default: "border-b",
  bordered: "",
  order: "",
  plain: "",
};

const thClassByVariant: Record<TableVariant, string> = {
  default: "p-3 text-right",
  bordered: "border border-gray-300 p-3 text-right",
  order: "",
  plain: "",
};

const tdClassByVariant: Record<TableVariant, string> = {
  default: "p-3",
  bordered: "border border-gray-300 p-3",
  order: "",
  plain: "",
};

type TableProps = ComponentPropsWithoutRef<"table"> & {
  variant?: TableVariant;
  /** Wrap the table in an overflow container. Defaults to true except for `plain`. */
  scrollable?: boolean;
  wrapperClassName?: string;
  children: ReactNode;
};

export function Table({
  variant = "default",
  scrollable,
  wrapperClassName,
  className,
  children,
  ...props
}: TableProps) {
  const shouldScroll = scrollable ?? variant !== "plain";
  const table = (
    <TableContext.Provider value={{ variant }}>
      <table className={cx(tableClassByVariant[variant], className)} {...props}>
        {children}
      </table>
    </TableContext.Provider>
  );

  if (!shouldScroll) return table;

  return <div className={cx("overflow-x-auto", wrapperClassName)}>{table}</div>;
}

type SectionProps = ComponentPropsWithoutRef<"thead">;

export function TableHeader({ className, ...props }: SectionProps) {
  return <thead className={className} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={className} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentPropsWithoutRef<"tfoot">) {
  return <tfoot className={className} {...props} />;
}

type RowProps = ComponentPropsWithoutRef<"tr"> & {
  /** Use header-row defaults when rendering inside `TableHeader`. */
  header?: boolean;
};

export function TableRow({ className, header, ...props }: RowProps) {
  const { variant } = useContext(TableContext);
  const base = header ? headRowClassByVariant[variant] : bodyRowClassByVariant[variant];
  return <tr className={cx(base, className)} {...props} />;
}

export function TableHead({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  const { variant } = useContext(TableContext);
  return <th className={cx(thClassByVariant[variant], className)} {...props} />;
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  const { variant } = useContext(TableContext);
  return <td className={cx(tdClassByVariant[variant], className)} {...props} />;
}
