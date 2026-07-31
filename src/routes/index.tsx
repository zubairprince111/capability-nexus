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
        <LandingHero />
        <LiveStatistics />
        <ScrollStory />
        <VerificationLadder />
        <ProductPreview />

        <ClosingInvitation />
      </main>
      <SiteFooter />
    </div>
  );
}
