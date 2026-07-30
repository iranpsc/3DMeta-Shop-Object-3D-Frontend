"use client";

import Link from "next/link";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type ButtonVariant =
  | "primary"
  | "admin"
  | "admin-success"
  | "success"
  | "danger"
  | "neutral"
  | "light"
  | "cart-add"
  | "cart-view"
  | "cart-remove"
  | "download"
  | "stepper"
  | "icon"
  | "icon-close"
  | "tab"
  | "tab-underline"
  | "search"
  | "ghost"
  | "filter"
  | "sort-pill"
  | "warning"
  | "unstyled";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

const baseClass =
  "inline-flex items-center justify-center outline-none transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "rounded-[10px] bg-[#000BEE] text-white active:scale-105 dark:bg-[#E59819] dark:text-black",
  admin: "rounded-[10px] bg-blue-600 text-white",
  "admin-success": "rounded-[10px] bg-green-600 text-white",
  success:
    "rounded-[10px] bg-[#06CC85] font-bold text-white active:scale-105",
  danger: "rounded-[10px] bg-red-600 text-white",
  neutral:
    "rounded-[10px] bg-gray-500 text-white dark:bg-gray-700 dark:text-white",
  light:
    "rounded-[10px] bg-[#EFEFEF] text-sm dark:bg-[#1A1A18]",
  "cart-add":
    "rounded-lg bg-[#FFE3E3] text-xs font-bold text-[#FF0000] lg:text-sm dark:bg-[#381715]",
  "cart-view":
    "rounded-lg bg-[#D8E5FD] text-xs font-bold text-[#000BEE] lg:text-sm dark:bg-[#493718] dark:text-[#E59819]",
  "cart-remove": "action-btn float-end rounded-full p-2",
  download:
    "rounded-lg text-xs font-bold text-[#00a367] lg:text-sm bg-[#06cc8360]",
  stepper:
    "h-12 w-10 cursor-pointer bg-white text-[#3A4980] outline-none dark:bg-black dark:text-white",
  icon: "flex items-center justify-center rounded-full border border-transparent",
  "icon-close":
    "flex size-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
  tab: "sortbtn items-center gap-2 whitespace-nowrap hover:text-black dark:hover:text-white",
  "tab-underline":
    "inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 px-5 py-4",
  search:
    "rounded-[32px] bg-[#000BEE] text-center font-bold text-white dark:bg-[#E59819] dark:text-black",
  ghost:
    "rounded-md bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white",
  filter:
    "flex items-center gap-3 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[#848383] transition duration-500 dark:bg-[#1a1a18] dark:text-white",
  "sort-pill":
    "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs transition duration-500 md:text-base",
  warning: "rounded-[10px] bg-[#E59819] text-white",
  unstyled: "",
};

const sizeClass: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-2 py-1 text-sm font-bold",
  md: "px-4 py-2",
  lg: "px-6 py-2",
};

const variantDefaultSize: Partial<Record<ButtonVariant, ButtonSize>> = {
  primary: "md",
  admin: "md",
  success: "md",
  danger: "md",
  neutral: "md",
  light: "md",
  ghost: "md",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Renders as Next.js Link when set */
  href?: string;
  /** For stepper variant: rounded side */
  stepperSide?: "start" | "end";
  /** For tab variants */
  active?: boolean;
  bordered?: boolean;
  /** Extra classes merged last */
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizelessVariants: ButtonVariant[] = [
  "cart-add",
  "cart-view",
  "cart-remove",
  "stepper",
  "icon",
  "icon-close",
  "tab",
  "tab-underline",
  "search",
  "filter",
  "sort-pill",
  "download",
  "unstyled",
];

function getVariantClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  options: {
    fullWidth?: boolean;
    stepperSide?: "start" | "end";
    active?: boolean;
    bordered?: boolean;
  },
) {
  const { fullWidth, stepperSide, active, bordered } = options;

  return cx(
    variant !== "unstyled" && baseClass,
    variantClass[variant],
    !sizelessVariants.includes(variant) && sizeClass[size],
    fullWidth && "w-full",
    variant === "stepper" &&
      (stepperSide === "start"
        ? "rounded-r-full"
        : stepperSide === "end"
          ? "rounded-l-full"
          : ""),
    variant === "tab" &&
      cx(
        bordered ? "border-x-2 border-gray-400 px-4" : "px-3",
        active ? "active" : "text-black/30 dark:text-[#D1D1D1]",
      ),
    variant === "tab-underline" &&
      (active
        ? "border-blue-600 text-blue-600 dark:border-[#E59819] dark:text-[#E59819]"
        : "border-transparent text-[#8E9ABC] hover:text-[#164C96] dark:text-gray-400"),
    variant === "sort-pill" &&
      (active
        ? "bg-[#000BEE] text-white dark:bg-[#E59819] dark:text-black"
        : "text-[#848383] text-black/30 dark:text-[#D1D1D1]"),
  );
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size,
      fullWidth,
      href,
      stepperSide,
      active,
      bordered,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const resolvedSize = size ?? variantDefaultSize[variant] ?? "md";
    const classes = cx(
      getVariantClasses(variant, resolvedSize, {
        fullWidth,
        stepperSide,
        active,
        bordered,
      }),
      className,
    );

    if (href) {
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as Omit<ButtonAsLink, keyof CommonProps>)}
        >
          {children}
        </Link>
      );
    }

    const { type = "button", ...buttonProps } = props as ButtonAsButton;

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    );
  },
);
