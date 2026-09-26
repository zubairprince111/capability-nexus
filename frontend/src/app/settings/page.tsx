"use client";

// Account settings — email, password, session.

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { MonoLabel, Notice } from "@/components/ui/Bits";
import { useAuth } from "@/lib/auth-context";
import {
  ApiError,
  changeEmail,
  changePassword,
  describeApiError,
} from "@/lib/api-helpers";

const inputCls =
  "w-full bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan";

function PageBar() {
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Settings
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            Account
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

function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (next.length < 8) return setError("New password must be at least 8 characters.");
    if (next !== confirm) return setError("New passwords do not match.");
    setBusy(true);
    try {
      await changePassword(current, next);
      setDone(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      if (err instanceof ApiError && err.code === "invalid_credentials") {
        setError("Current password is incorrect.");
      } else {
        setError(describeApiError(err));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="cp-current" className="block text-sm font-medium text-ink mb-1.5">
          Current password
        </label>
        <input
          id="cp-current"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputCls}
          required
        />
      </div>
      <div>
        <label htmlFor="cp-new" className="block text-sm font-medium text-ink mb-1.5">
          New password
        </label>
        <input
          id="cp-new"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputCls}
          required
          minLength={8}
        />
      </div>
      <div>
        <label htmlFor="cp-confirm" className="block text-sm font-medium text-ink mb-1.5">
          Confirm new password
        </label>
        <input
          id="cp-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputCls}
          required
          minLength={8}
        />
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {done && <Notice kind="ok">Password changed.</Notice>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}

function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    setBusy(true);
    try {
      await changeEmail(newEmail.trim(), password);
      setDone(true);
      setNewEmail("");
      setPassword("");
    } catch (err) {
      if (err instanceof ApiError && err.code === "invalid_credentials") {
        setError("Password is incorrect.");
      } else if (err instanceof ApiError && err.code === "email_already_registered") {
        setError("That email is already in use.");
      } else {
        setError(describeApiError(err));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <p className="text-[13px] text-muted">
        Currently{" "}
        <span className="font-mono text-ink-soft">{currentEmail}</span>
      </p>
      <div>
        <label htmlFor="ce-email" className="block text-sm font-medium text-ink mb-1.5">
          New email
        </label>
        <input
          id="ce-email"
          type="email"
          autoComplete="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className={inputCls}
          required
        />
      </div>
      <div>
        <label htmlFor="ce-pass" className="block text-sm font-medium text-ink mb-1.5">
          Current password
        </label>
        <input
          id="ce-pass"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          required
        />
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {done && <Notice kind="ok">Email updated — refresh to see it.</Notice>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Updating…" : "Change email"}
      </button>
    </form>
  );
}

function SettingsInner() {
  const { user, logout } = useAuth();
  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-12">
      <PageBar />

      <p className="text-[13px] text-muted leading-relaxed max-w-2xl mb-12">
        Manage the credentials on your account. Sessions on other devices refresh
        automatically; logging out clears this device.
      </p>

      <section className="mb-14">
        <header className="mb-5">
          <MonoLabel>Email</MonoLabel>
          <p className="text-[13px] text-muted mt-2 max-w-md">
            Change the email you sign in with. Confirmation requires your password.
          </p>
        </header>
        {user ? (
          <ChangeEmailForm currentEmail={user.email} />
        ) : (
          <p className="text-[13px] text-muted">Sign in to change your email.</p>
        )}
      </section>

      <section className="mb-14 pt-10 border-t border-hairline">
        <header className="mb-5">
          <MonoLabel>Password</MonoLabel>
          <p className="text-[13px] text-muted mt-2 max-w-md">
            8 characters or more. We don&apos;t send reset emails for changes — you&apos;ll
            do it here.
          </p>
        </header>
        <ChangePasswordForm />
      </section>

      <section className="pt-10 border-t border-hairline">
        <header className="mb-5">
          <MonoLabel>Session</MonoLabel>
          <p className="text-[13px] text-muted mt-2 max-w-md">
            Log out of this device. Other devices stay signed in until they each
            expire or are signed out.
          </p>
        </header>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center justify-center font-medium transition-colors rounded-full border border-error-red/40 text-error-red hover:bg-error-red/10 px-5 py-2 text-sm"
        >
          Log out
        </button>
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsInner />
    </AppShell>
  );
}
