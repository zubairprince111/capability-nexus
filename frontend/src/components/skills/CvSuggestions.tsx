"use client";

// "From your CV" — surfaces skills detected in the most recent readiness-check
// CV. The user can claim individual skills or claim all in one click.
// Backend routes: GET /profile-checks/cv/suggestions and POST /profiles/{id}/skills.

import { useEffect, useState } from "react";
import { MonoLabel, Notice, Spinner } from "@/components/ui/Bits";
import {
  addSkillClaim,
  describeApiError,
  getCvSkillSuggestions,
  getMyProfile,
  type CvSkillSuggestions,
} from "@/lib/api-helpers";

const LOADING = "loading";

export default function CvSuggestions({ onClaimed }: { onClaimed?: () => void }) {
  const [sug, setSug] = useState<CvSkillSuggestions | null | typeof LOADING>(LOADING);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [claimAllRunning, setClaimAllRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCvSkillSuggestions()
      .then((s) => setSug(s))
      .catch(() => setSug(null));
  }, []);

  async function claim(name: string) {
    setClaiming(name);
    setError("");
    try {
      const profile = await getMyProfile();
      await addSkillClaim(profile.id, { skill_name: name });
      const nextClaimed = [...claimed, name];
      setClaimed(nextClaimed);
      setFailed((prev) => prev.filter((f) => f !== name));
      setSug((prev) =>
        prev && prev !== LOADING
          ? {
              ...prev,
              suggested: prev.suggested.filter((s) => s !== name),
              already_claimed: [...prev.already_claimed, name],
            }
          : prev,
      );
      onClaimed?.();
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(code === "skill_already_claimed" ? "Already claimed." : describeApiError(err));
      setFailed((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setSug((prev) =>
        prev && prev !== LOADING ? { ...prev, suggested: prev.suggested.filter((s) => s !== name) } : prev,
      );
    } finally {
      setClaiming(null);
    }
  }

  async function claimAll() {
    if (!sug || sug === LOADING || sug.suggested.length === 0) return;
    setClaimAllRunning(true);
    setError("");
    for (const name of [...sug.suggested]) {
      await claim(name);
    }
    setClaimAllRunning(false);
  }

  if (sug === LOADING || sug === null || (sug.suggested.length === 0 && sug.already_claimed.length === 0)) {
    return null;
  }

  return (
    <section className="mt-14 border-t-2 border-ink pt-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <MonoLabel className="block">From your CV — {sug.filename}</MonoLabel>
          <p className="text-sm text-muted mt-1">
            Skills detected in your uploaded CV. Claim them to fold them into
            your readiness score.
          </p>
        </div>
        {sug.suggested.length >= 2 && (
          <button
            type="button"
            onClick={claimAll}
            disabled={claimAllRunning}
            className="inline-flex items-center gap-2 bg-near-black text-white rounded-full px-5 py-2 text-sm hover:bg-black transition-colors disabled:opacity-50"
          >
            {claimAllRunning ? (
              <>
                <Spinner /> Claiming… {sug.suggested.length} left
              </>
            ) : (
              <>Claim all ({sug.suggested.length})</>
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-3">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {sug.suggested.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => claim(name)}
            disabled={claiming !== null || claimAllRunning}
            className="inline-flex items-center gap-2 border border-ink rounded-full px-4 py-1.5 text-sm hover:bg-ink hover:text-canvas transition-colors disabled:opacity-50"
          >
            + {name}
            {claiming === name && <Spinner />}
          </button>
        ))}
      </div>
      {sug.already_claimed.length > 0 && (
        <p className="text-xs text-muted-2 mt-4">
          Already claimed: {sug.already_claimed.join(", ")}
        </p>
      )}
      {failed.length > 0 && !claimAllRunning && (
        <p className="text-xs text-muted-2 mt-2">
          Couldn&apos;t claim: {failed.join(", ")}.
        </p>
      )}
      {claimed.length > 0 && (
        <p className="text-xs mt-2 text-brand-green">
          Claimed: {claimed.join(", ")}.
        </p>
      )}
    </section>
  );
}
