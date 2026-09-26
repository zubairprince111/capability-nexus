"use client";

// Analysis — submit your evidence and watch the backend fetch + score.
//
// Layout (matches dashboard language):
//   1. Slim page bar (eyebrow + title + meta)
//   2. Submit form — 4 source cards in a 2-column grid (CV on top)
//   3. Inline pipeline progress / verdict
//
// Backend owns scoring; UI just sends + polls.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import CvSuggestions from "@/components/skills/CvSuggestions";
import {
  Chip,
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import {
  AnimatedNumber,
  AuroraBackdrop,
  LiveBadge,
  Skeleton,
  Surface,
} from "@/components/ui/Premium";
import {
  createProfileCheck,
  describeApiError,
  getLatestProfileCheck,
  getMyProfile,
  getProfileCheck,
  listSkillClaims,
  uploadCv,
  type ProfileCheck,
} from "@/lib/api-helpers";

const SOURCE_LABELS: Record<string, string> = {
  cv: "CV",
  github: "GitHub",
  upwork: "Upwork",
  fiverr: "Fiverr",
};

const IN_FLIGHT = new Set<ProfileCheck["status"]>([
  "pending",
  "fetching",
  "evaluating",
]);

function normalizeUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function fmtRelative(s: string): string {
  const t = new Date(s).getTime();
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Slim page bar
// ──────────────────────────────────────────────────────────────────────────────

function PageBar({ check }: { check: ProfileCheck | null }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Analysis
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            {check ? (
              <LiveBadge>Last run {fmtRelative(check.created_at)}</LiveBadge>
            ) : (
              <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                Awaiting first run
              </span>
            )}
          </span>
        </div>
        <Link
          href="/dashboard"
          className="ul-hover text-sm text-muted hover:text-ink transition-colors hidden sm:inline-block"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Submit form
// ──────────────────────────────────────────────────────────────────────────────

function SubmitForm({
  onStarted,
  previous,
}: {
  onStarted: (id: string) => void;
  previous?: ProfileCheck | null;
}) {
  const [github, setGithub] = useState(previous?.github_url ?? "");
  const [upwork, setUpwork] = useState(previous?.upwork_url ?? "");
  const [fiverr, setFiverr] = useState(previous?.fiverr_url ?? "");
  const [cv, setCv] = useState<{ token: string; filename: string; size: number } | null>(null);
  const [cvBusy, setCvBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pickCv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setCvBusy(true);
    try {
      const up = await uploadCv(file);
      setCv({ token: up.cv_token, filename: up.filename, size: up.size_bytes });
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setCvBusy(false);
      e.target.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const body: Record<string, string> = {};
      if (github.trim()) body.github_url = normalizeUrl(github);
      if (upwork.trim()) body.upwork_url = normalizeUrl(upwork);
      if (fiverr.trim()) body.fiverr_url = normalizeUrl(fiverr);
      if (cv) body.cv_token = cv.token;
      if (Object.keys(body).length === 0) {
        setError("Add at least one source — a profile URL or your CV.");
        setBusy(false);
        return;
      }
      const created = await createProfileCheck(body);
      onStarted(created.id);
    } catch (err) {
      setError(describeApiError(err));
      setBusy(false);
    }
  }

  const inputCls =
    "w-full bg-stone border border-border-light rounded-md px-3.5 py-2 text-sm text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan";

  return (
    <form onSubmit={submit}>
      <p className="text-[13px] text-muted leading-relaxed max-w-2xl mb-7">
        Submit your public profiles and/or your CV. The backend fetches each
        source — GitHub directly, Upwork and Fiverr corroborated via web search,
        your CV parsed for skills — then scores them.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 stagger">
        {/* CV — spans full width */}
        <Surface className="lg:col-span-2" padding="md" glow="emerald">
          <AuroraBackdrop />
          <div className="relative">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-[13.5px] font-medium text-ink inline-flex items-center gap-2">
                <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
                CV
              </p>
              <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                PDF · DOCX · TXT · MD · 10 MB
              </p>
            </div>
            {cv ? (
              <div className="flex items-center justify-between border border-border-light rounded-md px-3.5 py-2.5 bg-canvas">
                <span className="text-[13px] text-ink truncate">
                  <span className="text-brand-emerald mr-1.5">✓</span>
                  {cv.filename}
                  <span className="text-muted ml-2 font-mono text-[12px]">
                    · {(cv.size / 1024).toFixed(0)} KB
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setCv(null)}
                  className="ul-hover text-[12.5px] text-muted hover:text-error-red transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-between gap-4 border border-dashed border-border-light rounded-md px-3.5 py-3 cursor-pointer hover:border-brand-emerald hover:bg-elevated transition-all duration-300 bg-canvas">
                <span className="text-[13px] text-muted">
                  {cvBusy ? "Uploading…" : "Click to choose a file"}
                </span>
                <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                  {cvBusy ? "…" : "Browse"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,text/markdown"
                  className="hidden"
                  onChange={pickCv}
                  disabled={cvBusy}
                />
              </label>
            )}
          </div>
        </Surface>

        {/* GitHub */}
        <Surface padding="md">
          <p className="text-[13.5px] font-medium text-ink inline-flex items-center gap-2 mb-3">
            <span className="size-1 rounded-full bg-brand-cyan" aria-hidden />
            GitHub
          </p>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-3">
            Public profile
          </p>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="github.com/yourhandle"
            className={inputCls}
          />
        </Surface>

        {/* Upwork */}
        <Surface padding="md">
          <p className="text-[13.5px] font-medium text-ink inline-flex items-center gap-2 mb-3">
            <span className="size-1 rounded-full bg-brand-cyan" aria-hidden />
            Upwork
          </p>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-3">
            Public profile
          </p>
          <input
            type="text"
            value={upwork}
            onChange={(e) => setUpwork(e.target.value)}
            placeholder="upwork.com/freelancers/~…"
            className={inputCls}
          />
        </Surface>

        {/* Fiverr — full width */}
        <Surface className="lg:col-span-2" padding="md">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[13.5px] font-medium text-ink inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-brand-cyan" aria-hidden />
              Fiverr
            </p>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
              Public profile
            </p>
          </div>
          <input
            type="text"
            value={fiverr}
            onChange={(e) => setFiverr(e.target.value)}
            placeholder="fiverr.com/username"
            className={inputCls}
          />
        </Surface>
      </div>

      {error && (
        <div className="mt-5">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
        >
          {busy ? "Starting…" : "Run readiness check"}
          <span aria-hidden className="ml-2">→</span>
        </button>
        <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 max-w-md">
          Backend does all fetching + scoring
        </p>
      </div>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Pipeline progress
// ──────────────────────────────────────────────────────────────────────────────

function ProgressPanel({ check }: { check: ProfileCheck }) {
  const message =
    check.status === "pending"
      ? "Queued — the pipeline will start shortly."
      : check.status === "fetching"
        ? "Fetching your sources…"
        : check.status === "evaluating"
          ? "Scoring your readiness…"
          : "Check failed.";
  return (
    <div className="rounded-md border border-border-light bg-stone-2 p-7">
      <div className="flex items-center gap-4">
        <Spinner />
        <p className="text-ink font-medium">{message}</p>
      </div>
      <ol className="mt-7 space-y-2.5" aria-label="Pipeline stages">
        {(["pending", "fetching", "evaluating"] as const).map((stage, i) => {
          const passed =
            ["pending", "fetching", "evaluating", "completed"].indexOf(check.status) >= i;
          return (
            <li key={stage} className="flex items-center gap-3">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  passed ? "bg-brand-emerald" : "bg-border-light"
                }`}
              />
              <span
                className={`font-mono uppercase tracking-[0.18em] text-micro ${
                  passed ? "text-ink" : "text-muted-2"
                }`}
              >
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
      {check.status === "failed" && (
        <div className="mt-7">
          <Notice kind="error">
            {check.error_message || "The check could not complete."}{" "}
            <span className="font-mono text-micro">({check.error_code})</span>
          </Notice>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Verdict
// ──────────────────────────────────────────────────────────────────────────────

function SourceRow({ s }: { s: ProfileCheck["sources"][number] }) {
  const label = SOURCE_LABELS[s.source] ?? s.source;
  if (s.status === "ok") {
    const detail =
      s.source === "cv" && s.raw
        ? `${s.raw.filename ?? "CV"} parsed — ${(s.raw.chars ?? 0).toLocaleString()} chars extracted`
        : s.from_cache
          ? "fetched (cached)"
          : "fetched";
    return (
      <div className="flex items-center gap-4 py-3">
        <Chip tone="green">ok</Chip>
        <span className="text-ink font-medium">{label}</span>
        <span className="text-[13px] text-muted">{detail}</span>
      </div>
    );
  }
  if (s.status === "failed") {
    const detail =
      s.source === "cv" && s.error_code === "cv_unreadable"
        ? "The file could not be parsed — is it a valid PDF/DOCX?"
        : (s.error_message ?? "fetch failed");
    return (
      <div className="py-3">
        <div className="flex items-center gap-4">
          <Chip tone="coral">failed</Chip>
          <span className="text-ink font-medium">{label}</span>
          <span className="text-[13px] text-muted">
            {detail}{" "}
            <span className="font-mono text-micro">({s.error_code ?? "—"})</span>
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 py-3">
      <Chip tone="neutral">skipped</Chip>
      <span className="text-ink font-medium">{label}</span>
      <span className="text-[13px] text-muted">not supplied</span>
    </div>
  );
}

function DimBar({
  label,
  points,
  max,
  signals,
  delay = 0,
}: {
  label: string;
  points: number;
  max: number;
  signals: string[];
  delay?: number;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((points / max) * 100)) : 0;
  const validSignals = signals.filter(Boolean);
  return (
    <div className="anim-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-[13.5px] text-ink">{label}</span>
        <span className="font-mono text-[12px] text-muted tabular-nums">
          <AnimatedNumber value={points} durationMs={900} className="text-muted" />
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
          {validSignals.slice(0, 1).map((sig, i) => (
            <li key={i} className="text-[12px] text-muted font-mono leading-relaxed">
              · {sig}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Verdict({
  check,
  onRerun,
  rerunning,
  lift,
  claimsSinceCheck,
  onClaimsChanged,
}: {
  check: ProfileCheck;
  onRerun: () => void;
  rerunning: boolean;
  lift: number | null;
  claimsSinceCheck: number;
  onClaimsChanged: () => void;
}) {
  const result = check.result!;
  const dims = result.result.dimensions;
  const maxReadiness = dims.reduce((acc, d) => acc + d.max, 0);

  return (
    <div className="space-y-10">
      {/* Score band */}
      <Surface padding="none" glow="emerald" className="anim-fade-up overflow-hidden">
        <AuroraBackdrop />
        <div className="relative">
          <div className="px-6 py-3 flex items-center justify-between gap-4 border-b border-hairline">
            <MonoLabel>Readiness score</MonoLabel>
            <div className="flex items-center gap-2">
              {result.partial && <Chip tone="amber">partial</Chip>}
              {lift !== null && lift !== 0 && (
                <Chip tone={lift > 0 ? "green" : "coral"}>
                  {lift > 0 ? `+${lift}` : lift} vs last
                </Chip>
              )}
            </div>
          </div>
          <div className="px-6 py-7 flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            <div className="anim-number">
              <AnimatedNumber
                value={result.readiness}
                max={maxReadiness}
                size="xl"
                className="font-display leading-none text-ink"
                durationMs={1400}
              />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-muted">
                Evaluator <span className="font-mono text-ink-soft">{result.result.evaluator}</span>{" "}
                · took{" "}
                <span className="font-mono text-ink-soft">
                  {(((result.duration_ms ?? 0) as number) / 1000).toFixed(1)}s
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRerun}
                disabled={rerunning}
                className="inline-flex items-center justify-center font-medium rounded-full bg-ink text-canvas hover:bg-white hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)] transition-all duration-300 px-5 py-2 text-sm disabled:opacity-50"
              >
                {rerunning ? "Starting…" : "Re-run check"}
              </button>
              <Link
                href="/dashboard"
                className="ul-hover text-[13px] text-muted hover:text-ink transition-colors"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </Surface>

      {/* Two-column: per-source + dimensions */}
      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-5">
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[14px] font-medium text-ink inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
              Per-source status
            </h3>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
              {check.sources.length}
            </p>
          </div>
          <Surface padding="none" className="stagger">
            {check.sources.map((s) => (
              <div key={s.source} className="px-4 anim-fade-up border-t first:border-t-0 border-hairline">
                <SourceRow s={s} />
              </div>
            ))}
          </Surface>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[14px] font-medium text-ink inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-brand-cyan" aria-hidden />
              What moved the score
            </h3>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
              {dims.length} dims
            </p>
          </div>
          <Surface padding="md">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {dims.map((d, i) => (
                <DimBar
                  key={d.key}
                  label={d.label}
                  points={d.points}
                  max={d.max}
                  signals={d.signals ?? []}
                  delay={i * 70}
                />
              ))}
            </div>
          </Surface>
        </section>
      </div>

      {/* CV skill suggestions */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[14px] font-medium text-ink">From your CV</h3>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            Claimable
          </p>
        </div>
        <CvSuggestions onClaimed={() => onClaimsChanged()} />
      </section>

      {claimsSinceCheck > 0 && (
        <div className="rounded-md border border-brand-emerald/30 bg-brand-emerald/5 p-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[13px] text-ink">
            <span className="font-medium">
              {claimsSinceCheck} skill{claimsSinceCheck === 1 ? "" : "s"} claimed
            </span>{" "}
            since this check — re-run to fold them into your score.
          </p>
          <button
            type="button"
            onClick={onRerun}
            disabled={rerunning}
            className="inline-flex items-center justify-center font-medium rounded-full border border-ink text-ink hover:bg-ink hover:text-canvas transition-colors px-5 py-2 text-sm disabled:opacity-50"
          >
            {rerunning ? "Starting…" : "Re-run check"}
          </button>
        </div>
      )}

      {/* Skill audit */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[14px] font-medium text-ink">Skill audit</h3>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            claims
          </p>
        </div>
        <div className="rounded-md border border-border-light bg-stone-2 p-5">
          {result.skill_audit ? (
            <div className="flex items-baseline gap-5 flex-wrap">
              <p className="font-display text-ink" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-0.03em" }}>
                <span className="text-brand-emerald">{result.skill_audit.evidenced}</span>
                <span className="text-muted-2 ml-1.5">evidenced</span>
              </p>
              <p className="font-display text-ink" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-0.03em" }}>
                <span className="text-ink-soft">{result.skill_audit.self_declared}</span>
                <span className="text-muted-2 ml-1.5">self-declared</span>
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-muted">No skill claims yet — claim skills to be audited.</p>
          )}
          {result.skill_audit?.note && (
            <p className="text-[12.5px] text-muted mt-3">{result.skill_audit.note}</p>
          )}
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────

function AnalyzeInner() {
  const [check, setCheck] = useState<ProfileCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [rerunning, setRerunning] = useState(false);
  const [prevReadiness, setPrevReadiness] = useState<number | null>(null);
  const [claimsCount, setClaimsCount] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(async (p) => setClaimsCount((await listSkillClaims(p.id)).length))
      .catch(() => {});
  }, []);

  const refreshClaimsCount = async () => {
    try {
      const p = await getMyProfile();
      setClaimsCount((await listSkillClaims(p.id)).length);
    } catch {
      /* cosmetic only */
    }
  };

  const snapshotPrev = () => {
    if (check?.status === "completed" && check.result) {
      setPrevReadiness(check.result.readiness);
    }
  };

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    getLatestProfileCheck()
      .then((c) => setCheck(c))
      .catch((err) => setLoadError(describeApiError(err)))
      .finally(() => setLoading(false));
    return stopPolling;
  }, [stopPolling]);

  useEffect(() => {
    if (!check || !IN_FLIGHT.has(check.status)) {
      stopPolling();
      return;
    }
    pollRef.current = setInterval(async () => {
      try {
        const fresh = await getProfileCheck(check.id);
        setCheck(fresh);
      } catch {
        /* transient */
      }
    }, 2000);
    return stopPolling;
  }, [check?.id, check?.status, stopPolling]);

  async function rerun() {
    if (!check) return;
    setRerunning(true);
    try {
      const body: Record<string, string | boolean> = { reuse_cv: true };
      if (check.github_url) body.github_url = check.github_url;
      if (check.upwork_url) body.upwork_url = check.upwork_url;
      if (check.fiverr_url) body.fiverr_url = check.fiverr_url;
      const created = await createProfileCheck(body);
      snapshotPrev();
      const fresh = await getProfileCheck(created.id);
      setCheck(fresh);
    } catch (err) {
      setLoadError(describeApiError(err));
    } finally {
      setRerunning(false);
    }
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-12">
      <PageBar check={check} />

      {loadError && (
        <div className="mb-6 max-w-2xl">
          <Notice kind="error">{loadError}</Notice>
        </div>
      )}
      {loading && (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && (
        <>
          {check ? (
            IN_FLIGHT.has(check.status) || check.status === "failed" ? (
              <ProgressPanel check={check} />
            ) : check.result ? (
              <Verdict
                check={check}
                onRerun={rerun}
                rerunning={rerunning}
                lift={
                  prevReadiness !== null && check.status === "completed"
                    ? check.result.readiness - prevReadiness
                    : null
                }
                claimsSinceCheck={
                  claimsCount !== null
                    ? Math.max(0, claimsCount - check.result.claims.length)
                    : 0
                }
                onClaimsChanged={refreshClaimsCount}
              />
            ) : (
              <Notice kind="error">
                Check status &quot;{check.status}&quot; without a verdict.
              </Notice>
            )
          ) : (
            <SubmitForm
              onStarted={async (id) => {
                snapshotPrev();
                setCheck(await getProfileCheck(id));
              }}
            />
          )}

          {check && (
            <section className="mt-16 border-t border-hairline pt-10">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-[14px] font-medium text-ink">Start a new check</h2>
                <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                  replaces current
                </p>
              </div>
              <SubmitForm
                previous={check}
                onStarted={async (id) => {
                  snapshotPrev();
                  setCheck(await getProfileCheck(id));
                }}
              />
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <AppShell>
      <AnalyzeInner />
    </AppShell>
  );
}
