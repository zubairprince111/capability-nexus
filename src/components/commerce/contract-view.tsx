import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { contractsQuery, paymentsQuery } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Lock, DollarSign, FileText, CreditCard, ArrowRight } from "lucide-react";

export function ContractView() {
  const { data: contracts = [] } = useQuery(contractsQuery());
  const { data: payments = [] } = useQuery(paymentsQuery());

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] mb-1">
            <ShieldCheck className="size-3" />
            <span>Commercial Execution & Contracts</span>
          </div>
          <h1 className="text-2xl font-normal text-foreground tracking-tight">Binding Contracts & Escrow</h1>
          <p className="text-xs text-muted-foreground font-light">
            Cryptographically signed agreements with milestone-backed escrow protection.
          </p>
        </div>
      </div>

      {/* Active Contracts */}
      <div className="space-y-6">
        {contracts.map((contract) => (
          <div key={contract.id} className="rounded-2xl border border-border/80 bg-surface/40 p-6 sm:p-8 space-y-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Status: {contract.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">Signed: {contract.signedAt}</span>
                </div>
                <h2 className="text-xl font-medium text-foreground">{contract.title}</h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-muted-foreground block">Total Value</span>
                  <span className="font-mono text-2xl font-bold text-emerald-400">{contract.totalValue}</span>
                </div>
              </div>
            </div>

            {/* Contract Parties & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-1 text-xs">
                <span className="font-mono text-muted-foreground text-[10px] uppercase block">Parties</span>
                <span className="font-medium text-foreground block">Buyer: {contract.buyerName}</span>
                <span className="font-medium text-foreground block">Provider: {contract.providerName}</span>
              </div>

              <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-1 text-xs">
                <span className="font-mono text-muted-foreground text-[10px] uppercase block">Payment & IP Terms</span>
                <span className="font-medium text-foreground block">{contract.paymentTerms}</span>
                <span className="text-muted-foreground text-[11px] block">Full IP assignment upon final milestone payout.</span>
              </div>
            </div>

            {/* Milestones Escrow Table */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider block">
                Milestone Escrow Funding Schedule
              </span>

              <div className="space-y-2">
                {contract.milestones.map((ms) => (
                  <div key={ms.id} className="p-3.5 rounded-xl bg-surface/80 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-medium text-foreground block">{ms.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">Due: {ms.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-foreground">{ms.amount}</span>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase">
                        {ms.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
