"use client";

// Resend verification email.

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Field, inputClass, MonoLabel, Notice } from "@/components/ui/Bits";
import { resendVerification } from "@/lib/api-helpers";

function ResendInner() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await resendVerification(email.trim());
      setDone(true);
    } catch (err) {
      setError((err as Error).message || "Could not resend.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md">
        <MonoLabel className="block mb-3">Resend verification</MonoLabel>

        {done ? (
          <>
            <h1 className="text-section-heading font-display font-normal text-ink mb-3">
              Sent.
            </h1>
            <p className="text-body text-ink-soft">
              If <span className="text-ink font-medium">{email}</span> exists, we&apos;ve sent a new link.
            </p>
            <Link
              href={`/verify-email?email=${encodeURIComponent(email)}`}
              className="text-brand-emerald hover:text-brand-mint text-sm mt-8 block"
            >
              Back to verify-email →
            </Link>
          </>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <Field label="Email" htmlFor="email" required>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            {error && <Notice kind="error">{error}</Notice>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {busy ? "Sending…" : "Resend"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResendPage() {
  return (
    <Suspense fallback={null}>
      <ResendInner />
    </Suspense>
  );
}
