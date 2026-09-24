import { useState } from "react";
import { MOCK_PROPOSALS } from "@/lib/services/ai5k-service";
import { ProposalItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, FileCheck2, User, Building2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ProposalWorkbench() {
  const [proposals, setProposals] = useState<ProposalItem[]>(MOCK_PROPOSALS);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] mb-1">
            <FileText className="size-3" />
            <span>Commercial Proposal Workbench</span>
          </div>
          <h1 className="text-2xl font-normal text-foreground tracking-tight">Proposals & Agreements</h1>
          <p className="text-xs text-muted-foreground font-light">
            Review evidence-backed proposals, inspect deliverable scopes, and generate binding contracts.
          </p>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.map((prop) => (
          <div key={prop.id} className="rounded-2xl border border-border/80 bg-surface/40 p-6 sm:p-8 space-y-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all">
            
            {/* Top Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Status: {prop.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">Buyer: {prop.buyerName}</span>
                </div>
                <h2 className="text-xl font-medium text-foreground">{prop.title}</h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-bold text-emerald-400">{prop.pricing.total}</span>
                <Button asChild size="sm" className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold font-mono text-xs gap-1.5">
                  <Link to="/app/buyer/contracts">
                    Accept & Convert to Contract
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Recommended Team & Evidence Used */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Team */}
              <div className="p-4 rounded-xl bg-background/50 border border-border/60 space-y-2">
                <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider block">
                  Recommended Team
                </span>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {prop.recommendedTeam.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <User className="size-3.5 text-emerald-500" />
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Used */}
              <div className="p-4 rounded-xl bg-background/50 border border-border/60 space-y-2">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  Evidence-Supported Claims (Cryptographically Verified)
                </span>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {prop.evidenceUsed.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-foreground font-mono text-[11px]">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Scope & Deliverables */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider block">
                Scope & Milestone Deliverables
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                {prop.scope}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {prop.deliverables.map((del, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-surface/80 border border-border/50 text-xs space-y-1">
                    <span className="font-medium text-foreground block">{del.title}</span>
                    <span className="text-[10px] font-mono text-muted-foreground block">{del.timeline}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Mitigation Notes */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold block font-mono uppercase text-[10px]">Risk Mitigation Assessment:</span>
                <span className="font-light">{prop.risks.join(" ")}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
