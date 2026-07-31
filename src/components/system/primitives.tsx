import { BadgeCheck, CircleDashed, ShieldCheck, Sparkles, Stamp } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { VerificationLevel } from "@/lib/types";

const LEVEL_META: Record<
  VerificationLevel,
  { label: string; icon: typeof BadgeCheck; className: string; description: string }
> = {
  unverified: {
    label: "Unverified",
    icon: CircleDashed,
    className: "border-border bg-muted text-muted-foreground",
    description: "No evidence submitted",
  },
  claimed: {
    label: "Claimed",
    icon: CircleDashed,
    className: "border-border bg-muted text-muted-foreground",
    description: "Self-reported, awaiting review",
  },
  reviewed: {
    label: "Reviewed",
    icon: Sparkles,
    className: "border-signal/30 bg-signal/10 text-signal",
    description: "Checked by an independent reviewer",
  },
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    className: "border-verified/30 bg-verified/10 text-verified",
    description: "Confirmed at source",
  },
  attested: {
    label: "Attested",
    icon: ShieldCheck,
    className: "border-proof/35 bg-proof/12 text-proof",
    description: "Signed by a third-party assurance body",
  },
};

export function VerificationBadge({
  level,
  className,
  withLabel = true,
}: {
  level: VerificationLevel;
  className?: string;
  withLabel?: boolean;
}) {
  const meta = LEVEL_META[level];
  const Icon = meta.icon;
  return (
    <span
      title={meta.description}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide",
        meta.className,
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {withLabel ? meta.label : <span className="sr-only">{meta.label}</span>}
    </span>
  );
}

export function levelLabel(level: VerificationLevel) {
  return LEVEL_META[level].label;
}

export function StatusDot({
  tone = "verified",
  pulse = false,
  className,
}: {
  tone?: "verified" | "signal" | "proof" | "warning" | "muted";
  pulse?: boolean;
  className?: string;
}) {
  const tones: Record<string, string> = {
    verified: "bg-verified",
    signal: "bg-signal",
    proof: "bg-proof",
    warning: "bg-warning",
    muted: "bg-muted-foreground",
  };
  return (
    <span className={cn("relative inline-flex size-2 shrink-0", className)}>
      {pulse && <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", tones[tone])} />}
      <span className={cn("relative size-2 rounded-full", tones[tone])} />
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <p className="text-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-display text-2xl sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function MetricTile({
  label,
  value,
  delta,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("surface-card lift p-5", className)}>
      <p className="text-eyebrow">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-data text-3xl font-semibold tracking-tight text-foreground">{value}</span>
        {typeof delta === "number" && (
          <span
            className={cn(
              "text-data text-xs font-medium",
              delta >= 0 ? "text-verified" : "text-destructive",
            )}
          >
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Stamp,
  title,
  description,
  action,
  className,
}: {
  icon?: typeof Stamp;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-8 py-16 text-center",
        className,
      )}
    >
      <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-border bg-elevated text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="text-display text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/30 bg-destructive/8 px-6 py-8 text-center"
    >
      <h3 className="text-display text-lg text-foreground">Something didn't load</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-md border border-border bg-elevated px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3" style={{ width: `${92 - i * 14}%` }} />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(1100 / columns)}px, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProofMeter({ value, label }: { value: number; label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-data text-foreground">{value}</span>
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full border-border bg-surface/70 px-2.5 py-0.5 text-[0.6875rem] font-medium", className)}
    >
      {children}
    </Badge>
  );
}
