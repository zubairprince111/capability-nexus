"use client";

// Signup — split-screen dark layout matching the login page.
// POST /auth/signup; backend sends a verification email.

import { Suspense, useState } from "react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import {
  Field,
  inputClass,
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import { describeApiError, login, setAuthTokens, signup } from "@/lib/api-helpers";

function SignupInner() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await signup(name.trim(), email.trim(), password);
      if (res.access_token) {
        setAuthTokens(res.access_token, res.refresh_token);
      } else {
        const loginRes = await login(email.trim(), password);
        setAuthTokens(loginRes.access_token, loginRes.refresh_token);
      }
      window.location.href = "/profile/me?setup=1";
    } catch (err) {
      setError(describeApiError(err));
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row font-sans">
      {/* LEFT — branded panel */}
      <aside className="hidden lg:flex lg:w-1/2 border-r border-hairline bg-stone p-12 flex-col justify-between relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
          }}
        />

        <div className="relative z-10">
          <Logo href="/" size={120} ariaLabel="AI5K home" />
        </div>

        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-emerald" />
            <span className="text-micro font-mono uppercase tracking-[0.2em] text-brand-emerald">
              Capability Network
            </span>
          </div>

          <h2
            className="font-display font-normal text-ink"
            style={{ fontSize: "clamp(2.25rem, 4vw, 3rem)", lineHeight: 1.05, letterSpacing: "-0.015em" }}
          >
            Evidence-first
            <br />
            <span className="text-muted font-light">readiness, in minutes.</span>
          </h2>

          <div className="space-y-4 pt-4 border-t border-hairline font-mono text-micro text-muted">
            {[
              "Submit CV, GitHub, Upwork, and Fiverr — we fetch and score each.",
              "Per-source breakdown: ok, failed, or skipped — no silent gaps.",
              "Re-run after you change a profile or claim a new skill.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-brand-emerald font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 font-mono text-micro text-muted-2 flex items-center justify-between border-t border-hairline pt-6">
          <span>AI5K Network Inc.</span>
          <span>Profile Readiness Platform</span>
        </div>
      </aside>

      {/* RIGHT — form */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-canvas">
        <div className="flex items-center justify-between w-full mb-8 lg:mb-0">
          <Link href="/" className="lg:hidden" aria-label="AI5K home">
            <Logo size={56} href={null} />
          </Link>
          <div className="text-micro font-mono tracking-[0.18em] ml-auto">
            <span className="text-muted-2 mr-2">Already have one?</span>
            <Link
              href="/login"
              className="text-brand-emerald hover:text-brand-mint transition-colors font-medium"
            >
              LOG IN
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="space-y-8">
            <div>
              <MonoLabel className="block mb-3">Create account</MonoLabel>
              <h1
                className="font-display font-normal text-ink mb-2"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.15 }}
              >
                Set up AI5K.
              </h1>
              <p className="text-micro font-mono text-muted">
                One account for the whole platform
              </p>
            </div>

            {error && <Notice kind="error">{error}</Notice>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Full name" htmlFor="name" required>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email Address" htmlFor="email" required>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Password" htmlFor="password" required hint="at least 8 characters">
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass}
                />
              </Field>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-colors rounded-sm bg-brand-green hover:bg-brand-emerald text-canvas px-5 py-3 text-sm tracking-[0.18em] uppercase font-mono disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Spinner className="!w-4 !h-4 !border-canvas/40 !border-t-canvas" />
                    Creating…
                  </>
                ) : (
                  <>CREATE ACCOUNT →</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-micro font-mono text-muted-2 text-center lg:text-left pt-4 border-t border-hairline">
          © 2026 AI5K Network Inc. All rights reserved.
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
      <SignupInner />
    </Suspense>
  );
}
