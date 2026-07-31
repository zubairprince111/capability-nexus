import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI5K" },
      { name: "description", content: "Access tiers for professionals, organisations and assurance bodies." },
      { property: "og:title", content: "Pricing — AI5K" },
      { property: "og:description", content: "Access tiers for professionals, organisations and assurance bodies." },
    ],
  }),
  component: Pricing,
});

import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";

function Pricing() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="py-24">
        <PageTransition className="space-y-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Pricing" title="Pricing" description="Access tiers for professionals, organisations and assurance bodies." />
            <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
          </div>
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
