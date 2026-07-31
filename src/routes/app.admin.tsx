import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/admin")({
  head: () => ({
    meta: [
      { title: "Admin — AI5K" },
      { name: "description", content: "Audit trail and registry governance." },
      { property: "og:title", content: "Admin — AI5K" },
      { property: "og:description", content: "Audit trail and registry governance." },
    ],
  }),
  component: Admin,
});

function Admin() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Admin" title="Admin" description="Audit trail and registry governance." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
