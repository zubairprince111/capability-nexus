import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/app/messages")({
  head: () => ({
    meta: [
      { title: "Messages — AI5K" },
      { name: "description", content: "Conversations with verified counterparts." },
      { property: "og:title", content: "Messages — AI5K" },
      { property: "og:description", content: "Conversations with verified counterparts." },
    ],
  }),
  component: Messages,
});

function Messages() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Messages" title="Messages" description="Conversations with verified counterparts." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
