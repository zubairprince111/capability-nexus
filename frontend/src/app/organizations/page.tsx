"use client";

// Organizations — list user's orgs + invitations shortcut + create form.

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Chip,
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import {
  createOrganization,
  describeApiError,
  listMyInvitations,
  listMyOrganizations,
  normalizeUrl,
  type InvitationRead,
  type OrganizationRead,
} from "@/lib/api-helpers";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128);
}

function PageBar() {
  return (
    <div className="sticky top-0 z-20 -mx-6 px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Organizations
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            Teams
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

function CreateOrgForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!name.trim()) return;
    setCreating(true);
    try {
      const created = await createOrganization({
        name: name.trim(),
        slug: slug.trim() || null,
        description: description.trim() || null,
        website_url: websiteUrl.trim() ? normalizeUrl(websiteUrl) : null,
      });
      setInfo(`Created “${created.name}”.`);
      setName(""); setSlug(""); setSlugTouched(false); setDescription(""); setWebsiteUrl("");
      setTimeout(() => {
        window.location.href = `/organizations/${created.id}`;
      }, 500);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "organization_slug_taken") setError("That slug is already in use.");
      else if (code === "organization_slug_invalid") setError("Slug must be lowercase letters, digits, and dashes.");
      else setError(describeApiError(err));
      setCreating(false);
    }
  }

  const inputCls =
    "w-full bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan";

  return (
    <form onSubmit={submit} className="space-y-5 max-w-xl">
      <div className="grid sm:grid-cols-[1.6fr_1fr] gap-3">
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-ink mb-1.5">
            Organization name
          </label>
          <input
            id="orgName"
            type="text"
            required
            maxLength={255}
            placeholder="e.g. Nova Solutions"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="orgSlug" className="block text-sm font-medium text-ink mb-1.5">
            Slug <span className="font-normal text-muted">— permanent</span>
          </label>
          <input
            id="orgSlug"
            type="text"
            maxLength={128}
            placeholder="nova-solutions"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="orgDesc" className="block text-sm font-medium text-ink mb-1.5">
          Description
        </label>
        <textarea
          id="orgDesc"
          rows={3}
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls + " resize-none"}
        />
      </div>

      <div>
        <label htmlFor="orgSite" className="block text-sm font-medium text-ink mb-1.5">
          Website <span className="font-normal text-muted">— https:// added if missing</span>
        </label>
        <input
          id="orgSite"
          type="text"
          inputMode="url"
          maxLength={2048}
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {info && <Notice kind="ok">{info}</Notice>}

      <div>
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create organization"}
          <span aria-hidden className="ml-1.5">→</span>
        </button>
        <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-3 max-w-md">
          You become the org admin
        </p>
      </div>
    </form>
  );
}

function OrgsInner() {
  const [orgs, setOrgs] = useState<OrganizationRead[] | null>(null);
  const [invitations, setInvitations] = useState<InvitationRead[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listMyOrganizations(), listMyInvitations()])
      .then(([orgList, invites]) => {
        setOrgs(orgList);
        setInvitations(invites);
      })
      .catch((err) => setError(describeApiError(err)));
  }, []);

  return (
    <main className="max-w-[1100px] mx-auto px-6 pt-6 pb-12">
      <PageBar />

      {error && (
        <div className="mb-8 max-w-2xl">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {/* Invitations shortcut */}
      {invitations.length > 0 && (
        <Link
          href="/organizations/invitations"
          className="grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-4 rounded-md border border-brand-emerald/30 bg-brand-emerald/5 hover:bg-brand-emerald/10 transition-colors mb-8"
        >
          <span aria-hidden className="size-2 rounded-full bg-brand-emerald" />
          <div>
            <p className="text-ink font-medium">
              {invitations.length} pending invitation
              {invitations.length === 1 ? "" : "s"}
            </p>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-0.5">
              Respond to share your skills with a team
            </p>
          </div>
          <span className="text-[13px] text-brand-emerald">Review →</span>
        </Link>
      )}

      {/* Two-column: list + create form */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* List */}
        <section className="rounded-md border border-border-light bg-stone-2 overflow-hidden">
          <div className="flex items-baseline justify-between px-5 py-3 border-b border-hairline">
            <div>
              <MonoLabel>Your organizations</MonoLabel>
              <p className="text-[12.5px] text-muted mt-0.5">
                Teams and pods you&apos;re a member of.
              </p>
            </div>
            <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
              {orgs === null ? "…" : orgs.length}
            </p>
          </div>

          {orgs === null ? (
            <div className="py-10 flex justify-center">
              <Spinner />
            </div>
          ) : orgs.length === 0 ? (
            <p className="px-5 py-8 text-[13.5px] text-muted">
              You&apos;re not part of any organization yet — create one on the right.
            </p>
          ) : (
            <ul className="divide-y divide-hairline">
              {orgs.map((org, i) => (
                <li key={org.id} className="anim-fade-up" style={{ animationDelay: `${100 + i * 60}ms` }}>
                  <Link
                    href={`/organizations/${org.id}`}
                    className="group relative flex items-center justify-between gap-4 px-5 py-4 hover:bg-elevated transition-all duration-300 ease-out-expo"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-brand-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ boxShadow: "0 0 8px rgba(16,185,129,0.6)" }}
                    />
                    <div className="min-w-0">
                      <p className="text-ink font-medium truncate">{org.name}</p>
                      <p className="text-[12.5px] text-muted mt-0.5 truncate">
                        <span className="font-mono">/organizations/{org.slug}</span>
                        {org.description && (
                          <>
                            <span className="mx-2 text-hairline">·</span>
                            {org.description.length > 80
                              ? `${org.description.slice(0, 80)}…`
                              : org.description}
                          </>
                        )}
                      </p>
                    </div>
                    <Chip tone={org.status === "active" ? "green" : "neutral"}>
                      {org.status}
                    </Chip>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Create form */}
        <section className="rounded-md border border-border-light bg-stone-2 p-5">
          <div className="mb-5">
            <MonoLabel>Create new</MonoLabel>
            <p className="text-[12.5px] text-muted mt-1">
              You become the admin and can invite members.
            </p>
          </div>
          <CreateOrgForm />
        </section>
      </div>
    </main>
  );
}

export default function OrganizationsPage() {
  return (
    <AppShell>
      <OrgsInner />
    </AppShell>
  );
}
