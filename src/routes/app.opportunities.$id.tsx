import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/opportunities/$id")({
  head: () => ({
    meta: [
      { title: "Opportunity — AI5K" },
      { name: "description", content: "Requirements, evidence gates and hiring standard for this role." },
      { property: "og:title", content: "Opportunity — AI5K" },
      { property: "og:description", content: "Requirements, evidence gates and hiring standard for this role." },
    ],
  }),
  component: OpportunityDetail,
});

function OpportunityDetail() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Opportunity" title="Opportunity" description="Requirements, evidence gates and hiring standard for this role." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
