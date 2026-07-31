import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AI5K" },
      { name: "description", content: "Sign in to AI5K." },
      { property: "og:title", content: "Sign in — AI5K" },
      { property: "og:description", content: "Sign in to AI5K." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading eyebrow="Sign in" title="Sign in" description="Sign in to AI5K." />
      <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
    </PageTransition>
  );
}
