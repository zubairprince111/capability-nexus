"use client";

// Atomic UI primitives (dark Supabase+ChatGPT surface).
// Mono labels, hairline borders, quiet chips, flat surfaces, restrained motion.

import type { ReactNode } from "react";

export function MonoLabel({
  children,
  className = "",
  tone = "muted",
}: {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "green" | "coral" | "cyan";
}) {
  const tones = {
    muted: "text-muted",
    green: "text-brand-emerald",
    coral: "text-error-red",
    cyan: "text-brand-cyan",
  };
  return (
    <span
      className={`font-mono uppercase tracking-[0.18em] text-micro ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "coral" | "cyan" | "amber";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "border-border-light text-muted bg-stone",
    green: "border-brand-emerald/40 text-brand-emerald bg-brand-emerald/10",
    coral: "border-error-red/40 text-error-red bg-error-red/10",
    cyan: "border-brand-cyan/40 text-brand-cyan bg-brand-cyan/10",
    amber: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-micro font-mono ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink mb-1.5">
        {label}{" "}
        {required && <span className="text-error-red">*</span>}
        {hint && (
          <span className="ml-1 font-normal text-muted-2">— {hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full bg-stone border border-border-light rounded-sm px-4 py-2.5 text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-8 h-8 rounded-full border-2 border-border-light border-t-brand-emerald animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Notice({
  kind,
  children,
}: {
  kind: "error" | "ok" | "info";
  children: ReactNode;
}) {
  const styles = {
    error: "border-error-red/30 bg-error-red/10 text-error-red",
    ok: "border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald",
    info: "border-border-light bg-stone text-ink-soft",
  }[kind];
  return (
    <div className={`p-3 rounded-sm border text-sm ${styles}`}>{children}</div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 border border-hairline rounded-md bg-stone">
      <p className="text-card-heading text-ink">{title}</p>
      <p className="text-body text-muted mt-2 mb-6 max-w-md mx-auto">{body}</p>
      {action}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  right,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-12 flex items-end justify-between gap-6 flex-wrap">
      <div>
        <MonoLabel className="block mb-3">{eyebrow}</MonoLabel>
        <h1 className="text-section-heading font-display font-normal text-ink">
          {title}
        </h1>
        {lede && (
          <p className="text-body-lg text-muted mt-3 max-w-2xl">{lede}</p>
        )}
      </div>
      {right}
    </header>
  );
}
