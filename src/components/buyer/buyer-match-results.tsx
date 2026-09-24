import { useQuery } from "@tanstack/react-query";
import { buyerMatchesQuery } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, User, Building2, Zap, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BuyerMatchResults() {
  const { data: matches = [] } = useQuery(buyerMatchesQuery());

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-[11px] mb-1">
            <Sparkles className="size-3" />
            <span>Explainable Capability Matching</span>
          </div>
          <h1 className="text-2xl font-normal text-foreground tracking-tight">Verified Match Results</h1>
          <p className="text-xs text-muted-foreground font-light">
            Ranked and verified against 18,000+ cryptographically attested capability signals.
          </p>
        </div>

        <Button asChild size="sm" variant="outline" className="text-xs font-mono">
          <Link to="/app/buyer/intake">+ New Project Scope</Link>
        </Button>
      </div>

      {/* Match Cards List */}
      <div className="space-y-6">
        {matches.map((match) => {
          const isPod = match.targetType === "delivery-pod";
          const Icon = isPod ? Zap : match.targetType === "organization" ? Building2 : User;

          return (
            <div key={match.id} className="rounded-2xl border border-border/80 bg-surface/40 p-6 sm:p-8 space-y-6 hover:border-amber-500/30 transition-all backdrop-blur-xl group">
              
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 grid place-items-center shrink-0">
                    <Icon className="size-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                        {match.targetType.replace("-", " ")}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-mono text-emerald-400">{match.availability}</span>
                    </div>

                    <h2 className="text-xl font-medium text-foreground group-hover:text-amber-400 transition-colors">
                      {match.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-light max-w-xl">
                      {match.headline}
                    </p>
                  </div>
                </div>

                {/* Score & Rate Box */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-right">
                    <span className="text-[10px] font-mono text-muted-foreground block uppercase">Proof Match</span>
                    <span className="font-mono text-2xl font-bold text-amber-400">{match.score}%</span>
                  </div>

                  <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold font-mono text-xs gap-1.5 h-10">
                    <Link to="/app/buyer/proposals">
                      Request Proposal
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* WHY THIS MATCH EXPLANATION BOX */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/60 space-y-3">
                <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  Matched Because (Inspectable Evidence Breakdown):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {match.reasons.map((reason, rIdx) => (
                    <div key={rIdx} className="p-2.5 rounded-lg bg-surface/80 border border-border/40 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-medium text-foreground">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          {reason.label}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                          {reason.evidenceCount} Evidence Signals
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-light pl-5">
                        {reason.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Projects List */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-border/40">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-[11px]">Relevant Projects:</span>
                  {match.relevantProjects.map((p, pIdx) => (
                    <span key={pIdx} className="px-2 py-0.5 rounded bg-surface-foreground/5 text-foreground text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
                <span className="text-muted-foreground text-[11px]">{match.estimatedRate}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
