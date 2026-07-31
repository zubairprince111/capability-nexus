import { createFileRoute } from "@tanstack/react-router";

import { WorldCapabilityField } from "@/components/landing/world-capability-field";
import {
  ClosingInvitation,
  LandingHero,
  LiveStatistics,
  ProductPreview,
  ScrollStory,
  VerificationLadder,
} from "@/components/landing/sections";
import { SectionHeading } from "@/components/system/primitives";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI5K — Verified AI capability, proven not claimed" },
      {
        name: "description",
        content:
          "AI5K is the global operating system for verified AI capability: inspectable evidence for every professional, organisation, project and model.",
      },
      { property: "og:title", content: "AI5K — Verified AI capability, proven not claimed" },
      {
        property: "og:description",
        content: "Inspectable evidence for every AI professional, organisation, project and model.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <h1 className="sr-only">AI5K — the operating system for verified AI capability</h1>
        <LandingHero />
        <ScrollStory />
        <LiveStatistics />
        <VerificationLadder />
        <ProductPreview />
        <section className="border-t border-border bg-surface/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Global coverage"
              title="Capability concentrates. We show exactly where."
              description="Presence is measured in verified professionals, not marketing offices."
            />
            <div className="mt-10">
              <WorldCapabilityField />
            </div>
          </div>
        </section>
        <ClosingInvitation />
      </main>
      <SiteFooter />
    </div>
  );
}
