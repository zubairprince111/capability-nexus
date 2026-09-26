"use client";

// Login — split-screen layout matching the AI5K branded auth surface.
// Left column: AI5K logo, capability-network mark, three numbered rules.
// Right column: brand-style auth form with mono labels and teal CTA.
// Backend: POST /auth/login. Backend errors surfaced inline.

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { Field, inputClass, MonoLabel, Notice, Spinner } from "@/components/ui/Bits";
import { ApiError, login, setAuthTokens } from "@/lib/api-helpers";
import { resolvePostLoginRoute } from "@/lib/post-login";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prefill = searchParams.get("email");
    if (prefill) setEmail(prefill);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await login(email.trim(), password);
      setAuthTokens(data.access_token, data.refresh_token);
      const next = await resolvePostLoginRoute();
      router.push(next);
    } catch (err) {
      if (err instanceof ApiError && err.code === "email_not_verified") {
        setError("Please verify your email before logging in.");
      } else if (err instanceof ApiError && err.code === "account_suspended") {
        setError("This account has been suspended.");
      } else if (err instanceof ApiError && err.code === "invalid_credentials") {
        setError("Incorrect email or password.");
      } else {
        setError((err as Error).message || "Login failed");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink flex flex-col lg:flex-row font-sans">
      {/* LEFT — branded panel */}
      <aside className="hidden lg:flex lg:w-1/2 border-r border-hairline bg-stone p-12 flex-col justify-between relative overflow-hidden">
        {/* faint grid */}
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

        {/* Top — AI5K logo */}
        <div className="relative z-10">
          <Logo href="/" size={120} ariaLabel="AI5K home" />
        </div>

        {/* Center brand statements */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-emerald" />
            <span className="text-micro font-mono uppercase tracking-[0.2em] text-brand-emerald">
              Capability Network
            </span>
          </div>

          <h2
            className="font-display text-ink"
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              fontWeight: 400,
            }}
          >
            Proven capability.
            <br />
            <span className="text-muted font-light">Zero self-declared claims.</span>
          </h2>

          <div className="space-y-4 pt-4 border-t border-hairline font-mono text-micro text-muted">
            <div className="flex items-start gap-3">
              <span className="text-brand-emerald font-semibold">01</span>
              <span>
                Verifiable execution logs and RAG benchmark evidence.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-emerald font-semibold">02</span>
              <span>
                Role-based access across Pro, Delivery Pod, and Buyer
                workspaces.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-emerald font-semibold">03</span>
              <span>
                Privileged operations console with real-time audit review.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 font-mono text-micro text-muted-2 flex items-center justify-between border-t border-hairline pt-6">
          <span>AI5K Network Inc.</span>
          <span>Profile Readiness Platform</span>
        </div>
      </aside>

      {/* RIGHT — auth form */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-canvas">
        {/* Mobile logo + alt-link */}
        <div className="flex items-center justify-between w-full mb-8 lg:mb-0">
          <Link href="/" className="lg:hidden" aria-label="AI5K home">
            <Logo size={56} href={null} />
          </Link>
          <div className="font-mono tracking-wider ml-auto text-micro">
            <span className="text-muted-2 mr-2">Need an account?</span>
            <Link
              href="/signup"
              className="text-brand-emerald hover:text-brand-mint transition-colors font-medium"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="space-y-8">
            <div>
              <h1
                className="text-ink mb-2 font-display"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  fontWeight: 400,
                }}
              >
                Sign in to AI5K
              </h1>
              <p className="font-mono text-micro text-muted">
                Enter your credentials. New here?{" "}
                <Link
                  href="/signup"
                  className="text-brand-emerald hover:text-brand-mint"
                >
                  Create an account →
                </Link>
              </p>
            </div>

            {error && <Notice kind="error">{error}</Notice>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Email Address" htmlFor="email" required>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className={`${inputClass} font-mono text-xs`}
                />
              </Field>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-ink"
                  >
                    Password
                  </label>
                  <Link
                    href="/login"
                    className="font-mono text-micro text-brand-emerald hover:text-brand-mint transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`${inputClass} font-mono text-xs`}
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full h-12 inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-none bg-brand-green hover:bg-brand-emerald text-canvas font-mono text-xs tracking-[0.18em] disabled:opacity-50 group"
              >
                {busy ? (
                  <>
                    <Spinner className="!w-4 !h-4 !border-canvas/40 !border-t-canvas" />
                    SIGNING IN…
                  </>
                ) : (
                  <>SIGN IN</>
                )}
                {!busy && (
                  <span className="group-hover:translate-x-1 transition-transform" aria-hidden>
                    →
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="font-mono text-micro text-muted-2 text-center lg:text-left pt-4 border-t border-hairline">
          © 2026 AI5K Network Inc. All rights reserved.
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
      <LoginInner />
    </Suspense>
  );
}
