import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/organizations/$slug")({
  head: () => ({
    meta: [
      { title: "Organisation — AI5K" },
      { name: "description", content: "Attested profile, assets and open roles for this organisation." },
      { property: "og:title", content: "Organisation — AI5K" },
      { property: "og:description", content: "Attested profile, assets and open roles for this organisation." },
    ],
  }),
  component: OrganizationDetail,
});

function OrganizationDetail() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Organisation" title="Organisation" description="Attested profile, assets and open roles for this organisation." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
