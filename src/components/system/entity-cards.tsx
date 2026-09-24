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
        "grid size-12 shrink-0 place-items-center rounded-full border text-xs font-semibold tracking-wider",
        tone === "primary"
          ? "border-primary/20 bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(var(--primary),0.1)]"
          : "border-proof/20 bg-proof/10 text-proof shadow-[inset_0_0_10px_rgba(var(--proof),0.1)]",
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] focus-visible:outline-none"
    >
      {/* Subtle top border highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />
      
      {/* Hover glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <Avatar initials={person.initials} />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <h3 className="truncate font-sans text-base font-semibold tracking-tight text-white/90 transition-colors group-hover:text-primary">
                {person.name}
              </h3>
              <VerificationBadge level={person.level} withLabel={false} />
            </div>
            <p className="mt-0.5 truncate text-sm text-white/50">{person.title}</p>
          </div>
        </div>

        <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-white/60">
          {person.headline}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {person.domains.slice(0, 3).map((d) => (
            <span 
              key={d.id} 
              className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
            >
              {d.name}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5">
          <div className="bg-black/20 px-3 py-2.5 text-center backdrop-blur-md">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Index</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white/90">{person.capabilityIndex}</p>
          </div>
          <div className="bg-black/20 px-3 py-2.5 text-center backdrop-blur-md">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Proof</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white/90">{Math.round(person.proofRatio * 100)}%</p>
          </div>
          <div className="bg-black/20 px-3 py-2.5 text-center backdrop-blur-md">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Attested</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white/90">{person.attestations}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MapPin className="size-3.5 opacity-70" aria-hidden />
            {person.location}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium capitalize">
            <StatusDot
              tone={person.availability === "open" ? "verified" : person.availability === "selective" ? "proof" : "muted"}
            />
            {person.availability}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Link
      to="/app/organizations/$slug"
      params={{ slug: org.slug }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] focus-visible:outline-none"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <Avatar initials={org.initials} tone="proof" />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate font-sans text-base font-semibold tracking-tight text-white/90 transition-colors group-hover:text-primary">
                {org.name}
              </h3>
              <VerificationBadge level={org.level} withLabel={false} />
            </div>
            <p className="mt-0.5 truncate text-sm capitalize text-white/50">
              {org.kind.replace("-", " ")} · founded {org.founded}
            </p>
          </div>
        </div>
        <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-white/60">{org.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {org.focus.slice(0, 3).map((f) => (
            <span 
              key={f} 
              className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 mt-6">
        <div className="rounded-xl border border-white/5 bg-black/20 p-4 backdrop-blur-md">
          <ProofMeter value={org.trustIndex} label="Trust index" />
        </div>
        <div className="mt-5 flex items-center justify-between text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Users className="size-3.5 opacity-70" aria-hidden />
            {org.people.toLocaleString()} people
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Globe2 className="size-3.5 opacity-70" aria-hidden />
            {org.headquarters}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Link
      to="/app/opportunities/$id"
      params={{ id: opportunity.id }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] focus-visible:outline-none"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">{opportunity.organization}</p>
            <h3 className="mt-1.5 truncate font-sans text-base font-semibold tracking-tight text-white/90 transition-colors group-hover:text-primary">
              {opportunity.title}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Match</p>
            <p className="mt-1 font-mono text-lg font-semibold text-primary">{opportunity.matchScore}%</p>
          </div>
        </div>

        <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-white/60">{opportunity.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium capitalize text-white/60 transition-colors hover:bg-white/10 hover:text-white/90">{opportunity.mode}</span>
          {opportunity.requiredDomains.map((d) => (
            <span 
              key={d} 
              className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-black/20 p-4 text-xs font-medium text-white/50 backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 shrink-0 opacity-70" aria-hidden />
            {opportunity.location}
          </span>
          <span className="inline-flex items-center gap-1.5 truncate">
            <FileCheck2 className="size-3.5 shrink-0 opacity-70" aria-hidden />
            Proof ≥ {opportunity.proofThreshold}
          </span>
          <span className="truncate text-white/90">{opportunity.compensation}</span>
          <span className="inline-flex items-center gap-1.5 truncate">
            <Clock className="size-3.5 shrink-0 opacity-70" aria-hidden />
            closes {opportunity.closesAt}
          </span>
        </div>
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
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">{project.organization}</p>
            <h3 className="mt-1.5 truncate font-sans text-base font-semibold tracking-tight text-white/90 transition-colors group-hover:text-primary">
              {project.name}
            </h3>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/5 bg-black/20 px-2.5 py-1 text-[0.6875rem] font-medium capitalize text-white/60">
            <StatusDot tone={PROJECT_TONE[project.status]} pulse={project.status === "active"} />
            {project.status}
          </span>
        </div>
        <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-white/60">{project.summary}</p>
      </div>

      <div className="relative z-10 mt-6">
        <div className="rounded-xl border border-white/5 bg-black/20 p-4 backdrop-blur-md">
          <ProofMeter value={project.progress} label="Progress" />
        </div>
        <div className="mt-5 flex items-center justify-between text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Users className="size-3.5 opacity-70" aria-hidden />
            {project.contributors} contributors
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <FileCheck2 className="size-3.5 opacity-70" aria-hidden />
            {project.evidenceArtifacts} artefacts
          </span>
        </div>
      </div>
    </article>
  );
}

export function AssetCard({ asset }: { asset: AIAsset }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate font-sans text-base font-semibold tracking-tight text-white/90 transition-colors group-hover:text-primary">
                {asset.name}
              </h3>
              <VerificationBadge level={asset.level} withLabel={false} />
            </div>
            <p className="mt-0.5 truncate text-sm text-white/50">
              {asset.owner} · {asset.license}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium capitalize text-white/60">
            <Boxes className="size-3.5 opacity-70" aria-hidden />
            {asset.category}
          </span>
        </div>
        <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-white/60">{asset.summary}</p>
      </div>

      <div className="relative z-10 mt-6">
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5">
          <div className="bg-black/20 px-3 py-2.5 text-center backdrop-blur-md">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Evals</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white/90">{asset.evaluations.toLocaleString()}</p>
          </div>
          <div className="bg-black/20 px-3 py-2.5 text-center backdrop-blur-md">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Adoption</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white/90">{asset.adoption}%</p>
          </div>
          <div className="bg-black/20 px-3 py-2.5 text-center backdrop-blur-md">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-white/40">Latency</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white/90">{asset.latencyMs ? `${asset.latencyMs}ms` : "—"}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
