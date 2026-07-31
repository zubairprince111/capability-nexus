import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — AI5K" },
      { name: "description", content: "Procure verified capability with evidence attached to every listing." },
      { property: "og:title", content: "Marketplace — AI5K" },
      { property: "og:description", content: "Procure verified capability with evidence attached to every listing." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Marketplace" title="Marketplace" description="Procure verified capability with evidence attached to every listing." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
