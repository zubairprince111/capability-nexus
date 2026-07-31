import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Request access — AI5K" },
      { name: "description", content: "Request access to AI5K." },
      { property: "og:title", content: "Request access — AI5K" },
      { property: "og:description", content: "Request access to AI5K." },
    ],
  }),
  component: Signup,
});

function Signup() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Request access" title="Request access" description="Request access to AI5K." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
