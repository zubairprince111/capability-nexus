import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — AI5K" },
      { name: "description", content: "Verification model, evidence schema and API reference." },
      { property: "og:title", content: "Documentation — AI5K" },
      { property: "og:description", content: "Verification model, evidence schema and API reference." },
    ],
  }),
  component: Docs,
});

import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";

function Docs() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="py-24">
        <PageTransition className="space-y-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Documentation" title="Documentation" description="Verification model, evidence schema and API reference." />
            <EmptyState title="Nothing verified here yet" description="Evidence for this surface will appear as soon as it is attested." />
          </div>
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
