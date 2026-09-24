import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SiteHeader, SiteFooter } from "@/components/site/site-chrome";
import { MarketplacePreview } from "@/components/landing/marketplace-preview";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Explore Before Login — What You Can Discover on AI5K" },
      {
        name: "description",
        content:
          "Preview real verified AI agents, services, experts, and delivery pods — every claim backed by inspectable proof.",
      },
      { property: "og:title", content: "Explore Before Login — AI5K" },
      {
        property: "og:description",
        content:
          "Discover verified AI capabilities, inspect proof signals, and test intake wizards before creating an account.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col justify-between">
      <SiteHeader />
      <main className="flex-1 py-8">
        <PageTransition>
          <MarketplacePreview />
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
