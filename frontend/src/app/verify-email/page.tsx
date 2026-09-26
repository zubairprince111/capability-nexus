"use client";

// Email verification landing page.
// Backend patterns:
//   /verify-email?token=…  (signed token in the URL)
//   /auth/email-link?token=… (magic-link / hybrid verify)

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/Bits";

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const state = params.get("state");
  const err = params.get("error");

  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md">
        <MonoLabel className="block mb-3">Verification</MonoLabel>

        {token ? (
          <>
            <h1 className="text-section-heading font-display font-normal text-ink mb-3">
              Verifying your email…
            </h1>
            <p className="text-body text-ink-soft">
              If your browser doesn&apos;t auto-redirect, click below.
            </p>
            <p className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard">Open dashboard</ButtonLink>
              <ButtonLink href="/login" variant="outline">
                Log in
              </ButtonLink>
            </p>
          </>
        ) : state === "success" ? (
          <>
            <h1 className="text-section-heading font-display font-normal text-ink mb-3">
              Email verified.
            </h1>
            <p className="text-body text-ink-soft">
              Log in to finish setting things up.
            </p>
            <ButtonLink href="/login" className="mt-8">
              Continue to login
            </ButtonLink>
          </>
        ) : state === "invalid" || err ? (
          <>
            <h1 className="text-section-heading font-display font-normal text-ink mb-3">
              This link is invalid or has expired.
            </h1>
            <p className="text-body text-ink-soft">
              Use a fresh link from your email, or request a new one.
            </p>
            <Link
              href={`/verify-email/resend${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="text-brand-emerald hover:text-brand-mint text-sm mt-8 block"
            >
              Resend verification email →
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-section-heading font-display font-normal text-ink mb-3">
              Check your inbox.
            </h1>
            <p className="text-body text-ink-soft">
              We sent a verification link to{" "}
              <span className="text-ink font-medium">{email ?? "your email"}</span>.
              Click it to finish.
            </p>
            <Link
              href={`/verify-email/resend${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="text-brand-emerald hover:text-brand-mint text-sm mt-8 block"
            >
              Resend verification email →
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
