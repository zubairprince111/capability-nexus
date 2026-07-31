import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — AI5K" },
      { name: "description", content: "Attestations, evidence updates and opportunity signals." },
      { property: "og:title", content: "Notifications — AI5K" },
      { property: "og:description", content: "Attestations, evidence updates and opportunity signals." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Notifications" title="Notifications" description="Attestations, evidence updates and opportunity signals." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
