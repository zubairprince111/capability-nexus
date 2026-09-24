import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { BuyerMatchResults } from "@/components/buyer/buyer-match-results";

export const Route = createFileRoute("/app/buyer/matches")({
  head: () => ({
    meta: [
      { title: "Explainable Match Results — AI5K" },
      { name: "description", content: "Inspect verified evidence match breakdowns for AI requirements." },
    ],
  }),
  component: BuyerMatchesRoute,
});

function BuyerMatchesRoute() {
  return (
    <PageTransition className="max-w-6xl mx-auto space-y-8">
      <BuyerMatchResults />
    </PageTransition>
  );
}
