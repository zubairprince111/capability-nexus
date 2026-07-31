import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI5K" },
      { name: "description", content: "Identity, evidence sources and privacy controls." },
      { property: "og:title", content: "Settings — AI5K" },
      { property: "og:description", content: "Identity, evidence sources and privacy controls." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Settings" title="Settings" description="Identity, evidence sources and privacy controls." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
