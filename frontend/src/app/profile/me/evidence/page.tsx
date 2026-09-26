"use client";

// Evidence — files, links, testimonials attached to the user's profile.
// Storage path requires S3 (503 if not configured); link/testimonial need none.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Chip,
  MonoLabel,
  Notice,
  Spinner,
} from "@/components/ui/Bits";
import {
  createEvidence,
  deleteEvidence,
  describeApiError,
  getMyProfile,
  listEvidence,
  presignEvidence,
  uploadToS3,
  type EvidenceRead,
  type EvidenceSourceType,
  type ProfileRead,
} from "@/lib/api-helpers";

type Mode = "link" | "testimonial" | "file";

const FILE_ACCEPT = ".pdf,.docx,.md,.txt,.png,.jpg,.jpeg,.webp";

function PageBar({ count }: { count: number | null }) {
  return (
    <div className="sticky top-0 z-20 -mx-6 px-6 bg-canvas/80 backdrop-blur-md border-b border-hairline mb-8">
      <div className="flex items-center justify-between gap-6 h-14">
        <div className="flex items-baseline gap-4 min-w-0">
          <h1 className="font-display text-ink text-[15px] font-semibold tracking-tight">
            Evidence
          </h1>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            <span className="size-1 rounded-full bg-brand-emerald anim-breathe" aria-hidden />
            {count === null ? "Loading" : `${count} on file`}
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

function evidenceContentType(file: File): string {
  const name = file.name.toLowerCase();
  if (name.endsWith(".md")) return "text/markdown";
  if (name.endsWith(".txt")) return "text/plain";
  if (name.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".webp")) return "image/webp";
  return file.type || "application/pdf";
}

function AddEvidenceCard({
  profile,
  onCreated,
}: {
  profile: ProfileRead;
  onCreated: () => void;
}) {
  const [mode, setMode] = useState<Mode>("link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!title.trim()) return setError("Title is required.");
    setBusy(true);
    try {
      if (mode === "link" || mode === "testimonial") {
        const trimmed = url.trim();
        if (!trimmed) return setError("URL is required.");
        if (!/^https?:\/\//i.test(trimmed)) return setError("URL must start with http:// or https://");
        await createEvidence(profile.id, {
          source_type: mode,
          title: title.trim(),
          description: description.trim() || null,
          url: trimmed,
        });
      } else {
        if (!file) return setError("Pick a file to upload.");
        const contentType = evidenceContentType(file);
        try {
          const presign = await presignEvidence(profile.id, "document", contentType);
          await uploadToS3(presign.upload_url, contentType, file);
          await createEvidence(profile.id, {
            source_type: "document",
            title: title.trim(),
            description: description.trim() || null,
            file_key: presign.file_key,
          });
        } catch (err) {
          const code = (err as { code?: string }).code;
          if (code === "storage_not_configured") {
            setError("File uploads need S3 to be configured on the server. Use a link instead.");
            setBusy(false);
            return;
          }
          throw err;
        }
      }
      reset();
      setInfo("Evidence added.");
      onCreated();
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Mode; label: string; hint: string }[] = [
    { id: "link", label: "Link", hint: "Public URL" },
    { id: "testimonial", label: "Testimonial", hint: "Quote / reference" },
    { id: "file", label: "File", hint: "PDF / DOCX / image" },
  ];

  return (
    <section className="rounded-md border border-border-light bg-stone-2 p-5">
      <div role="tablist" aria-label="Evidence type" className="flex gap-1 mb-5 border-b border-hairline">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={mode === t.id}
            onClick={() => setMode(t.id)}
            className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
              mode === t.id
                ? "border-brand-emerald text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
            <span className="text-muted-2 font-normal ml-1.5 hidden sm:inline">
              · {t.hint}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="ev-title" className="block text-sm font-medium text-ink mb-1.5">
            Title
          </label>
          <input
            id="ev-title"
            type="text"
            required
            maxLength={255}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
          />
        </div>

        {(mode === "link" || mode === "testimonial") && (
          <div>
            <label htmlFor="ev-url" className="block text-sm font-medium text-ink mb-1.5">
              URL
            </label>
            <input
              id="ev-url"
              type="text"
              inputMode="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan"
            />
          </div>
        )}

        {mode === "file" && (
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">File</label>
            <label className="flex items-center justify-between gap-4 border border-dashed border-border-light rounded-md px-4 py-3 cursor-pointer hover:border-ink transition-colors bg-canvas">
              <span className="text-[13px] text-muted truncate">
                {file ? file.name : "Click to choose a file"}
              </span>
              <span className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 shrink-0">
                PDF · DOCX · MD · IMG
              </span>
              <input
                ref={fileRef}
                type="file"
                accept={FILE_ACCEPT}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

        <div>
          <label htmlFor="ev-desc" className="block text-sm font-medium text-ink mb-1.5">
            Description <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            id="ev-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-canvas border border-border-light rounded-md px-3.5 py-2 text-[13.5px] text-ink placeholder:text-muted-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-cyan focus:border-brand-cyan resize-none"
          />
        </div>

        {error && <Notice kind="error">{error}</Notice>}
        {info && <Notice kind="ok">{info}</Notice>}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center font-medium transition-colors rounded-full bg-ink text-canvas hover:bg-white px-5 py-2 text-sm disabled:opacity-50"
          >
            {busy ? "Adding…" : "Add evidence"}
            <span aria-hidden className="ml-1.5">→</span>
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={busy}
            className="text-[13px] text-muted hover:text-ink underline underline-offset-4"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}

function EvidenceRow({
  row,
  onDelete,
  deleting,
}: {
  row: EvidenceRead;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const tone =
    row.verification_status === "verified"
      ? "green"
      : row.verification_status === "rejected"
        ? "coral"
        : "neutral";
  return (
    <li className="px-4 py-3.5">
      <div className="flex items-start gap-4">
        <Chip tone={tone}>{row.verification_status}</Chip>
        <div className="flex-1 min-w-0">
          <p className="text-ink font-medium truncate">{row.title}</p>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-0.5">
            {row.source_type}
            <span className="mx-2 text-hairline">·</span>
            {new Date(row.uploaded_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {row.skill_links.length > 0 && (
              <>
                <span className="mx-2 text-hairline">·</span>
                {row.skill_links.length} skill link
                {row.skill_links.length === 1 ? "" : "s"}
              </>
            )}
          </p>
          {row.description && (
            <p className="text-[13px] text-muted mt-1.5 max-w-2xl">
              {row.description}
            </p>
          )}
          {(row.download_url || row.file_url) && (
            <p className="mt-1.5">
              <a
                href={row.download_url ?? row.file_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-brand-emerald hover:text-brand-mint"
              >
                Open file →
              </a>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          disabled={deleting === row.id}
          className="text-[12.5px] text-muted hover:text-error-red transition-colors disabled:opacity-50 shrink-0"
        >
          {deleting === row.id ? "Removing…" : "Remove"}
        </button>
      </div>
    </li>
  );
}

function EvidenceInner() {
  const [profile, setProfile] = useState<ProfileRead | null>(null);
  const [rows, setRows] = useState<EvidenceRead[] | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async (p: ProfileRead) => {
    try {
      setRows(await listEvidence(p.id));
    } catch (err) {
      setError(describeApiError(err));
      setRows([]);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        setProfile(p);
        await load(p);
      } catch (err) {
        if ((err as { status?: number }).status === 404) {
          setError("Create your profile before adding evidence.");
          setRows([]);
        } else {
          setError(describeApiError(err));
          setRows([]);
        }
      }
    })();
  }, []);

  async function handleDelete(id: string) {
    if (!profile) return;
    setDeleting(id);
    try {
      await deleteEvidence(profile.id, id);
      await load(profile);
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <main className="max-w-[960px] mx-auto px-6 pt-6 pb-12">
      <PageBar count={rows === null ? null : rows.length} />

      {error && (
        <div className="mb-8 max-w-2xl">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {profile && (
        <div className="mb-10">
          <AddEvidenceCard
            profile={profile}
            onCreated={() => profile && load(profile)}
          />
        </div>
      )}

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[14px] font-medium text-ink">On file</h2>
          <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2">
            {rows === null ? "…" : rows.length}
          </p>
        </div>

        {rows === null ? (
          <div className="py-10 flex justify-center">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-md border border-hairline bg-stone-2 px-6 py-8 text-center">
            <p className="text-[14px] text-ink font-medium">Nothing yet.</p>
            <p className="text-[13px] text-muted mt-1.5 max-w-md mx-auto">
              Add a public profile link to start; the platform reviews each row
              and approves ones that match a claimed skill.
            </p>
          </div>
        ) : (
          <ul className="rounded-md border border-border-light divide-y divide-hairline bg-stone-2">
            {rows.map((r) => (
              <EvidenceRow
                key={r.id}
                row={r}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </ul>
        )}

        <p className="font-mono uppercase tracking-[0.18em] text-micro text-muted-2 mt-6 max-w-2xl">
          Status: pending → platform reviews → verified or rejected
        </p>
      </section>
    </main>
  );
}

export default function EvidencePage() {
  return (
    <AppShell>
      <EvidenceInner />
    </AppShell>
  );
}
