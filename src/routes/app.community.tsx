import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/community")({
  head: () => ({
    meta: [
      { title: "Community — AI5K" },
      { name: "description", content: "Signals, discussions and peer review across the AI5K network." },
      { property: "og:title", content: "Community — AI5K" },
      { property: "og:description", content: "Signals, discussions and peer review across the AI5K network." },
    ],
  }),
  component: Community,
});

function Community() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Community" title="Community" description="Signals, discussions and peer review across the AI5K network." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
