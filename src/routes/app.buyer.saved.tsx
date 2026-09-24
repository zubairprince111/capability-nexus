import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app/buyer/saved")({
  head: () => ({
    meta: [
      { title: "Saved Capabilities — AI5K Buyer Workspace" },
      { name: "description", content: "Shortlisted verified capabilities, providers, and delivery pods." },
    ],
  }),
  component: BuyerSavedRoute,
});

function BuyerSavedRoute() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeading
        eyebrow="Buyer Workspace"
        title="Saved Capabilities & Pods"
        description="Bookmarked professionals, delivery pods, and verified AI capabilities for quick procurement."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card p-6 border border-border/80 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Delivery Pod
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">Bookmarked</span>
          </div>

          <h3 className="text-lg font-semibold text-foreground">Mortgage AI Automation Pod</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            4-person team with 96% capability coverage on autonomous document extraction and SOC2 compliance.
          </p>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-semibold">$420/hr (Sprint Package)</span>
            <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Link to="/app/buyer/matches">
                Request Proposal <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="surface-card p-6 border border-border/80 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              Professional Specialist
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">Bookmarked</span>
          </div>

          <h3 className="text-lg font-semibold text-foreground">Dr. Elena Rostova</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Principal Agentic Systems Architect with cryptographically verified score of 98.4/100.
          </p>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-semibold">$250/hr (Advisory & Lead)</span>
            <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Link to="/app/buyer/matches">
                Request Interview <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
