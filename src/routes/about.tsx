import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI5K" },
      { name: "description", content: "Why AI5K replaced claims with inspectable evidence." },
      { property: "og:title", content: "About — AI5K" },
      { property: "og:description", content: "Why AI5K replaced claims with inspectable evidence." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="About" title="About" description="Why AI5K replaced claims with inspectable evidence." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
