import { cn } from "@/lib/utils";

/**
 * AI5K mark — a five-node capability lattice.
 * One centre of proof, four verified relations.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="AI5K" className={cn("size-7", className)}>
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.55">
        <path d="M16 16 L16 5" />
        <path d="M16 16 L26 11" />
        <path d="M16 16 L26 22" />
        <path d="M16 16 L6 22" />
        <path d="M16 16 L6 11" />
      </g>
      <g fill="currentColor">
        <circle cx="16" cy="5" r="2.1" />
        <circle cx="26" cy="11" r="1.7" opacity="0.85" />
        <circle cx="26" cy="22" r="1.7" opacity="0.7" />
        <circle cx="6" cy="22" r="1.7" opacity="0.7" />
        <circle cx="6" cy="11" r="1.7" opacity="0.85" />
      </g>
      <circle cx="16" cy="16" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className, subtle = false }: { className?: string; subtle?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn("size-7 text-primary")} />
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-semibold tracking-[0.22em] text-foreground">AI5K</span>
        {!subtle && (
          <span className="text-[0.5rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Capability OS
          </span>
        )}
      </span>
    </span>
  );
}
