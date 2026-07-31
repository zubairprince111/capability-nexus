import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/projects")({
  head: () => ({
    meta: [
      { title: "Projects — AI5K" },
      { name: "description", content: "Verified delivery records with signed provenance." },
      { property: "og:title", content: "Projects — AI5K" },
      { property: "og:description", content: "Verified delivery records with signed provenance." },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Projects" title="Projects" description="Verified delivery records with signed provenance." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
