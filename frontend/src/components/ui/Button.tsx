"use client";

// Button — pill or sharp. Three tones (primary, outline, ghost), dark theme.

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-full disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // On dark surface: white pill (ChatGPT-y).
  primary: "bg-ink text-canvas hover:bg-white",
  outline: "border border-border-light text-ink hover:bg-stone hover:border-ink",
  ghost: "text-muted hover:text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink",
  danger: "border border-error-red/40 text-error-red hover:bg-error-red/10",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
