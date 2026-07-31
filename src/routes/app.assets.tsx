import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/assets")({
  head: () => ({
    meta: [
      { title: "AI Assets — AI5K" },
      { name: "description", content: "Models, datasets and agents with audited evaluation records." },
      { property: "og:title", content: "AI Assets — AI5K" },
      { property: "og:description", content: "Models, datasets and agents with audited evaluation records." },
    ],
  }),
  component: Assets,
});

function Assets() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="AI Assets" title="AI Assets" description="Models, datasets and agents with audited evaluation records." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
