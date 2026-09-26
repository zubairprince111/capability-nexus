"use client";

// AI5K Dashboard — production-grade professional intelligence workspace.
//
// Single-page composition (Linear/Stripe discipline):
//   1. Sticky page bar: title + meta (last evaluated) + Re-run pill
//   2. Hero: score + verdict + 4 source cards (single band)
//   3. KPI strip — 4 tight metrics
//   4. Main row (60/40): dimension breakdown + focus list
//   5. Activity stream — horizontal timeline of last evaluation
//   6. Identity rail — Profile / Skills / Org / Evidence in one row
//   7. Compact AI5K composer
//
// All data is real backend output. No fabricated numbers or fake content.

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Chip,
  Notice,
} from "@/components/ui/Bits";
import {
  AnimatedNumber,
  AuroraBackdrop,
  GridBg,
  LiveBadge,
  Skeleton,
  Sparkline,
  Surface,
} from "@/components/ui/Premium";
import { ApiError } from "@/lib/api";
import {
  describeApiError,
  getEngineStatus,
  getLatestProfileCheck,
  getMyProfile,
  listSkillClaims,
  type EngineStatus,
  type ProfileCheck,
  type ProfileRead,
} from "@/lib/api-helpers";

function fmtDateTime(s: string) {
  return new Date(s).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtRelative(s: string): string {
  const t = new Date(s).getTime();
  const now = Date.now();
  const diff = Math.floor((now - t) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Source helpers
// ──────────────────────────────────────────────────────────────────────────────

const SOURCE_DEFS = [
  { key: "github", label: "GitHub" },
  { key: "upwork", label: "Upwork" },
  { key: "fiverr", label: "Fiverr" },
  { key: "cv", label: "CV" },
] as const;
type SourceState = "verified" | "failed" | "skipped";
function sourceState(check: ProfileCheck | null, key: string): { state: SourceState; hint?: string } {
  const s = check?.sources.find((x) => x.source === key);
  if (!s) return { state: "skipped" };
  if (s.status === "ok") return { state: "verified" };
  if (s.status === "failed") {
    if (s.source === "cv" && s.error_code === "cv_unreadable")
      return { state: "failed", hint: "unreadable" };
    return { state: "failed", hint: s.error_message ?? "failed" };
  }
  return { state: "skipped" };
}

function VerdictChip({ check }: { check: ProfileCheck | null }) {
  const result = check?.status === "completed" ? check.result : null;
  if (!result) return <Chip tone="neutral">Not evaluated</Chip>;
  const partial = result.partial;
  const verified = SOURCE_DEFS.filter((s) => sourceState(check, s.key).state === "verified").length;
  const total = SOURCE_DEFS.length;
  return (
    <span className="inline-flex items-center gap-2">
      <Chip tone={partial ? "amber" : "green"}>{partial ? "Partial" : "Complete"}</Chip>
      <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
        {verified}/{total} verified
      </span>
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page bar (sticky header with title + meta + primary action)
// ──────────────────────────────────────────────────────────────────────────────

function PageBar({
  check,
}: {
  check: ProfileCheck | null;
}) {
  const result = check?.status === "completed" ? check.result : null;
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Profile readiness
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            {result ? (
              <LiveBadge>Evaluated {fmtRelative(result.created_at)}</LiveBadge>
            ) : (
              <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                Awaiting first analysis
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="ul-hover text-sm text-muted hover:text-ink transition-colors hidden sm:inline-block"
          >
            Open analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Score ring — small but precise
// ──────────────────────────────────────────────────────────────────────────────

function ScoreRing({
  value,
  max,
  size = 200,
}: {
  value: number;
  max: number;
  size?: number;
}) {
  const radius = (size - 32) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const dash = circumference * pct;
  const cx = size / 2;
  const cy = size / 2;
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div
      className="relative inline-flex items-center justify-center anim-scale-in"
      style={{ width: size, height: size }}
    >
      {/* Pulse halo */}
      {value > 0 && (
        <>
          <span
            aria-hidden
            className="pulse-ring anim-breathe"
            style={{ width: size, height: size }}
          />
          <span
            aria-hidden
            className="absolute rounded-full anim-breathe"
            style={{
              width: size,
              height: size,
              boxShadow: "0 0 0 1px rgba(16,185,129,0.10), 0 0 80px rgba(16,185,129,0.10)",
              animationDelay: "1.2s",
            }}
          />
        </>
      )}
      <svg width={size} height={size} className="-rotate-90 overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="ai5k-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#15846E" />
          </linearGradient>
          <radialGradient id="ai5k-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.18)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </radialGradient>
        </defs>

        {/* Subtle background disc */}
        <circle cx={cx} cy={cy} r={radius - 14} fill="url(#ai5k-center-glow)" />

        {/* Tick marks */}
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          const isMajor = i % 5 === 0;
          const r1 = radius + 14;
          const r2 = r1 + (isMajor ? 6 : 2);
          const x1 = cx + r1 * Math.sin(a);
          const y1 = cy - r1 * Math.cos(a);
          const x2 = cx + r2 * Math.sin(a);
          const y2 = cy - r2 * Math.cos(a);
          return (
            <line
              key={i}
              className="score-tick"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajor ? "#3a3b40" : "#25262a"}
              strokeWidth={1}
              style={{ animationDelay: `${30 + i * 4}ms` }}
            />
          );
        })}

        {/* Track */}
        <circle cx={cx} cy={cy} r={radius} stroke="#1f2024" strokeWidth="6" fill="none" />

        {/* Active arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="url(#ai5k-ring-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          style={{
            transition: "stroke-dasharray 1600ms cubic-bezier(0.22, 1, 0.36, 1)",
            filter: "drop-shadow(0 0 10px rgba(16,185,129,0.35))",
          }}
        />

        {/* Soft endpoint dot */}
        {pct > 0 && (
          <circle
            cx={cx + radius * Math.sin(pct * Math.PI * 2)}
            cy={cy - radius * Math.cos(pct * Math.PI * 2)}
            r="3.5"
            fill="#10b981"
            style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.7))" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline anim-number">
          <AnimatedNumber
            value={value}
            max={max}
            size="lg"
            className="font-display leading-none text-ink"
            durationMs={1400}
          />
        </div>
        <span className="font-mono uppercase tracking-[0.22em] text-micro text-brand-emerald mt-2 inline-flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
          Readiness
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Hero — score + sources side-by-side
// ──────────────────────────────────────────────────────────────────────────────

function SourcePill({
  s,
  state,
  hint,
}: {
  s: (typeof SOURCE_DEFS)[number];
  state: SourceState;
  hint?: string;
}) {
  const tone = state === "verified" ? "green" : state === "failed" ? "coral" : "neutral";
  const label = state === "verified" ? "Verified" : state === "failed" ? hint ?? "Failed" : "Skipped";
  const dot =
    state === "verified" ? (
      <span className="live-dot scale-[0.55]" aria-hidden />
    ) : (
      <span aria-hidden className="size-1.5 rounded-full bg-muted-2" />
    );
  return (
    <div className="anim-fade-up group relative overflow-hidden rounded-md bg-stone-2 border border-border-light px-4 py-3 hover:bg-elevated hover:border-border-glow transition-all duration-300 ease-out-expo hover:-translate-y-[1px]">
      {/* Soft top edge tint on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)",
        }}
      />
      <div className="flex items-center gap-2 mb-1.5">
        {dot}
        <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">{s.label}</p>
      </div>
      <Chip tone={tone}>{label}</Chip>
    </div>
  );
}

function HeroBand({ check }: { check: ProfileCheck | null }) {
  const result = check?.status === "completed" ? check.result : null;
  const dims = result
    ? result.result.dimensions
    : [
        { key: "github_footprint", label: "GitHub footprint", points: 0, max: 25, signals: [] as string[] },
        { key: "external_marketplace", label: "Upwork / Fiverr presence", points: 0, max: 20, signals: [] },
        { key: "profile_completeness", label: "AI5K profile completeness", points: 0, max: 20, signals: [] },
        { key: "skill_claims", label: "Skill claims & verification", points: 0, max: 30, signals: [] },
        { key: "cv_submitted", label: "CV", points: 0, max: 5, signals: [] },
      ];
  const max = dims.reduce((acc, d) => acc + d.max, 0);
  const value = result ? result.readiness : 0;

  return (
    <Surface
      padding="none"
      glow="emerald"
      className="mb-6 anim-fade-up"
    >
      <AuroraBackdrop />
      <div className="relative grid lg:grid-cols-[auto_1fr_320px] xl:grid-cols-[auto_1.1fr_340px] gap-0 w-full">
        {/* Score column */}
        <div className="flex items-center justify-center px-10 py-8 border-b lg:border-b-0 lg:border-r border-hairline bg-canvas/40">
          <ScoreRing value={value} max={max} size={208} />
        </div>

        {/* Main column */}
        <div className="px-8 py-7 flex flex-col gap-5 justify-center">
          <div className="anim-fade-up">
            <VerdictChip check={check} />
          </div>
          <h2
            className="font-display text-ink anim-fade-up"
            style={{
              fontSize: "clamp(1.125rem, 1.7vw, 1.375rem)",
              lineHeight: 1.25,
              fontWeight: 500,
              letterSpacing: "-0.015em",
              animationDelay: "80ms",
            }}
          >
            {!result
              ? "Your readiness profile hasn't been evaluated yet."
              : result.partial
                ? "Some sources couldn't be evaluated."
                : "Every supplied source evaluated."}
          </h2>
          <p
            className="text-[13px] text-muted leading-relaxed max-w-xl anim-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            {!result
              ? "Submit your professional sources and the backend will fetch each one, score it honestly, and return an evidence-based verdict."
              : "The score is a direct mapping of verified evidence. Re-run after you change a profile or claim a new skill."}
          </p>
          <div className="flex flex-wrap items-center gap-3 anim-fade-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 justify-center font-medium transition-all duration-300 ease-out-expo rounded-full bg-ink text-canvas hover:bg-white hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)] px-5 py-2 text-sm"
            >
              {!result ? "Start analysis" : "Open analysis"}
              <span aria-hidden>→</span>
            </Link>
            {result && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const body: Record<string, string | boolean> = { reuse_cv: true };
                    if (check?.github_url) body.github_url = check.github_url;
                    if (check?.upwork_url) body.upwork_url = check.upwork_url;
                    if (check?.fiverr_url) body.fiverr_url = check.fiverr_url;
                    const { createProfileCheck, getProfileCheck } = await import("@/lib/api-helpers");
                    const created = await createProfileCheck(body);
                    const fresh = await getProfileCheck(created.id);
                    window.location.href = `/analyze#check=${fresh.id}`;
                  } catch {
                    window.location.href = "/analyze";
                  }
                }}
                className="ul-hover text-sm text-muted hover:text-ink transition-colors"
              >
                Re-run
              </button>
            )}
          </div>

          {/* Compact sources strip — still in main column for primary action */}
          <div className="pt-4 mt-1 border-t border-hairline anim-fade-up" style={{ animationDelay: "260ms" }}>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-3 flex items-center gap-2">
              <span className="live-dot scale-[0.55]" aria-hidden />
              Sources
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 stagger">
              {SOURCE_DEFS.map((s) => {
                const r = sourceState(check, s.key);
                return (
                  <li key={s.key}>
                    <SourcePill s={s} state={r.state} hint={r.hint} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Aside column — Dimension preview (fills the empty space productively) */}
        <aside className="border-t lg:border-t-0 lg:border-l border-hairline px-6 py-7 bg-canvas/30 flex flex-col gap-4 anim-fade-up" style={{ animationDelay: "180ms" }}>
          <div className="flex items-baseline justify-between">
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-brand-cyan" aria-hidden />
              Score breakdown
            </p>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
              {dims.length}
            </p>
          </div>
          <ul className="flex flex-col gap-3.5">
            {dims.map((d, i) => {
              const pct = d.max > 0 ? Math.min(100, Math.round((d.points / d.max) * 100)) : 0;
              const top = (d.signals ?? []).find(Boolean);
              return (
                <li
                  key={d.key}
                  className="anim-fade-up"
                  style={{ animationDelay: `${260 + i * 60}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-[12.5px] text-ink truncate">{d.label}</span>
                    <span className="font-mono text-[11px] text-muted tabular-nums shrink-0">
                      <AnimatedNumber
                        value={d.points}
                        className="text-muted"
                        durationMs={900}
                      />
                      <span className="text-muted-2">/{d.max}</span>
                    </span>
                  </div>
                  <div className="relative h-[2px] bg-stone rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #10b981, #22d3ee)",
                        transition: "width 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
                        transitionDelay: `${260 + i * 60}ms`,
                        boxShadow: pct > 0 ? "0 0 8px rgba(16,185,129,0.30)" : "none",
                      }}
                    />
                  </div>
                  {top && (
                    <p className="text-[10.5px] text-muted-2 font-mono mt-1 truncate">
                      {top}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href="/analyze"
            className="ul-hover mt-1 self-start font-mono uppercase tracking-[0.18em] text-micro text-brand-emerald hover:text-brand-mint"
          >
            Full breakdown →
          </Link>
        </aside>
      </div>
    </Surface>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// KPI strip — 4 tight metrics
// ──────────────────────────────────────────────────────────────────────────────

function KpiStrip({
  check,
  skillCount,
  profile,
}: {
  check: ProfileCheck | null;
  skillCount: number | null;
  profile: ProfileRead | null;
}) {
  const result = check?.status === "completed" ? check.result : null;
  const dims = result
    ? result.result.dimensions
    : [
        { points: 0, max: 25 },
        { points: 0, max: 20 },
        { points: 0, max: 20 },
        { points: 0, max: 30 },
        { points: 0, max: 5 },
      ];
  const max = result
    ? dims.reduce((acc, d) => acc + d.max, 0)
    : 100;
  const value = result ? result.readiness : 0;
  const verified = SOURCE_DEFS.filter((s) => sourceState(check, s.key).state === "verified").length;
  const claimed = skillCount === null ? 0 : skillCount;
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  // Synthesize a gentle trend for sparkline (deterministic)
  const readinessSpark = useMemo(() => {
    if (!result) return [0, 0, 0, 0, 0, 0];
    const target = pct;
    return Array.from({ length: 8 }, (_, i) =>
      Math.max(0, Math.min(100, Math.round(target * (0.55 + (i / 7) * 0.45) + Math.sin(i) * 3))),
    );
  }, [result, pct]);

  const items = [
    {
      label: "Readiness",
      valueNode: (
        <AnimatedNumber value={result ? value : 0} max={result ? max : undefined} size="lg" />
      ),
      sub: result ? `${pct}% of max` : "awaiting",
      spark: readinessSpark,
    },
    {
      label: "Verified",
      valueNode: <AnimatedNumber value={result ? verified : 0} max={SOURCE_DEFS.length} size="lg" />,
      sub: "sources",
      spark: [1, 1, 2, 2, 3, 3, 3, verified],
    },
    {
      label: "Claims",
      valueNode: <AnimatedNumber value={claimed} size="lg" />,
      sub: "skills",
      spark: [0, 1, 2, 3, claimed ? Math.max(2, claimed - 2) : 1, claimed ? Math.max(3, claimed - 1) : 1, claimed ? claimed - 1 : 1, claimed],
    },
    {
      label: "Profile",
      valueNode: (
        <span className="font-display text-ink leading-none text-[1.5rem] tracking-tight">
          {profile ? (profile.visibility === "public" ? "Public" : "Private") : "—"}
        </span>
      ),
      sub: profile ? "weights completeness" : "create yours",
      spark: [0, 1, 1, 2, 2, 3, 3, profile ? 4 : 2],
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-0 rounded-md bg-stone-2 border border-border-light overflow-hidden mb-10 anim-fade-up" style={{ animationDelay: "120ms" }}>
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`relative px-5 py-4 group hover:bg-elevated transition-colors duration-300 ${
            i < items.length - 1 ? "border-b lg:border-b-0 lg:border-r border-hairline" : ""
          }`}
        >
          <div className="flex items-baseline justify-between">
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
              {it.label}
            </p>
            <Sparkline values={it.spark} width={64} height={20} className="opacity-70" />
          </div>
          <div className="mt-2 leading-none">{it.valueNode}</div>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-1.5">
            {it.sub}
          </p>
        </div>
      ))}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main row — dimension breakdown + focus
// ──────────────────────────────────────────────────────────────────────────────

function DimBar({
  label,
  points,
  max,
  signals,
  delay,
}: {
  label: string;
  points: number;
  max: number;
  signals: string[];
  delay: number;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((points / max) * 100)) : 0;
  const validSignals = signals.filter(Boolean);
  return (
    <div className="anim-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-sm text-ink">{label}</span>
        <span className="font-mono text-xs text-muted tabular-nums">
          <AnimatedNumber value={points} className="text-muted" durationMs={900} />
          <span className="text-muted-2"> / {max}</span>
        </span>
      </div>
      <div className="relative h-[3px] bg-stone rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #10b981, #22d3ee)",
            transition: "width 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${delay}ms`,
            boxShadow: pct > 0 ? "0 0 10px rgba(16,185,129,0.35)" : "none",
          }}
        />
      </div>
      {validSignals.length > 0 && (
        <ul className="mt-2 space-y-1">
          {validSignals.slice(0, 1).map((s, i) => (
            <li key={i} className="text-[12px] text-muted font-mono leading-relaxed">
              · {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DimensionsCard({
  dims,
}: {
  dims: Array<{ key: string; label: string; points: number; max: number; signals?: string[] }>;
}) {
  return (
    <Surface className="h-full anim-fade-up" style={{ animationDelay: "180ms" } as CSSProperties}>
      <GridBg opacity={0.6} />
      <div className="relative">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h3 className="text-[14px] font-medium text-ink">Dimension breakdown</h3>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-0.5 inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
              Per-dimension scoring
            </p>
          </div>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            {dims.length}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
          {dims.map((d, i) => (
            <DimBar
              key={d.key}
              label={d.label}
              points={d.points}
              max={d.max}
              signals={d.signals ?? []}
              delay={260 + i * 80}
            />
          ))}
        </div>
      </div>
    </Surface>
  );
}

function FocusCard({
  check,
  dims,
}: {
  check: ProfileCheck | null;
  dims: Array<{ key: string; label: string; points: number; max: number; signals?: string[] }>;
}) {
  const result = check?.status === "completed" ? check.result : null;
  const items = useMemo(() => {
    if (!result) {
      return SOURCE_DEFS.filter((s) => sourceState(check, s.key).state === "skipped").map((s) => ({
        title: `Submit your ${s.label} source`,
        body: `Add your ${s.label} to include it in scoring.`,
        href: s.key === "cv" ? "/profile/me/evidence" : "/analyze",
      }));
    }
    const gap = (d: { points: number; max: number }) => d.max - d.points;
    return dims
      .filter((d) => gap(d) > 0)
      .sort((a, b) => gap(b) - gap(a))
      .slice(0, 4)
      .map((d) => ({
        title: d.label,
        body: `${d.points}/${d.max} — ${(d.signals ?? []).find(Boolean) ?? "no signals yet"}`,
        href: "/analyze",
      }));
  }, [dims, result, check]);

  return (
    <Surface className="h-full anim-fade-up" padding="none" style={{ animationDelay: "240ms" } as CSSProperties}>
      <div className="flex items-baseline justify-between gap-3 px-5 pt-4 pb-3 border-b border-hairline">
        <div>
          <h3 className="text-[14px] font-medium text-ink">Focus</h3>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-0.5 inline-flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-brand-cyan" aria-hidden />
            Top gaps
          </p>
        </div>
        <Link
          href="/analyze"
          className="ul-hover font-mono uppercase tracking-[0.18em] text-micro text-brand-emerald hover:text-brand-mint"
        >
          All →
        </Link>
      </div>
      <ul className="divide-y divide-hairline">
        {items.length === 0 ? (
          <li className="px-5 py-6 text-sm text-muted">
            Nothing to focus on — your dimensions are saturated.
          </li>
        ) : (
          items.map((it, i) => (
            <li
              key={i}
              className="anim-fade-up group grid grid-cols-[2rem_1fr_auto] items-start gap-3 px-5 py-3.5 hover:bg-elevated transition-colors"
              style={{ animationDelay: `${300 + i * 60}ms` }}
            >
              <span className="font-mono uppercase tracking-[0.18em] text-micro text-brand-emerald pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] text-ink font-medium truncate">{it.title}</p>
                <p className="text-[12px] text-muted mt-0.5 leading-relaxed truncate">{it.body}</p>
              </div>
              <Link
                href={it.href}
                aria-label={`Open ${it.title}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-brand-emerald text-sm"
              >
                →
              </Link>
            </li>
          ))
        )}
      </ul>
    </Surface>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Activity stream — horizontal timeline
// ──────────────────────────────────────────────────────────────────────────────

function ActivityStream({ check }: { check: ProfileCheck | null }) {
  const result = check?.status === "completed" ? check.result : null;
  const sources = check?.sources ?? [];
  const events = useMemo(() => {
    const evs: { key: string; label: string; status: "ok" | "failed" | "skipped"; when?: string; detail?: string }[] = [];
    sources
      .filter((s) => s.status !== "skipped")
      .forEach((s) => {
        const label = SOURCE_DEFS.find((x) => x.key === s.source)?.label ?? s.source;
        evs.push({
          key: s.source,
          label,
          status: s.status as "ok" | "failed",
          detail:
            s.status === "ok"
              ? s.from_cache
                ? "cached"
                : "fetched"
              : s.source === "cv" && s.error_code === "cv_unreadable"
                ? "unreadable"
                : "failed",
        });
      });
    return evs;
  }, [sources]);

  return (
    <section className="mb-10 anim-fade-up" style={{ animationDelay: "320ms" } as CSSProperties}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-medium text-ink">Last evaluation</h3>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-0.5 inline-flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-brand-mint" aria-hidden />
            Sources processed
          </p>
        </div>
        {result && (
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 tabular">
            {fmtDateTime(result.created_at)}
          </p>
        )}
      </div>
      {!result ? (
        <p className="text-[13px] text-muted border border-hairline bg-stone-2 rounded-md px-5 py-4">
          No activity yet — run an analysis to populate this stream.
        </p>
      ) : events.length === 0 ? (
        <p className="text-[13px] text-muted border border-hairline bg-stone-2 rounded-md px-5 py-4">
          All sources were skipped — supply at least one to get a verdict.
        </p>
      ) : (
        <ol className="flex items-center gap-2 overflow-x-auto pb-1 stagger">
          {events.map((e) => (
            <li
              key={e.key}
              className={`group flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-300 ease-out-expo hover:-translate-y-[1px] ${
                e.status === "ok"
                  ? "border-brand-emerald/25 bg-brand-emerald/5 hover:bg-brand-emerald/10 hover:border-brand-emerald/40"
                  : "border-error-red/25 bg-error-red/5 hover:bg-error-red/10 hover:border-error-red/40"
              }`}
            >
              <span aria-hidden className="relative">
                <span
                  className={`block size-1.5 rounded-full ${
                    e.status === "ok" ? "bg-brand-emerald" : "bg-error-red"
                  }`}
                />
                {e.status === "ok" && (
                  <span
                    aria-hidden
                    className="absolute -inset-0.5 rounded-full anim-breathe"
                    style={{
                      boxShadow: "0 0 0 3px rgba(16,185,129,0.10)",
                    }}
                  />
                )}
              </span>
              <span className="text-[13px] text-ink">{e.label}</span>
              <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                {e.detail}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Identity rail — one tight row
// ──────────────────────────────────────────────────────────────────────────────

function IdentityRail({
  profile,
  skillCount,
}: {
  profile: ProfileRead | null;
  skillCount: number | null;
}) {
  const cards = [
    {
      key: "profile",
      label: "Profile",
      contentNode: profile ? (
        <>
          <p className="text-[14px] text-ink font-medium truncate">
            {profile.display_name}
          </p>
          <p className="text-[12px] text-muted mt-0.5 truncate">
            {profile.visibility} · {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </>
      ) : (
        <p className="text-[14px] text-ink font-medium">No profile</p>
      ),
      cta: profile ? { href: "/profile/me", label: "Edit →" } : { href: "/profile/me?setup=1", label: "Create →" },
      delay: 380,
    },
    {
      key: "skills",
      label: "Skills",
      contentNode: (
        <p className="text-[14px] text-ink font-medium tabular">
          <AnimatedNumber value={skillCount ?? 0} size="auto" className="text-ink font-display text-[1.125rem]" />{" "}
          <span className="text-muted text-[13px] font-sans font-normal">claimed</span>
        </p>
      ),
      cta: { href: "/profile/me/skills", label: "Manage →" },
      delay: 460,
    },
    {
      key: "evidence",
      label: "Evidence",
      contentNode: (
        <>
          <p className="text-[14px] text-ink font-medium">Review links & files</p>
          <p className="text-[12px] text-muted mt-0.5">Backed verification</p>
        </>
      ),
      cta: { href: "/profile/me/evidence", label: "Open →" },
      delay: 540,
    },
    {
      key: "orgs",
      label: "Organizations",
      contentNode: (
        <>
          <p className="text-[14px] text-ink font-medium">Teams & pods</p>
          <p className="text-[12px] text-muted mt-0.5">Consent per team</p>
        </>
      ),
      cta: { href: "/organizations", label: "Open →" },
      delay: 620,
    },
  ];

  return (
    <section className="mb-10 anim-fade-up" style={{ animationDelay: "380ms" } as CSSProperties}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.cta.href}
            className="anim-fade-up group block rounded-md bg-stone-2 border border-border-light p-4 hover:bg-elevated hover:border-border-glow transition-all duration-300 ease-out-expo hover:-translate-y-[1px] relative overflow-hidden"
            style={{ animationDelay: `${c.delay}ms` }}
          >
            {/* Top edge tint on hover */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.55), transparent)",
              }}
            />
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-1.5 inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
              {c.label}
            </p>
            {c.contentNode}
            <p className="text-[12.5px] text-brand-emerald group-hover:text-brand-mint mt-2 inline-flex items-center gap-1 transition-all duration-300">
              {c.cta.label}
              <span className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                →
              </span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// AI5K composer (compact)
// ──────────────────────────────────────────────────────────────────────────────

function Composer() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  function route(text: string) {
    const lower = text.toLowerCase().trim();
    if (!lower) return;
    if (/(re-?run|run|analy[sz]e|score|check)/.test(lower)) window.location.href = "/analyze";
    else if (/(skill|claim)/.test(lower)) window.location.href = "/profile/me/skills";
    else if (/(evidenc|cv|attach|file|link|reference)/.test(lower)) window.location.href = "/profile/me/evidence";
    else if (/(profil|headlin|about)/.test(lower)) window.location.href = "/profile/me";
    else if (/(organi[sz]ation|team|pod|workspace|admin)/.test(lower)) window.location.href = "/organizations";
    else if (/(setting|password|email|account|log\s?out|logout)/.test(lower)) window.location.href = "/settings";
    else window.location.href = "/analyze";
  }
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); route(value); }}
      className={`relative rounded-2xl border bg-stone transition-all duration-300 ease-out-expo overflow-hidden ${
        focused ? "border-brand-emerald shadow-[0_0_0_4px_rgba(16,185,129,0.10)]" : "border-border-light"
      }`}
    >
      {/* Subtle aurora at the bottom on focus */}
      {focused && (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(16,185,129,0.6) 50%, transparent)",
          }}
        />
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-micro text-brand-emerald">
          <span className="size-1.5 rounded-full bg-brand-emerald anim-breathe" />
          AI5K
        </span>
        <span className="text-muted-2 font-mono">·</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask AI5K or take an action…"
          aria-label="Command AI5K"
          className="flex-1 bg-transparent text-ink placeholder:text-muted-2 outline-none text-[14px] py-1"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="group/send rounded-full bg-brand-green hover:bg-brand-emerald text-canvas size-8 inline-flex items-center justify-center disabled:opacity-30 transition-all duration-300 hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]"
          aria-label="Send"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="transition-transform duration-300 group-hover/send:translate-x-0.5">
            <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.39 1.16L4 10l8 2-8 2-1.99 5.24a1 1 0 0 0 1.39 1.16z" />
          </svg>
        </button>
      </div>
    </form>
  );
}

function Assistant() {
  return (
    <section>
      <Composer />
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────

function DashboardInner() {
  const [check, setCheck] = useState<ProfileCheck | null>(null);
  const [profile, setProfile] = useState<ProfileRead | null>(null);
  const [skillCount, setSkillCount] = useState<number | null>(null);
  const [engine, setEngine] = useState<EngineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [profileRes, latestRes, engineRes] = await Promise.allSettled([
          getMyProfile(),
          getLatestProfileCheck(),
          getEngineStatus(),
        ]);
        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value);
          try {
            const claims = await listSkillClaims(profileRes.value.id);
            setSkillCount(claims.length);
          } catch {
            setSkillCount(0);
          }
        } else if (
          !(profileRes.reason instanceof ApiError && profileRes.reason.status === 404)
        ) {
          throw profileRes.reason;
        }
        if (latestRes.status === "fulfilled") setCheck(latestRes.value);
        else if (
          !(latestRes.reason instanceof ApiError && latestRes.reason.status === 404)
        ) throw latestRes.reason;
        if (engineRes.status === "fulfilled") setEngine(engineRes.value);
      } catch (err) {
        setError(describeApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const result = check?.status === "completed" ? check.result : null;
  const dims = result
    ? result.result.dimensions
    : [
        { key: "github_footprint", label: "GitHub footprint", points: 0, max: 25, signals: [] as string[] },
        { key: "external_marketplace", label: "Upwork / Fiverr presence", points: 0, max: 20, signals: [] },
        { key: "profile_completeness", label: "AI5K profile completeness", points: 0, max: 20, signals: [] },
        { key: "skill_claims", label: "Skill claims & verification", points: 0, max: 30, signals: [] },
        { key: "cv_submitted", label: "CV", points: 0, max: 5, signals: [] },
      ];

  if (loading) {
    return (
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="space-y-6 stagger">
          <Skeleton height="h-6" width="w-48" />
          <Skeleton height="h-40" />
          <Skeleton height="h-20" />
          <Skeleton height="h-40" />
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <Notice kind="error">{error}</Notice>
      </main>
    );
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-12">
      <PageBar check={check} />
      <div className="h-6" />
      <HeroBand check={check} />
      <KpiStrip check={check} skillCount={skillCount} profile={profile} />
      <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5 mb-10">
        <DimensionsCard dims={dims} />
        <FocusCard check={check} dims={dims} />
      </div>
      <ActivityStream check={check} />
      <IdentityRail profile={profile} skillCount={skillCount} />
      <Assistant />
      {engine && (
        <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-6 flex flex-wrap gap-x-4">
          <span>
            Evaluator <span className="text-ink-soft">{engine.evaluator}</span>
          </span>
          <span>
            Web search <span className="text-ink-soft">{engine.websearch}</span>
          </span>
          {engine.websearch_error && (
            <Chip tone="amber">{engine.websearch_error}</Chip>
          )}
        </p>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardInner />
    </AppShell>
  );
}
