"use client";

// Brand mark for AI5K — single source of truth used across the app
// (header, auth pages, footers, OG previews).
// Logo-only (no wordmark) by design.

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: number;
  href?: string | null;
  className?: string;
  ariaLabel?: string;
}

export default function Logo({
  size = 80,
  href = "/",
  className = "",
  ariaLabel = "AI5K",
}: LogoProps) {
  const mark = (
    <Image
      src="/ai5k_logo-removebg-preview.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      priority
    />
  );

  const body = (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label={ariaLabel}
    >
      {mark}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel}>
        {body}
      </Link>
    );
  }
  return body;
}
