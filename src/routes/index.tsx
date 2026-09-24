import { createFileRoute } from "@tanstack/react-router";
import { AI5KHero } from "@/components/landing/ai5k-hero";
import { SiteFooter } from "@/components/site/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI5K — Verified AI capability, proven not claimed" },
      {
        name: "description",
        content:
          "AI5K is the verified global AI capability network: proof for every professional, organization, project and model.",
      },
      { property: "og:title", content: "AI5K — Verified AI capability, proven not claimed" },
      {
        property: "og:description",
        content: "Inspectable evidence for every AI professional, organization, project and model.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col justify-between">
      <main className="flex-1">
        <AI5KHero />
      </main>
      <SiteFooter />
    </div>
  );
}
