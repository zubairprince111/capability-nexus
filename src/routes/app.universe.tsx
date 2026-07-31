import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CapabilityUniverse } from "@/components/capability/capability-universe";
import { PageTransition } from "@/components/motion/primitives";
import { universeQuery } from "@/lib/queries";

export const Route = createFileRoute("/app/universe")({
  head: () => ({
    meta: [
      { title: "Capability Universe — AI5K" },
      { name: "description", content: "Explore the AI5K capability lattice: domains, evidence density and verified practitioners." },
      { property: "og:title", content: "Capability Universe — AI5K" },
      { property: "og:description", content: "Explore domains, evidence density and verified practitioners." },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(universeQuery());
  },
  component: UniversePage,
});

function UniversePage() {
  const universe = useSuspenseQuery(universeQuery());
  return (
    <PageTransition className="space-y-8">
      <div>
        <p className="text-eyebrow">Signature surface</p>
        <h1 className="text-display mt-2 text-3xl sm:text-4xl">Capability Universe</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Each node is a capability domain. Radius encodes evidence density, links encode co-verified practice.
        </p>
      </div>
      <CapabilityUniverse graph={universe.data} />
    </PageTransition>
  );
}
