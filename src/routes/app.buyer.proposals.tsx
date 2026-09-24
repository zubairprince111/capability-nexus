import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { ProposalWorkbench } from "@/components/commerce/proposal-workbench";

export const Route = createFileRoute("/app/buyer/proposals")({
  head: () => ({
    meta: [
      { title: "Proposals Workbench — AI5K" },
      { name: "description", content: "Inspect evidence-backed proposals and scopes." },
    ],
  }),
  component: BuyerProposalsRoute,
});

function BuyerProposalsRoute() {
  return (
    <PageTransition className="max-w-6xl mx-auto space-y-8">
      <ProposalWorkbench />
    </PageTransition>
  );
}
