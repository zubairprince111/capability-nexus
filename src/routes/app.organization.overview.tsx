import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { OrgOverview } from "@/components/organization/org-overview";

export const Route = createFileRoute("/app/organization/overview")({
  head: () => ({
    meta: [
      { title: "Organization Overview — AI5K" },
      { name: "description", content: "Team roster, capability aggregation, and delivery pods." },
      { property: "og:title", content: "Organization Overview — AI5K" },
      { property: "og:description", content: "Team roster, capability aggregation, and delivery pods." },
    ],
  }),
  component: OrganizationOverviewRoute,
});

function OrganizationOverviewRoute() {
  return (
    <PageTransition>
      <OrgOverview />
    </PageTransition>
  );
}
