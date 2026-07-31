import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Boxes,
  Clock,
  FileCheck2,
  Globe2,
  MapPin,
  Users,
} from "lucide-react";

import { ProofMeter, StatusDot, Tag, VerificationBadge } from "@/components/system/primitives";
import { cn } from "@/lib/utils";
import type { AIAsset, Opportunity, Organization, Professional, Project } from "@/lib/types";

function Avatar({ initials, tone = "primary" }: { initials: string; tone?: "primary" | "proof" }) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl border text-data text-xs font-semibold tracking-wider",
        tone === "primary"
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-proof/25 bg-proof/10 text-proof",
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function ProfessionalCard({ person }: { person: Professional }) {
  return (
    <Link
      to="/app/professionals/$handle"
      params={{ handle: person.handle }}
      className="surface-card lift group block p-5 focus-visible:outline-none"
    >
      <div className="flex items-start gap-3">
        <Avatar initials={person.initials} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-sans text-base font-semibold tracking-tight">{person.name}</h3>
            <VerificationBadge level={person.level} withLabel={false} />
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{person.title}</p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{person.headline}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {person.domains.slice(0, 3).map((d) => (
          <Tag key={d.id}>{d.name}</Tag>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <p className="text-eyebrow">Index</p>
          <p className="text-data mt-1 text-sm font-semibold">{person.capabilityIndex}</p>
        </div>
        <div>
          <p className="text-eyebrow">Proof</p>
          <p className="text-data mt-1 text-sm font-semibold">{Math.round(person.proofRatio * 100)}%</p>
        </div>
        <div>
          <p className="text-eyebrow">Attested</p>
          <p className="text-data mt-1 text-sm font-semibold">{person.attestations}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden />
          {person.location}
        </span>
        <span className="inline-flex items-center gap-1.5 capitalize">
          <StatusDot
            tone={person.availability === "open" ? "verified" : person.availability === "selective" ? "proof" : "muted"}
          />
          {person.availability}
        </span>
      </div>
    </Link>
  );
}

export function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Link
      to="/app/organizations/$slug"
      params={{ slug: org.slug }}
      className="surface-card lift group block p-5 focus-visible:outline-none"
    >
      <div className="flex items-start gap-3">
        <Avatar initials={org.initials} tone="proof" />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-sans text-base font-semibold tracking-tight">{org.name}</h3>
            <VerificationBadge level={org.level} withLabel={false} />
          </div>
          <p className="mt-0.5 truncate text-sm capitalize text-muted-foreground">
            {org.kind.replace("-", " ")} · founded {org.founded}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{org.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {org.focus.slice(0, 3).map((f) => (
          <Tag key={f}>{f}</Tag>
        ))}
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <ProofMeter value={org.trustIndex} label="Trust index" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {org.people.toLocaleString()} people
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Globe2 className="size-3.5" aria-hidden />
          {org.headquarters}
        </span>
      </div>
    </Link>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Link
      to="/app/opportunities/$id"
      params={{ id: opportunity.id }}
      className="surface-card lift group block p-5 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-eyebrow">{opportunity.organization}</p>
          <h3 className="mt-1.5 truncate font-sans text-base font-semibold tracking-tight">{opportunity.title}</h3>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-eyebrow">Match</p>
          <p className="text-data mt-1 text-lg font-semibold text-primary">{opportunity.matchScore}%</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{opportunity.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag className="capitalize">{opportunity.mode}</Tag>
        {opportunity.requiredDomains.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 truncate">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {opportunity.location}
        </span>
        <span className="inline-flex items-center gap-1.5 truncate">
          <FileCheck2 className="size-3.5 shrink-0" aria-hidden />
          Proof ≥ {opportunity.proofThreshold}
        </span>
        <span className="text-data truncate text-foreground">{opportunity.compensation}</span>
        <span className="inline-flex items-center gap-1.5 truncate">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          closes {opportunity.closesAt}
        </span>
      </div>
    </Link>
  );
}

const PROJECT_TONE: Record<Project["status"], "verified" | "signal" | "proof" | "muted"> = {
  scoping: "muted",
  active: "signal",
  review: "proof",
  shipped: "verified",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="surface-card lift p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-eyebrow">{project.organization}</p>
          <h3 className="mt-1.5 truncate font-sans text-base font-semibold tracking-tight">{project.name}</h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs capitalize text-muted-foreground">
          <StatusDot tone={PROJECT_TONE[project.status]} pulse={project.status === "active"} />
          {project.status}
        </span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
      <div className="mt-5">
        <ProofMeter value={project.progress} label="Progress" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {project.contributors} contributors
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileCheck2 className="size-3.5" aria-hidden />
          {project.evidenceArtifacts} artefacts
        </span>
      </div>
    </article>
  );
}

export function AssetCard({ asset }: { asset: AIAsset }) {
  return (
    <article className="surface-card lift p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-sans text-base font-semibold tracking-tight">{asset.name}</h3>
            <VerificationBadge level={asset.level} withLabel={false} />
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {asset.owner} · {asset.license}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[0.6875rem] capitalize text-muted-foreground">
          <Boxes className="size-3.5" aria-hidden />
          {asset.category}
        </span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{asset.summary}</p>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <p className="text-eyebrow">Evals</p>
          <p className="text-data mt-1 text-sm font-semibold">{asset.evaluations.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-eyebrow">Adoption</p>
          <p className="text-data mt-1 text-sm font-semibold">{asset.adoption}%</p>
        </div>
        <div>
          <p className="text-eyebrow">Latency</p>
          <p className="text-data mt-1 text-sm font-semibold">{asset.latencyMs ? `${asset.latencyMs}ms` : "—"}</p>
        </div>
      </div>
    </article>
  );
}
