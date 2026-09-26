"use client";

// My profile — create-or-edit. GET /profiles/me + POST /profiles (on 404) or
// PATCH /profiles/{id}. Doubles as onboarding (?setup=1).

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Chip,
  Field,
  inputClass,
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import { AuroraBackdrop, Surface } from "@/components/ui/Premium";
import {
  createProfile,
  describeApiError,
  getMyProfile,
  normalizeUrl,
  updateProfile,
  type ProfileRead,
} from "@/lib/api-helpers";

const MAX_ROLE_HINT = 10;
const MAX_LINKS = 8;

function PageBar({ isNew }: { isNew: boolean }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            {isNew ? "Create profile" : "Edit profile"}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            Profile
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

function ProfileInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setupMode = searchParams.get("setup") === "1";

  const [profile, setProfile] = useState<ProfileRead | null>(null);
  const [isNew, setIsNew] = useState(setupMode);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [jobRoles, setJobRoles] = useState("");
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [visibility, setVisibility] = useState<"private" | "public">("private");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setProfile(p);
        setIsNew(false);
        setDisplayName(p.display_name);
        setHeadline(p.headline ?? "");
        setJobRoles(p.job_roles.join(", "));
        setLinks(p.portfolio_links.map((l) => ({ label: l.label, url: l.url })));
        setVisibility(p.visibility);
      })
      .catch((err) => {
        if ((err as { status?: number })?.status === 404) {
          setIsNew(true);
          setLoadError("");
        } else {
          setLoadError(describeApiError(err));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setSaved(false);
    setSaving(true);
    const body = {
      display_name: displayName.trim(),
      headline: headline.trim() || null,
      job_roles: jobRoles
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_ROLE_HINT),
      portfolio_links: links
        .filter((l) => l.label.trim() && l.url.trim())
        .map((l) => ({
          label: l.label.trim().slice(0, 100),
          url: normalizeUrl(l.url),
        }))
        .slice(0, MAX_LINKS),
      visibility,
    };
    try {
      if (isNew) {
        const created = await createProfile(body as { display_name: string });
        setProfile(created);
        setIsNew(false);
      } else if (profile) {
        const updated = await updateProfile(profile.id, body);
        setProfile(updated);
      }
      setSaved(true);
      if (isNew) {
        setTimeout(() => router.push("/dashboard"), 600);
      }
    } catch (err) {
      setSaveError(describeApiError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-12">
      <PageBar isNew={isNew} />

      {loading && (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      )}
      {loadError && (
        <div className="mb-8 max-w-2xl">
          <Notice kind="error">{loadError}</Notice>
        </div>
      )}

      {!loading && !loadError && (
        <form onSubmit={submit} className="space-y-8 stagger">
          {saveError && <Notice kind="error">{saveError}</Notice>}
          {saved && (
            <Notice kind="ok">
              {isNew
                ? "Profile created — taking you to your dashboard."
                : "Profile saved."}
            </Notice>
          )}

          <Surface padding="md" className="anim-fade-up">
            <div className="mb-5">
              <MonoLabel className="block mb-2">Identity</MonoLabel>
              <p className="text-[12.5px] text-muted">
                How you appear across AI5K and on your public profile.
              </p>
            </div>
            <div className="space-y-5">
              <Field label="Display name" htmlFor="pName" required>
                <input
                  id="pName"
                  type="text"
                  required
                  maxLength={255}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Headline" htmlFor="pHeadline" hint="role + domain + outcome">
                <input
                  id="pHeadline"
                  type="text"
                  maxLength={255}
                  placeholder="e.g. ML engineer for retrieval systems"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Job roles"
                htmlFor="pRoles"
                hint={`comma-separated, up to ${MAX_ROLE_HINT}`}
              >
                <input
                  id="pRoles"
                  type="text"
                  placeholder="ML Engineer, Data Scientist"
                  value={jobRoles}
                  onChange={(e) => setJobRoles(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Surface>

          <Surface padding="md" className="anim-fade-up">
            <div className="mb-5">
              <MonoLabel className="block mb-2">Visibility</MonoLabel>
              <p className="text-[12.5px] text-muted">
                Public profiles are visible to anyone with the link. Your skills
                are never shared with an organization without your consent.
              </p>
            </div>
            <div role="radiogroup" aria-label="Profile visibility" className="grid sm:grid-cols-2 gap-2.5">
              {(["private", "public"] as const).map((v) => {
                const active = visibility === v;
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setVisibility(v)}
                    className={`group text-left rounded-md border p-4 transition-all duration-300 ease-out-expo hover:-translate-y-[1px] ${
                      active
                        ? "border-brand-emerald bg-brand-emerald/5 shadow-[0_0_0_1px_rgba(16,185,129,0.30),0_24px_60px_-30px_rgba(16,185,129,0.35)]"
                        : "border-border-light bg-stone hover:bg-stone-2 hover:border-border-glow"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-ink font-medium capitalize">{v}</p>
                      <span
                        aria-hidden
                        className={`size-3 rounded-full border transition-all duration-300 ${
                          active
                            ? "bg-brand-emerald border-brand-emerald shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                            : "border-muted-2"
                        }`}
                      />
                    </div>
                    <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-1.5">
                      {v === "private" ? "Only you" : "Anyone with the link"}
                    </p>
                  </button>
                );
              })}
            </div>
          </Surface>

          <Surface padding="md" className="anim-fade-up">
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <MonoLabel className="block mb-1.5">Portfolio links</MonoLabel>
                <p className="text-[12.5px] text-muted">
                  Up to {MAX_LINKS} — public work, demos, talks.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  links.length < MAX_LINKS && setLinks([...links, { label: "", url: "" }])
                }
                className="ul-hover text-[13px] text-brand-emerald hover:text-brand-mint"
              >
                + Add link
              </button>
            </div>

            {links.length === 0 ? (
              <p className="text-[13px] text-muted">No links yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i} className="anim-fade-up grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2.5 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      maxLength={100}
                      value={link.label}
                      aria-label={`Link ${i + 1} label`}
                      onChange={(e) =>
                        setLinks(
                          links.map((l, idx) =>
                            idx === i ? { ...l, label: e.target.value } : l,
                          ),
                        )
                      }
                      className="bg-canvas border border-border-light rounded-md px-3 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
                    />
                    <input
                      type="text"
                      inputMode="url"
                      placeholder="example.com/page"
                      value={link.url}
                      aria-label={`Link ${i + 1} URL`}
                      onChange={(e) =>
                        setLinks(
                          links.map((l, idx) =>
                            idx === i ? { ...l, url: e.target.value } : l,
                          ),
                        )
                      }
                      className="bg-canvas border border-border-light rounded-md px-3 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
                    />
                    <button
                      type="button"
                      onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
                      className="ul-hover text-[12.5px] text-muted hover:text-error-red transition-colors px-2"
                      aria-label={`Remove link ${i + 1}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Surface>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : isNew
                  ? "Create profile"
                  : "Save profile"}
              <span aria-hidden className="ml-1.5">→</span>
            </button>
            {profile && (
              <Chip tone="neutral">
                Created {new Date(profile.created_at).toLocaleDateString()}
              </Chip>
            )}
          </div>
        </form>
      )}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AppShell>
      <Suspense fallback={<Spinner />}>
        <ProfileInner />
      </Suspense>
    </AppShell>
  );
}
