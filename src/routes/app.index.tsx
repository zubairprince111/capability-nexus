import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CapabilityUniverse } from "@/components/capability/capability-universe";
import { PageTransition, Reveal } from "@/components/motion/primitives";
import { OpportunityCard, ProfessionalCard } from "@/components/system/entity-cards";
import { MetricTile, SectionHeading } from "@/components/system/primitives";
import { metricsQuery, opportunitiesQuery, professionalsQuery, universeQuery } from "@/lib/queries";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Mission Control — AI5K" },
      { name: "description", content: "Live view of your verified capability, evidence and opportunities on AI5K." },
      { property: "og:title", content: "Mission Control — AI5K" },
      { property: "og:description", content: "Live view of your verified capability and evidence." },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(metricsQuery());
    void context.queryClient.ensureQueryData(universeQuery());
  },
  component: MissionControl,
});

function MissionControl() {
  const metrics = useSuspenseQuery(metricsQuery());
  const universe = useSuspenseQuery(universeQuery());
  const people = useSuspenseQuery(professionalsQuery({ pageSize: 3 }));
  const roles = useSuspenseQuery(opportunitiesQuery({ pageSize: 3 }));

  return (
    <PageTransition className="space-y-12">
      <div>
        <p className="text-eyebrow">Mission Control</p>
        <h1 className="text-display mt-2 text-3xl sm:text-4xl">Everything provable, in one view</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.data.map((metric, i) => (
          <Reveal key={metric.id} delay={i * 0.06}>
            <MetricTile metric={metric} />
          </Reveal>
        ))}
      </div>

      <CapabilityUniverse graph={universe.data} compact />

      <section>
        <SectionHeading eyebrow="Signal" title="Verified professionals matched to your domains" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {people.data.items.map((person) => (
            <ProfessionalCard key={person.id} person={person} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Evidence-gated" title="Opportunities open to your proof level" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.data.items.map((role) => (
            <OpportunityCard key={role.id} opportunity={role} />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
