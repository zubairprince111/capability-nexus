"use client";

// Premium primitives — shared surfaces, animated numbers, status pills.
// Designed for the AI5K dark Supabase × ChatGPT design language.

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Chip } from "@/components/ui/Bits";

// ──────────────────────────────────────────────────────────────────────────────
// Surface — the canonical card with hover lift, edge-glow, optional aurora.
// ──────────────────────────────────────────────────────────────────────────────

interface SurfaceProps {
  children: ReactNode;
  className?: string;
  glow?: "emerald" | "cyan" | "none";
  lift?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "section" | "article";
  style?: CSSProperties;
}

const PAD: Record<NonNullable<SurfaceProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Surface({
  children,
  className = "",
  glow = "none",
  lift = false,
  padding = "md",
  as: Tag = "div",
  style,
}: SurfaceProps) {
  const base =
    "relative rounded-md border border-border-light bg-stone overflow-hidden transition-all duration-300 ease-out-expo";
  const liftCls = lift
    ? " hover:-translate-y-[1px] hover:border-border-glow hover:bg-stone-2 hover:shadow-elev-card-hover"
    : "";
  const glowCls =
    glow === "emerald"
      ? " shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_24px_60px_-30px_rgba(16,185,129,0.35)]"
      : glow === "cyan"
        ? " shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_24px_60px_-30px_rgba(34,211,238,0.30)]"
        : "";

  return (
    <Tag className={`${base}${liftCls}${glowCls} ${PAD[padding]} ${className}`} style={style}>
      {glow !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              glow === "emerald"
                ? "radial-gradient(420px 240px at 6% 0%, rgba(16,185,129,0.10), transparent 60%), radial-gradient(380px 220px at 100% 100%, rgba(34,211,238,0.06), transparent 60%)"
                : "radial-gradient(420px 240px at 6% 0%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(380px 220px at 100% 100%, rgba(16,185,129,0.06), transparent 60%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </Tag>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// AnimatedNumber — ease-out count-up + tabular nums + soft pop entrance.
// ──────────────────────────────────────────────────────────────────────────────

export function AnimatedNumber({
  value,
  max,
  durationMs = 1100,
  className = "",
  size = "auto",
}: {
  value: number;
  max?: number;
  durationMs?: number;
  className?: string;
  size?: "auto" | "lg" | "xl";
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const from = 0;
            const tick = (t: number) => {
              const elapsed = t - start;
              const p = Math.min(1, elapsed / durationMs);
              // easeOutExpo
              const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
              const cur = from + (value - from) * eased;
              setDisplay(Math.round(cur));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, durationMs]);

  const sizeCls =
    size === "xl"
      ? "clamp(2.25rem, 4.5vw, 3.5rem)"
      : size === "lg"
        ? "clamp(1.75rem, 3vw, 2.25rem)"
        : "";

  return (
    <span
      ref={ref}
      className={`tabular inline-flex items-baseline ${className}`}
      style={sizeCls ? { fontSize: sizeCls } : undefined}
    >
      {display}
      {typeof max === "number" && (
        <span className="text-muted-2 ml-1.5 text-[0.55em]">/{max}</span>
      )}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Sparkline — purely SVG, animated draw + soft fill
// ──────────────────────────────────────────────────────────────────────────────

export function Sparkline({
  values,
  width = 96,
  height = 28,
  stroke = "url(#spark-grad)",
  className = "",
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`overflow-visible ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,0.30)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{
          strokeDasharray: 240,
          strokeDashoffset: 240,
          animation: "spark-draw 900ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards",
        }}
      />
      <polygon
        fill="url(#spark-fill)"
        points={`0,${height} ${points} ${width},${height}`}
        opacity="0.7"
      />
      <style>{`@keyframes spark-draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Skeleton row — for loading states.
// ──────────────────────────────────────────────────────────────────────────────

export function Skeleton({
  className = "",
  height = "h-4",
  width = "w-full",
}: {
  className?: string;
  height?: string;
  width?: string;
}) {
  return <div className={`skeleton ${height} ${width} ${className}`} />;
}

// ──────────────────────────────────────────────────────────────────────────────
// AuroraBackdrop — pure-CSS atmospheric backdrop for hero sections.
// ──────────────────────────────────────────────────────────────────────────────

export function AuroraBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`aurora ${className}`} />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// LiveBadge — small "live" indicator with pulsing dot.
// ──────────────────────────────────────────────────────────────────────────────

export function LiveBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
      <span aria-hidden className="live-dot" />
      {children}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// GridBg — very faint dotted/grid background for sections that want more depth.
// ──────────────────────────────────────────────────────────────────────────────

export function GridBg({
  size = 28,
  className = "",
  opacity = 0.4,
}: {
  size?: number;
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,${opacity * 0.06}) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 70%)",
      }}
    />
  );
}

// re-export Chip for convenience
export { Chip };
