import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/organizations")({
  head: () => ({
    meta: [
      { title: "Organisations — AI5K" },
      { name: "description", content: "Verified organisations, their attested assets and hiring standards." },
      { property: "og:title", content: "Organisations — AI5K" },
      { property: "og:description", content: "Verified organisations, their attested assets and hiring standards." },
    ],
  }),
  component: Organizations,
});

function Organizations() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Organisations" title="Organisations" description="Verified organisations, their attested assets and hiring standards." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
