import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { DeliveryPodBuilder } from "@/components/organization/delivery-pod-builder";

export const Route = createFileRoute("/app/organization/pods")({
  head: () => ({
    meta: [
      { title: "Delivery Pod Builder — AI5K" },
      { name: "description", content: "Assemble multi-disciplinary AI delivery pods with verified team capability." },
    ],
  }),
  component: OrganizationPodsRoute,
});

function OrganizationPodsRoute() {
  return (
    <PageTransition className="max-w-6xl mx-auto space-y-8">
      <DeliveryPodBuilder />
    </PageTransition>
  );
}
