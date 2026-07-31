import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — AI5K" },
      { name: "description", content: "Proof density, attestation velocity and capability trends across your network." },
      { property: "og:title", content: "Analytics — AI5K" },
      { property: "og:description", content: "Proof density, attestation velocity and capability trends across your network." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Analytics" title="Analytics" description="Proof density, attestation velocity and capability trends across your network." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
