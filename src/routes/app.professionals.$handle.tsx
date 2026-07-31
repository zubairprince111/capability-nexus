import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/professionals/$handle")({
  head: () => ({
    meta: [
      { title: "Professional — AI5K" },
      { name: "description", content: "Verified capability profile with inspectable evidence." },
      { property: "og:title", content: "Professional — AI5K" },
      { property: "og:description", content: "Verified capability profile with inspectable evidence." },
    ],
  }),
  component: ProfessionalDetail,
});

function ProfessionalDetail() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Professional" title="Professional" description="Verified capability profile with inspectable evidence." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
