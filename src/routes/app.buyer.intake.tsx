import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { BuyerIntakeWizard } from "@/components/buyer/buyer-intake-wizard";

export const Route = createFileRoute("/app/buyer/intake")({
  head: () => ({
    meta: [
      { title: "What to Build? Intake — AI5K" },
      { name: "description", content: "Describe AI requirements and discover verified delivery capabilities." },
    ],
  }),
  component: BuyerIntakeRoute,
});

function BuyerIntakeRoute() {
  return (
    <PageTransition className="max-w-4xl mx-auto space-y-8">
      <BuyerIntakeWizard />
    </PageTransition>
  );
}
