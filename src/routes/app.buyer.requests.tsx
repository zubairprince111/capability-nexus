import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles, Orbit } from "lucide-react";
import { PageTransition } from "@/components/motion/primitives";
import { EmptyState, SectionHeading } from "@/components/system/primitives";
import { MOCK_BUYER_REQUIREMENTS } from "@/lib/services/ai5k-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/buyer/requests")({
  head: () => ({
    meta: [
      { title: "My Requisitions — AI5K Buyer Workspace" },
      { name: "description", content: "Track active capability requisitions and problem statements." },
    ],
  }),
  component: BuyerRequestsRoute,
});

function BuyerRequestsRoute() {
  const reqs = MOCK_BUYER_REQUIREMENTS;

  return (
    <PageTransition className="space-y-8">
      <SectionHeading
        eyebrow="Buyer Workspace"
        title="My Capability Requisitions"
        description="Structured problem statements submitted to the AI5K verified capability matching network."
        action={
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
            <Link to="/app/buyer/intake">
              <Plus className="size-4 mr-2" /> New Requisition
            </Link>
          </Button>
        }
      />

      {reqs.length === 0 ? (
        <EmptyState
          title="No Active Requisitions"
          description="Submit what you are trying to build to receive explainable matches from verified providers and delivery pods."
          action={
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Link to="/app/buyer/intake">Start Intake</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reqs.map((req) => (
            <div key={req.id} className="surface-card p-6 border border-border/80 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 uppercase text-[10px] font-mono">
                      {req.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{req.industry}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{req.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="border-border">
                    <Link to="/app/buyer/matches">
                      <Sparkles className="size-4 mr-1.5 text-emerald-400" /> View Matches
                    </Link>
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{req.problem}</p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
                <span className="text-muted-foreground font-mono">Capabilities Required:</span>
                {req.requiredCapabilities.map((cap, i) => (
                  <Badge key={i} variant="outline" className="bg-surface border-border">
                    {cap}
                  </Badge>
                ))}
                <span className="ml-auto font-mono text-emerald-400">Budget: {req.budget}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
