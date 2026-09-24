import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { ContractView } from "@/components/commerce/contract-view";

export const Route = createFileRoute("/app/buyer/contracts")({
  head: () => ({
    meta: [
      { title: "Contracts & Escrow — AI5K" },
      { name: "description", content: "Signed commercial contracts with milestone escrow protection." },
    ],
  }),
  component: BuyerContractsRoute,
});

function BuyerContractsRoute() {
  return (
    <PageTransition className="max-w-6xl mx-auto space-y-8">
      <ContractView />
    </PageTransition>
  );
}
