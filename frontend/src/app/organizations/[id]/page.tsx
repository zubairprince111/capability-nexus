"use client";

// Organization detail — name/description/website + members + aggregate skills.
// Backend: GET/PATCH /organizations/{id}, GET/POST/DELETE /members, /skills.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import {
  Chip,
  Field,
  inputClass,
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import {
  aggregateOrgSkills,
  describeApiError,
  getOrganization,
  giveOrgConsent,
  inviteOrgMember,
  listOrgMembers,
  normalizeUrl,
  removeOrgMember,
  updateOrganization,
  type AggregateSkillRow,
  type MemberRead,
  type OrganizationRead,
} from "@/lib/api-helpers";

function PageBar({ org }: { org: OrganizationRead }) {
  return (
    <div className="sticky top-0 z-20 -mx-6 px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight truncate">
            {org.name}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            Organization
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

function MemberRow({
  m,
  onRemove,
}: {
  m: MemberRead;
  onRemove: (m: MemberRead) => void;
}) {
  const initials = (m.user.full_name ?? "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <li className="px-4 py-3.5 flex items-center gap-4 flex-wrap">
      <span
        aria-hidden
        className="inline-flex items-center justify-center size-8 rounded-full bg-stone border border-border-light text-ink-soft text-[12px] font-mono shrink-0"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ink font-medium truncate">{m.user.full_name}</p>
        <p className="text-[12.5px] text-muted truncate">{m.user.email}</p>
      </div>
      <Chip tone={m.consent_given ? "green" : "neutral"}>
        {m.consent_given ? "consented" : "no consent"}
      </Chip>
      <Chip tone={m.status === "active" ? "green" : "neutral"}>{m.status}</Chip>
      <button
        type="button"
        onClick={() => onRemove(m)}
        className="text-[12.5px] text-muted hover:text-error-red transition-colors shrink-0"
      >
        Remove
      </button>
    </li>
  );
}

function OrgDetailInner() {
  const params = useParams();
  const orgId = String(params.id);

  const [org, setOrg] = useState<OrganizationRead | null>(null);
  const [members, setMembers] = useState<MemberRead[] | null>(null);
  const [aggregated, setAggregated] = useState<AggregateSkillRow[] | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const o = await getOrganization(orgId);
      setOrg(o);
      setName(o.name);
      setDescription(o.description ?? "");
      setWebsiteUrl(o.website_url ?? "");
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "permission_denied") setError("This organization is private to its members.");
      else setError(describeApiError(err));
      return;
    }
    try {
      const ms = await listOrgMembers(orgId);
      setMembers(ms);
    } catch {
      setMembers([]);
    }
    try {
      const sk = await aggregateOrgSkills(orgId);
      setAggregated(sk);
    } catch {
      setAggregated([]);
    }
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveEdits(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await updateOrganization(orgId, {
        name: name.trim(),
        description: description.trim() || null,
        website_url: websiteUrl.trim() ? normalizeUrl(websiteUrl) : null,
      });
      setOrg(updated);
      setEditing(false);
      setInfo("Saved.");
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function doInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    setInfo("");
    try {
      await inviteOrgMember(orgId, inviteEmail.trim());
      setInviteEmail("");
      setInfo("Invitation sent.");
      await load();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setInviting(false);
    }
  }

  async function removeMember(m: MemberRead) {
    setError("");
    setInfo("");
    try {
      await removeOrgMember(orgId, m.id);
      setInfo("Member removed.");
      await load();
    } catch (err) {
      setError(describeApiError(err));
    }
  }

  async function consentNow() {
    try {
      await giveOrgConsent(orgId);
      await load();
    } catch (err) {
      setError(describeApiError(err));
    }
  }

  if (error && !org) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-sm text-muted mb-6">
          <Link href="/organizations" className="text-brand-emerald hover:text-brand-mint">
            ← All organizations
          </Link>
        </p>
        <Notice kind="error">{error}</Notice>
      </main>
    );
  }

  if (!org) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <Spinner />
      </main>
    );
  }

  const self = members?.find((m) => m.user.email);

  return (
    <main className="max-w-[1100px] mx-auto px-6 pt-6 pb-12">
      <PageBar org={org} />

      <header className="mb-8 max-w-2xl">
        <h2
          className="font-display text-ink"
          style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}
        >
          {org.description ?? "No description yet."}
        </h2>
        <p className="text-[12.5px] text-muted mt-3">
          <span className="font-mono">/organizations/{org.slug}</span>
          {org.website_url && (
            <>
              <span className="mx-2 text-hairline">·</span>
              <a
                href={org.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-emerald hover:text-brand-mint"
              >
                {org.website_url}
              </a>
            </>
          )}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="text-[13px] text-brand-emerald hover:text-brand-mint underline underline-offset-4 decoration-hairline hover:decoration-brand-mint"
          >
            {editing ? "Cancel edit" : "Edit details"}
          </button>
        </div>
      </header>

      {editing && (
        <form
          onSubmit={saveEdits}
          className="mb-12 max-w-xl space-y-5 rounded-md border border-border-light bg-stone-2 p-6"
        >
          <Field label="Name" htmlFor="org-name" required>
            <input
              id="org-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Description" htmlFor="org-desc">
            <textarea
              id="org-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Website" htmlFor="org-site">
            <input
              id="org-site"
              type="text"
              inputMode="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-[13px] text-muted hover:text-ink underline underline-offset-4"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <div className="mb-6"><Notice kind="error">{error}</Notice></div>}
      {info && <div className="mb-6"><Notice kind="ok">{info}</Notice></div>}

      {/* Members */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <MonoLabel>Members</MonoLabel>
            <p className="text-[12.5px] text-muted mt-0.5">
              Admin can invite, remove, and consent on behalf of themselves.
            </p>
          </div>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            {members === null ? "…" : members.length}
          </p>
        </div>

        {members === null ? (
          <div className="py-8 flex justify-center">
            <Spinner />
          </div>
        ) : members.length === 0 ? (
          <p className="text-[13.5px] text-muted">No members yet.</p>
        ) : (
          <ul className="rounded-md border border-border-light divide-y divide-hairline bg-stone-2 mb-5">
            {members.map((m) => (
              <MemberRow key={m.id} m={m} onRemove={removeMember} />
            ))}
          </ul>
        )}

        {self && !self.consent_given && (
          <div className="mb-6">
            <Notice kind="info">
              You haven&apos;t consented to share your claimed skills here yet —
              doing so lets them count toward the organization&apos;s aggregate view.{" "}
              <button
                type="button"
                onClick={consentNow}
                className="ml-2 inline-flex items-center bg-ink text-canvas rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white transition-colors"
              >
                Consent
              </button>
            </Notice>
          </div>
        )}

        <form onSubmit={doInvite} className="max-w-md flex items-center gap-2.5">
          <input
            type="email"
            placeholder="Invite by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
          />
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
          >
            {inviting ? "Inviting…" : "Invite"}
          </button>
        </form>
      </section>

      {/* Aggregate skills */}
      <section>
        <div className="mb-3">
          <MonoLabel>Aggregate skills</MonoLabel>
          <p className="text-[12.5px] text-muted mt-1 max-w-2xl">
            Skills each member has consented to share — counts include both{" "}
            <span className="font-mono text-ink-soft">self_declared</span> and{" "}
            <span className="font-mono text-ink-soft">evidenced</span> claims.
          </p>
        </div>

        {aggregated === null ? (
          <div className="py-8 flex justify-center">
            <Spinner />
          </div>
        ) : aggregated.length === 0 ? (
          <p className="text-[13.5px] text-muted">
            No consented members have claimed skills yet.
          </p>
        ) : (
          <ul className="rounded-md border border-border-light divide-y divide-hairline bg-stone-2">
            {aggregated.map((row) => (
              <li key={row.skill_id} className="px-4 py-3.5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-ink font-medium truncate">{row.name}</p>
                    {row.category && (
                      <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-0.5">
                        {row.category}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Chip tone="neutral">
                      {row.member_count} member{row.member_count === 1 ? "" : "s"}
                    </Chip>
                    <Chip tone="green">{row.evidenced_count} evidenced</Chip>
                    <Chip tone="amber">{row.self_declared_count} self</Chip>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default function OrgDetailPage() {
  return (
    <AppShell>
      <OrgDetailInner />
    </AppShell>
  );
}
