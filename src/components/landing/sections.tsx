import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BadgeCheck, FileCheck2, Layers, Radar, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";

import { CapabilityUniverse } from "@/components/capability/capability-universe";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { OpportunityCard, ProfessionalCard } from "@/components/system/entity-cards";
import { SectionHeading, Tag, VerificationBadge } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { opportunities, professionals, universeGraph } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const graphY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.15]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-20 pb-16 sm:pt-28">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="aurora pointer-events-none absolute inset-x-0 -top-24 h-[42rem] opacity-80" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div style={{ opacity: copyOpacity }} className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <ShieldCheck className="size-3.5 text-verified" aria-hidden />
              41,860 attestations issued this quarter
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-display mt-7 text-[clamp(2.75rem,7vw,5.25rem)]">
              Capability, <span className="italic text-primary">proven.</span>
              <br />
              Not claimed.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              AI5K is the operating system for verified AI capability. Every skill, project, model and
              organisation carries evidence you can inspect — signed at source, replicated independently.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="min-h-11 px-6">
                <Link to="/app">
                  Enter the platform
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Link
                to="/about"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                How verification works
              </Link>
            </div>
          </Reveal>
        </motion.div>

        <motion.div style={{ y: graphY }} className="mt-16">
          <Reveal delay={0.3}>
            <CapabilityUniverse graph={universeGraph} compact />
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

const STORY = [
  {
    eyebrow: "01 — Claims decay",
    title: "A résumé is a story told by one narrator.",
    body: "Titles inflate. Portfolios go stale. Interviews measure interview skill. Every hiring decision in AI is currently made on unverifiable prose.",
    icon: Layers,
  },
  {
    eyebrow: "02 — Evidence compounds",
    title: "Proof is an artefact, with a signature attached.",
    body: "A benchmark replicated by three labs. A deployment attested by the platform owner. An audit signed by an assurance body. Each artefact keeps its provenance, forever.",
    icon: FileCheck2,
  },
  {
    eyebrow: "03 — Capability becomes legible",
    title: "One index, derived only from what can be checked.",
    body: "AI5K weighs artefacts by independence, recency and replication — then renders the result as a living capability lattice instead of a list of adjectives.",
    icon: Radar,
  },
];

export function ScrollStory() {
  return (
    <section className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The premise"
          title="The industry runs on claims. We rebuilt it on evidence."
          description="Three shifts turn a professional network into an operating system for capability."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {STORY.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.eyebrow} delay={i * 0.1}>
                <article className="surface-card lift h-full p-7">
                  <span className="grid size-11 place-items-center rounded-xl border border-border bg-elevated text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="text-eyebrow mt-6">{step.eyebrow}</p>
                  <h3 className="mt-3 text-display text-xl leading-snug">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const LADDER = [
  { level: "claimed" as const, detail: "Self-reported. Visible, but never counted toward an index." },
  { level: "reviewed" as const, detail: "An independent reviewer checked the artefact against its source." },
  { level: "verified" as const, detail: "Confirmed at source by the issuing organisation or platform owner." },
  { level: "attested" as const, detail: "Signed by a third-party assurance body and published to the registry." },
];

export function VerificationLadder() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Verification ladder"
            title="Four states. No opinions in between."
            description="Every statement on AI5K sits on exactly one rung, and every rung says who checked it."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            <Tag>Signed provenance</Tag>
            <Tag>Independent replication</Tag>
            <Tag>Recency weighting</Tag>
            <Tag>Public registry</Tag>
          </div>
        </div>

        <Stagger className="space-y-3">
          {LADDER.map((rung, i) => (
            <StaggerItem key={rung.level}>
              <div className="surface-card lift flex items-start gap-4 p-5">
                <span className="text-data mt-0.5 w-6 shrink-0 text-sm text-muted-foreground">0{i + 1}</span>
                <div className="min-w-0">
                  <VerificationBadge level={rung.level} />
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rung.detail}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const STATS = [
  { label: "Verified professionals", value: 48120, suffix: "" },
  { label: "Attested artefacts", value: 214600, suffix: "" },
  { label: "Organisations on the registry", value: 3140, suffix: "" },
  { label: "Median proof ratio", value: 87, suffix: "%" },
];

export function LiveStatistics() {
  return (
    <section className="border-y border-border bg-surface/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div>
              <p className="text-display text-4xl sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const PREVIEWS = [
  { id: "people", label: "Verified professionals" },
  { id: "roles", label: "Evidence-gated opportunities" },
  { id: "graph", label: "Capability Universe" },
];

export function ProductPreview() {
  const [tab, setTab] = useState("people");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Inside the platform"
          title="Every surface answers one question: what is actually proven?"
        />

        <div
          role="tablist"
          aria-label="Product previews"
          className="mt-8 inline-flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1"
        >
          {PREVIEWS.map((preview) => (
            <button
              key={preview.id}
              role="tab"
              aria-selected={tab === preview.id}
              onClick={() => setTab(preview.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                tab === preview.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {preview.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "people" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {professionals.slice(0, 3).map((person) => (
                <ProfessionalCard key={person.id} person={person} />
              ))}
            </div>
          )}
          {tab === "roles" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.slice(0, 3).map((role) => (
                <OpportunityCard key={role.id} opportunity={role} />
              ))}
            </div>
          )}
          {tab === "graph" && <CapabilityUniverse graph={universeGraph} compact />}
        </div>
      </div>
    </section>
  );
}

export function ClosingInvitation() {
  return (
    <section className="relative overflow-hidden border-t border-border py-28">
      <div className="aurora pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-eyebrow">
            <BadgeCheck className="size-3.5 text-verified" aria-hidden />
            Access is reviewed, not sold
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-display mt-6 text-[clamp(2.25rem,5vw,3.75rem)]">
            Bring evidence. Keep the credit forever.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Your artefacts, provenance and attestations belong to you — portable across every organisation you
            work with.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-h-11 px-6">
              <Link to="/auth/signup">Request access</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-11 px-6">
              <Link to="/app">Explore the platform</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
