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

import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";

function About() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="py-24">
        <PageTransition className="space-y-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="About" title="About" description="Why AI5K replaced claims with inspectable evidence." />
            <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
          </div>
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
