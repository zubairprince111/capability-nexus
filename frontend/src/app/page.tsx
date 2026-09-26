"use client";

// Landing page — opening sequence:
//   t=0     — dark canvas, nothing visible
//   t=0.2s  — brain fades in, centered
//   t=2.2s  — brain shifts to the right
//   t=2.8s  — left-side hero copy fades in
//   t=3.8s  — navbar slides down
//   t=4.0s  — rest of page reveals (intersection-on-scroll)
//
// Pressing anywhere (or pressing Esc) snaps to the final state.

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";

// BrainHero uses three.js + WebGL — render only on the client.
const BrainHero = dynamic(() => import("@/components/hero/BrainHero"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-canvas" aria-hidden />,
});

const SOURCES = [
  { label: "CV", detail: "PDF · DOCX · TXT · MD" },
  { label: "GitHub", detail: "Public footprint + repos" },
  { label: "Upwork", detail: "Public profile corroborated" },
  { label: "Fiverr", detail: "Public profile corroborated" },
];

const FEATURES = [
  {
    title: "Readiness score",
    body: "0–100 across GitHub, Upwork/Fiverr, profile, claimed skills, and CV.",
  },
  {
    title: "Per-source status",
    body: "Every input is reported as ok, failed, or skipped — nothing is silently dropped.",
  },
  {
    title: "Re-runnable",
    body: "Re-run after you fix a profile, claim a skill, or refresh a portfolio link.",
  },
];

// Brain X target in BrainHero world-space units.
// 0 = centered in the canvas, 4.4 = anchored to the right (default landing layout).
const BRAIN_CENTERED_X = 0;
const BRAIN_RIGHT_X = 4.4;

// Animation timing (ms)
const T_BRAIN_IN = 1800;
const T_BRAIN_SHIFT_START = 4400;
const T_BRAIN_SHIFT_END = 5400;
const T_TEXT_IN_START = 5400;
const T_NAVBAR_IN = 7000;
const T_FINAL = 7400;

type Stage = "dark" | "brainIn" | "brainShift" | "textIn" | "final";

export default function LandingPage() {
  const [stage, setStage] = useState<Stage>("dark");
  const [mounted, setMounted] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    setMounted(true);
    const t1 = window.setTimeout(() => setStage("brainIn"), T_BRAIN_IN);
    const t2 = window.setTimeout(() => setStage("brainShift"), T_BRAIN_SHIFT_START);
    const t3 = window.setTimeout(() => setStage("textIn"), T_TEXT_IN_START);
    const t4 = window.setTimeout(() => setStage("final"), T_FINAL);
    timersRef.current = [t1, t2, t3, t4];
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Allow the user to skip the intro on click or Esc.
  function skipToFinal() {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    setStage("final");
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipToFinal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While dark, suppress scroll on body so the user can't scroll past the curtain.
  useEffect(() => {
    if (stage === "dark" || stage === "brainIn") {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [stage]);

  const brainOffsetX = stage === "brainShift" || stage === "textIn" || stage === "final"
    ? BRAIN_RIGHT_X
    : BRAIN_CENTERED_X;

  return (
    <main className="bg-canvas text-ink">
      {/* Navbar — slides down at the end of the intro */}
      <header
        className="sticky top-0 z-30 border-b border-hairline bg-canvas/70 backdrop-blur intro-navbar"
        data-stage={stage}
      >
        <div className="max-w-shell mx-auto px-6 h-24 flex items-center justify-between">
          <Logo href="/" size={84} />
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-muted hover:text-ink transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-6 py-2.5 text-sm"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — brain + copy. Clicking the hero during the dark/brainIn
          stages skips the intro. Once text is visible, clicks bubble
          normally so Link CTAs work. */}
      <section
        className="relative h-[88vh] min-h-[640px] w-full overflow-hidden"
        onClick={
          stage === "dark" || stage === "brainIn" || stage === "brainShift"
            ? skipToFinal
            : undefined
        }
      >
        <BrainHero offsetX={brainOffsetX} />

        {/* Subtle vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 50%, transparent 0%, rgba(10,10,10,0.55) 80%)",
          }}
        />

        {/* Foreground copy — fades in once brain has shifted right */}
        <div
          className="relative z-10 max-w-shell mx-auto px-6 h-full flex flex-col justify-center"
          data-stage={stage}
        >
          <div className="md:w-1/2 md:max-w-xl intro-text">
            <p className="font-mono uppercase tracking-[0.22em] text-micro text-brand-emerald intro-text-row">
              Verified AI Capability · Network
            </p>
            <h1
              className="font-display font-normal text-ink mt-5 intro-text-row"
              style={{ fontSize: "clamp(2.75rem, 6vw, 4.75rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              The operating system
              <br />
              for verified AI capability.
            </h1>
            <p className="text-body-lg text-ink-soft mt-6 max-w-xl intro-text-row">
              AI5K reads your CV, GitHub, Upwork, and Fiverr — and returns an
              evidence-based readiness score with a per-source breakdown.
            </p>
            <div className="flex flex-wrap gap-3 mt-10 intro-text-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-7 py-3 text-base"
              >
                Create your account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-medium transition-colors rounded-full border border-border-light text-ink hover:bg-stone px-7 py-3 text-base"
              >
                Log in
              </Link>
            </div>
            <p className="intro-skip font-mono uppercase tracking-[0.18em] text-micro text-muted mt-6">
              Click anywhere to skip
            </p>
          </div>
        </div>

        {/* Initial dark curtain — fades out as the brain appears */}
        <div
          aria-hidden
          className="intro-curtain absolute inset-0 bg-canvas"
          style={{ zIndex: 30 }}
        />
      </section>

      {/* The rest of the page — appears after the intro completes */}
      <div className="intro-rest" data-stage={stage}>
        {/* Sources — quiet technical section */}
        <section className="border-y border-hairline">
          <div className="max-w-shell mx-auto px-6 py-20 grid md:grid-cols-[1fr_1.5fr] gap-10">
            <div>
              <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted">
                What the analysis reads
              </p>
              <h2 className="font-display font-normal text-section-heading text-ink mt-4">
                Four sources. One verdict.
              </h2>
              <p className="text-body text-muted mt-4 max-w-md">
                Submit any combination. Each source is fetched and scored
                honestly — no aggregated fuzz, no hidden weighting.
              </p>
            </div>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {SOURCES.map((s) => (
                <li
                  key={s.label}
                  className="py-4 flex items-baseline gap-6 font-mono text-sm"
                >
                  <span className="text-brand-emerald w-24 shrink-0">
                    {s.label.toUpperCase()}
                  </span>
                  <span className="text-ink-soft">{s.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What comes back */}
        <section className="max-w-shell mx-auto px-6 py-24">
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted">
            What comes back
          </p>
          <h2 className="font-display font-normal text-section-display text-ink mt-4 max-w-3xl">
            A score, a breakdown, and the evidence behind each point.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="border-t-2 border-ink pt-4">
                <p className="font-mono uppercase tracking-[0.18em] text-micro text-brand-emerald">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-ink font-medium text-card-heading mt-3">
                  {f.title}
                </p>
                <p className="text-body text-muted mt-2">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="border-t border-hairline bg-stone">
          <div className="max-w-shell mx-auto px-6 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-section-heading font-display font-normal text-ink">
                Find out what your evidence is actually worth.
              </h2>
              <p className="text-body-lg text-muted mt-3 max-w-xl">
                Sign up, run the analysis, read the breakdown. No sales calls.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-7 py-3 text-base"
            >
              Create your account
            </Link>
          </div>
        </section>

        <footer className="relative overflow-hidden border-t border-hairline bg-stone">
          {/* Blurred icon.png watermark — large, soft, atmospheric */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="relative"
              style={{
                width: "min(1600px, 140%)",
                height: "min(1100px, 200%)",
                filter: "blur(36px) saturate(1.2)",
                opacity: 0.22,
              }}
            >
              <Image
                src="/icon.png"
                alt=""
                aria-hidden
                fill
                className="object-contain"
                sizes="(min-width: 1280px) 1600px, 140vw"
                priority={false}
                quality={70}
              />
            </div>
          </div>
          {/* Soft side glows so the icon doesn't sit on a flat plane */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(16,185,129,0.10), transparent)",
              filter: "blur(40px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 bottom-0 w-[420px] h-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(34,211,238,0.08), transparent)",
              filter: "blur(50px)",
            }}
          />
          {/* Subtle hairline gradient at the top edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(16,185,129,0.30) 30%, rgba(34,211,238,0.25) 70%, transparent)",
            }}
          />

          <div className="relative max-w-shell mx-auto px-6 py-16">
            <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
              {/* Brand block */}
              <div className="max-w-sm">
                <div className="flex items-center gap-5">
                  <Logo size={56} href={null} />
                  <span
                    aria-hidden
                    className="h-12 w-px bg-border-light"
                  />
                  <Image
                    src="/cloudcamp.png"
                    alt="Cloudcamp"
                    width={56}
                    height={56}
                    className="object-contain"
                    style={{ width: 56, height: 56 }}
                  />
                </div>
                <p className="mt-5 text-sm text-ink-soft leading-relaxed">
                  AI5K is the evidence-first readiness layer for AI professionals.
                  We read what you can already show — CV, GitHub, Upwork, Fiverr —
                  and score what&apos;s actually verifiable.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-brand-emerald">
                  <span className="size-1.5 rounded-full bg-brand-emerald" aria-hidden />
                  <span>Profile Readiness · v1.0</span>
                </div>
              </div>

              <FooterCol
                title="Product"
                items={[
                  { href: "/analyze", label: "Run analysis" },
                  { href: "/profile/me", label: "Profile" },
                  { href: "/profile/me/skills", label: "Skills" },
                  { href: "/profile/me/evidence", label: "Evidence" },
                  { href: "/organizations", label: "Organizations" },
                ]}
              />

              <FooterCol
                title="Account"
                items={[
                  { href: "/login", label: "Sign in" },
                  { href: "/signup", label: "Create account" },
                  { href: "/settings", label: "Settings" },
                ]}
              />

              <div>
                <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-4">
                  Platform
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/verify-email" className="text-muted hover:text-ink transition-colors">
                      Email verification
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-muted hover:text-ink transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <span className="text-muted-2 font-mono uppercase tracking-[0.18em] text-micro">
                      Backend · v0.1
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-14 pt-8 border-t border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                © 2026 AI5K Network Inc. · All rights reserved
              </p>
              <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                Readiness is a point-in-time snapshot of evidence
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Intro styles — scoped via attribute selectors so they don't leak. */}
      <style jsx>{`
        /* The dark curtain covers the hero until the brain comes up.
           The fade-out is intentionally long — ~2.4s — so the brain
           emerges from darkness rather than appearing all at once. */
        .intro-curtain {
          opacity: 1;
          pointer-events: auto;
          transition:
            opacity 2400ms cubic-bezier(0.22, 1, 0.36, 1) 200ms,
            pointer-events 0ms linear 2600ms;
          z-index: 30;
        }

        /* Use the parent <section>'s data attribute as the trigger. */
        section:has([data-stage="brainIn"]) .intro-curtain,
        section:has([data-stage="brainShift"]) .intro-curtain,
        section:has([data-stage="textIn"]) .intro-curtain,
        section:has([data-stage="final"]) .intro-curtain {
          opacity: 0;
          pointer-events: none;
        }

        /* Hero copy is hidden until textIn / final. */
        .intro-text-row {
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        section:has([data-stage="textIn"]) .intro-text-row,
        section:has([data-stage="final"]) .intro-text-row {
          opacity: 1;
          transform: translateY(0);
        }
        /* Stagger the rows once they appear. */
        section:has([data-stage="textIn"]) .intro-text-row:nth-child(1),
        section:has([data-stage="final"]) .intro-text-row:nth-child(1) { transition-delay: 0ms; }
        section:has([data-stage="textIn"]) .intro-text-row:nth-child(2),
        section:has([data-stage="final"]) .intro-text-row:nth-child(2) { transition-delay: 90ms; }
        section:has([data-stage="textIn"]) .intro-text-row:nth-child(3),
        section:has([data-stage="final"]) .intro-text-row:nth-child(3) { transition-delay: 180ms; }
        section:has([data-stage="textIn"]) .intro-text-row:nth-child(4),
        section:has([data-stage="final"]) .intro-text-row:nth-child(4) { transition-delay: 270ms; }
        section:has([data-stage="textIn"]) .intro-text-row:nth-child(5),
        section:has([data-stage="final"]) .intro-text-row:nth-child(5) { transition-delay: 360ms; }
        section:has([data-stage="textIn"]) .intro-text-row:nth-child(6),
        section:has([data-stage="final"]) .intro-text-row:nth-child(6) { transition-delay: 450ms; }

        .intro-skip {
          opacity: 0;
          transition: opacity 600ms ease-out;
        }
        section:has([data-stage="textIn"]) .intro-skip,
        section:has([data-stage="brainShift"]) .intro-skip {
          opacity: 0.7;
          transition-delay: 1200ms;
        }
        /* Hide the skip prompt once the intro is done. */
        section:has([data-stage="final"]) .intro-skip {
          opacity: 0;
        }

        /* Navbar slides down at the end. */
        .intro-navbar {
          transform: translateY(-100%);
          opacity: 0;
          transition:
            transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 500ms ease-out;
        }
        .intro-navbar[data-stage="final"] {
          transform: translateY(0);
          opacity: 1;
        }

        /* Rest of the page is revealed only after the intro. */
        .intro-rest {
          opacity: 0;
          transition: opacity 800ms ease-out 200ms;
          pointer-events: none;
        }
        .intro-rest[data-stage="final"] {
          opacity: 1;
          pointer-events: auto;
        }

        /* If the user has the reduced-motion preference, skip straight to final. */
        @media (prefers-reduced-motion: reduce) {
          .intro-curtain,
          .intro-text-row,
          .intro-navbar,
          .intro-rest {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-4">
        {title}
      </p>
      <ul className="space-y-2.5 text-sm">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="text-muted hover:text-ink transition-colors"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
