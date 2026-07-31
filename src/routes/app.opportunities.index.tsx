import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — AI5K" },
      { name: "description", content: "Evidence-gated roles and engagements open to your proof level." },
      { property: "og:title", content: "Opportunities — AI5K" },
      { property: "og:description", content: "Evidence-gated roles and engagements open to your proof level." },
    ],
  }),
  component: Opportunities,
});

function Opportunities() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Opportunities" title="Opportunities" description="Evidence-gated roles and engagements open to your proof level." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
