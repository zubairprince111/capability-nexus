import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/learning")({
  head: () => ({
    meta: [
      { title: "Learning — AI5K" },
      { name: "description", content: "Tracks that convert study into verifiable evidence." },
      { property: "og:title", content: "Learning — AI5K" },
      { property: "og:description", content: "Tracks that convert study into verifiable evidence." },
    ],
  }),
  component: Learning,
});

function Learning() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Learning" title="Learning" description="Tracks that convert study into verifiable evidence." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
