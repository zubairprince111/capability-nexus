"use client";

// Pending invitations — consent in place to share skills with the org.

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import {
  describeApiError,
  giveOrgConsent,
  listMyInvitations,
  type InvitationRead,
} from "@/lib/api-helpers";

function PageBar() {
  return (
    <div className="sticky top-0 z-20 -mx-6 px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Invitations
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            Teams
          </span>
        </div>
        <Link
          href="/organizations"
          className="ul-hover text-sm text-muted hover:text-ink transition-colors hidden sm:inline-block"
        >
          ← All organizations
        </Link>
      </div>
    </div>
  );
}

function Inner() {
  const [items, setItems] = useState<InvitationRead[] | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await listMyInvitations());
    } catch (err) {
      setError(describeApiError(err));
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function consent(orgId: string) {
    setBusyId(orgId);
    setError("");
    setInfo("");
    try {
      await giveOrgConsent(orgId);
      setInfo("Consent recorded — your skills now count toward this organization.");
      await load();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="max-w-[960px] mx-auto px-6 pt-6 pb-12">
      <PageBar />

      {error && (
        <div className="mb-8 max-w-2xl">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {info && (
        <div className="mb-8 max-w-2xl">
          <Notice kind="ok">{info}</Notice>
        </div>
      )}

      {items === null ? (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <section className="rounded-md border border-border-light bg-stone-2 px-6 py-10 text-center">
          <p className="text-[14px] text-ink font-medium">
            You have no pending invitations.
          </p>
          <p className="text-[13px] text-muted mt-1.5 max-w-md mx-auto">
            When an organization invites you, it shows up here for your consent.
          </p>
          <p className="mt-5">
            <Link
              href="/organizations"
              className="text-[13px] text-brand-emerald hover:text-brand-mint"
            >
              Browse your organizations →
            </Link>
          </p>
        </section>
      ) : (
        <>
          <p className="text-[13px] text-muted leading-relaxed max-w-2xl mb-7">
            Each organization below has invited you. Consent lets the team
            count your claimed skills in their aggregate view — until then your
            claims are only visible to you.
          </p>

          <ul className="rounded-md border border-border-light divide-y divide-hairline bg-stone-2 stagger">
            {items.map((inv) => (
              <li
                key={inv.member_id}
                className="anim-fade-up px-5 py-4 flex items-center justify-between gap-4 flex-wrap hover:bg-elevated transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-ink font-medium">{inv.organization_name}</p>
                  <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-1">
                    Invitation{" "}
                    {inv.invited_at
                      ? `· ${new Date(inv.invited_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`
                      : "· pending"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/organizations/${inv.organization_id}`}
                    className="text-[13px] text-muted hover:text-ink underline underline-offset-4"
                  >
                    Open org
                  </Link>
                  <button
                    type="button"
                    onClick={() => consent(inv.organization_id)}
                    disabled={busyId === inv.organization_id}
                    className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
                  >
                    {busyId === inv.organization_id ? "Saving…" : "Consent"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-6 max-w-2xl">
            Consent is per organization and revocable later
          </p>
        </>
      )}
    </main>
  );
}

export default function InvitationsPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}
