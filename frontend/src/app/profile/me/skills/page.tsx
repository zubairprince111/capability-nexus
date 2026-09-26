"use client";

// Skill claims — claim what you can do, set proficiency, drop claims.
// Backend: GET /skills, POST/GET/PATCH/DELETE /profiles/{id}/skills
//
// Layout:
//   1. Slim page bar (eyebrow + title)
//   2. Add-skill composer (compact)
//   3. CV suggestions (when available)
//   4. Claims grid

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import CvSuggestions from "@/components/skills/CvSuggestions";
import { Chip, MonoLabel, Notice, Spinner } from "@/components/ui/Bits";
import { Surface } from "@/components/ui/Premium";
import {
  addSkillClaim,
  deleteSkillClaim,
  describeApiError,
  getMyProfile,
  listSkillClaims,
  listSkills,
  updateSkillClaim,
  type ProfileRead,
  type Skill,
  type SkillClaim,
} from "@/lib/api-helpers";

const PROFICIENCY = ["beginner", "intermediate", "advanced", "expert"] as const;
type Proficiency = (typeof PROFICIENCY)[number];

const PROFICIENCY_TONE: Record<Proficiency, "neutral" | "cyan" | "amber" | "green"> = {
  beginner: "neutral",
  intermediate: "cyan",
  advanced: "amber",
  expert: "green",
};

function PageBar({ count }: { count: number | null }) {
  return (
    <div className="sticky top-0 z-20 -mx-6 px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Skills
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            {count === null ? "Loading" : `${count} claimed`}
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

function SkillsEditor() {
  const [profile, setProfile] = useState<ProfileRead | null>(null);
  const [claims, setClaims] = useState<SkillClaim[] | null>(null);
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [query, setQuery] = useState("");
  const [proficiency, setProficiency] = useState<Proficiency>("intermediate");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        setProfile(p);
        const [cs, cat] = await Promise.all([listSkillClaims(p.id), listSkills()]);
        setClaims(cs);
        setCatalog(cat.data);
      } catch (err) {
        if ((err as { status?: number }).status === 404) {
          setError("Create your profile first to claim skills.");
        } else {
          setError(describeApiError(err));
        }
        setClaims([]);
      }
    })();
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !claims) return [];
    return catalog
      .filter((s) => s.name.toLowerCase().includes(q))
      .filter((s) => !claims.some((c) => c.skill_name.toLowerCase() === s.name.toLowerCase()))
      .slice(0, 6);
  }, [query, catalog, claims]);

  const grouped = useMemo(() => {
    if (!claims) return [] as [string, SkillClaim[]][];
    const m = new Map<string, SkillClaim[]>();
    const catBySkillId = new Map(catalog.map((s) => [s.id, s.category] as const));
    for (const c of claims) {
      const key = catBySkillId.get(c.skill_id) ?? "Uncategorised";
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(c);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [claims, catalog]);

  const refreshClaims = async (profileId: string) => setClaims(await listSkillClaims(profileId));

  async function claim(s: Skill | string) {
    if (!profile) return;
    setBusy(true);
    setError("");
    try {
      const body =
        typeof s === "string"
          ? { skill_name: s, proficiency_level: proficiency }
          : { skill_id: s.id, proficiency_level: proficiency };
      await addSkillClaim(profile.id, body);
      setQuery("");
      await refreshClaims(profile.id);
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function changeProficiency(c: SkillClaim, prof: Proficiency | null) {
    if (!profile) return;
    setError("");
    try {
      await updateSkillClaim(profile.id, c.id, prof ?? "");
      await refreshClaims(profile.id);
    } catch (err) {
      setError(describeApiError(err));
    }
  }

  async function drop(c: SkillClaim) {
    if (!profile) return;
    setError("");
    try {
      await deleteSkillClaim(profile.id, c.id);
      await refreshClaims(profile.id);
    } catch (err) {
      setError(describeApiError(err));
    }
  }

  if (claims === null) {
    return (
      <main className="max-w-[960px] mx-auto px-6 pt-6 pb-12">
        <PageBar count={null} />
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[960px] mx-auto px-6 pt-6 pb-12">
      <PageBar count={claims.length} />

      {error && (
        <div className="mb-8 max-w-2xl">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {/* Add */}
      <Surface padding="md" className="mb-8 anim-fade-up">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <MonoLabel className="block mb-1">Add a skill</MonoLabel>
            <p className="text-[12.5px] text-muted">
              Skills weighted into the readiness score.
            </p>
          </div>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value as Proficiency)}
            className="bg-canvas border border-border-light rounded-md px-3 py-2 text-[13.5px] text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
            aria-label="Proficiency"
          >
            {PROFICIENCY.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search the catalog or type a custom skill…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
        />

        {suggestions.length > 0 && (
          <ul className="mt-3 border border-border-light rounded-md divide-y divide-hairline bg-canvas stagger">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => claim(s)}
                  disabled={busy}
                  className="anim-fade-up w-full flex items-center justify-between px-4 py-2.5 text-left text-[13.5px] hover:bg-stone-2 hover:text-brand-emerald disabled:opacity-50 transition-colors"
                >
                  <span className="text-ink">{s.name}</span>
                  <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
                    {s.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() &&
          !suggestions.some((s) => s.name.toLowerCase() === query.trim().toLowerCase()) &&
          !claims.some((c) => c.skill_name.toLowerCase() === query.trim().toLowerCase()) && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => claim(query.trim())}
                disabled={busy}
                className="text-[13px] border border-ink rounded-full px-4 py-1.5 hover:bg-ink hover:text-canvas transition-all duration-300 disabled:opacity-50"
              >
                + Add &quot;{query.trim()}&quot; as a custom skill
              </button>
              <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-2">
                Custom skills don&apos;t match the catalog
              </p>
            </div>
          )}
      </Surface>

      {/* CV suggestions */}
      <div className="mb-10 anim-fade-up" style={{ animationDelay: "120ms" }}>
        <CvSuggestions onClaimed={() => profile && refreshClaims(profile.id)} />
      </div>

      {/* Claims */}
      <section className="anim-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[14px] font-medium text-ink inline-flex items-center gap-2">
            <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
            Your claims
          </h2>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            {claims.length}
          </p>
        </div>

        {claims.length === 0 ? (
          <Surface padding="lg" className="text-center">
            <p className="text-[14px] text-ink font-medium">
              You haven&apos;t claimed any skills yet.
            </p>
            <p className="text-[13px] text-muted mt-1.5 max-w-md mx-auto">
              Add a skill above. Evidenced claims count more toward your readiness score.
            </p>
          </Surface>
        ) : (
          <div className="space-y-6">
            {grouped.map(([cat, items], gi) => (
              <div key={cat} className="anim-fade-up" style={{ animationDelay: `${240 + gi * 80}ms` }}>
                <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mb-2 inline-flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-brand-emerald" aria-hidden />
                  {cat}
                </p>
                <Surface padding="none">
                  <ul className="divide-y divide-hairline">
                    {items.map((c) => (
                      <li
                        key={c.id}
                        className="anim-fade-up group px-4 py-3 flex items-center gap-3 flex-wrap hover:bg-elevated transition-colors"
                      >
                        <span className="text-[14px] text-ink font-medium min-w-[180px]">
                          {c.skill_name}
                        </span>
                        <Chip
                          tone={
                            c.proficiency_level
                              ? PROFICIENCY_TONE[c.proficiency_level as Proficiency] ?? "neutral"
                              : "neutral"
                          }
                        >
                          {c.proficiency_level ?? "—"}
                        </Chip>
                        <Chip tone={c.claim_type === "evidenced" ? "green" : "neutral"}>
                          {c.claim_type}
                        </Chip>
                        <div className="flex-1" />
                        <select
                          value={c.proficiency_level ?? ""}
                          onChange={(e) =>
                            changeProficiency(
                              c,
                              e.target.value ? (e.target.value as Proficiency) : null,
                            )
                          }
                          className="bg-canvas border border-border-light rounded-md px-2 py-1 text-[12.5px] text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan"
                          aria-label={`Proficiency for ${c.skill_name}`}
                        >
                          <option value="">— none —</option>
                          {PROFICIENCY.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => drop(c)}
                          className="ul-hover text-[12.5px] text-muted hover:text-error-red transition-colors"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </Surface>
              </div>
            ))}
          </div>
        )}

        <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-6 max-w-2xl">
          Evidenced skills are flipped from self-declared by a platform review
        </p>
      </section>

      <p className="mt-12 anim-fade-up" style={{ animationDelay: "320ms" }}>
        <Link
          href="/analyze"
          className="ul-hover text-[13px] text-brand-emerald hover:text-brand-mint"
        >
          Run a readiness check →
        </Link>
      </p>
    </main>
  );
}

export default function SkillsPage() {
  return (
    <AppShell>
      <SkillsEditor />
    </AppShell>
  );
}
