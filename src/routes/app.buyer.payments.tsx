import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { useQuery } from "@tanstack/react-query";
import { paymentsQuery } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, CheckCircle2, ShieldCheck, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/app/buyer/payments")({
  head: () => ({
    meta: [
      { title: "Payments & Invoices — AI5K" },
      { name: "description", content: "Track milestone disbursements, platform fees, and paid invoices." },
    ],
  }),
  component: PaymentsRoute,
});

function PaymentsRoute() {
  const { data: payments = [] } = useQuery(paymentsQuery());

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] mb-1">
            <CreditCard className="size-3" />
            <span>Commercial Finance Ledger</span>
          </div>
          <h1 className="text-2xl font-normal text-foreground tracking-tight">Payments & Invoices</h1>
          <p className="text-xs text-muted-foreground font-light">
            API-ready payment disbursement ledger tracking milestone funding, platform fees, and net payouts.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border/80 bg-surface/40 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total Funded Escrow</span>
          <div className="text-2xl font-mono font-bold text-foreground">$30,000.00</div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
            <CheckCircle2 className="size-3" /> Active Milestone 1
          </span>
        </div>

        <div className="p-5 rounded-xl border border-border/80 bg-surface/40 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Platform Fee (5%)</span>
          <div className="text-2xl font-mono font-bold text-foreground">$1,500.00</div>
          <span className="text-[10px] text-muted-foreground font-mono">Retained for verification protocol</span>
        </div>

        <div className="p-5 rounded-xl border border-border/80 bg-surface/40 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Available Net Payout</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">$28,500.00</div>
          <span className="text-[10px] text-emerald-400 font-mono">Ready for bank transfer</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-border/80 bg-surface/40 p-6 space-y-4 backdrop-blur-xl">
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Recent Payment Transactions
        </h2>

        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-medium text-foreground block">{p.milestoneTitle}</span>
                <span className="text-[10px] font-mono text-muted-foreground">ID: {p.id} · Date: {p.createdAt}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="font-mono font-bold text-foreground block">${p.grossAmount.toLocaleString()}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Net: ${p.netAmount.toLocaleString()}</span>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </PageTransition>
  );
}
