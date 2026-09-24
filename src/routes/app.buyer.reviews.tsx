import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { useQuery } from "@tanstack/react-query";
import { buyerReviewsQuery } from "@/lib/queries";
import { Star, ShieldCheck, CheckCircle2, Award, UserCheck, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/buyer/reviews")({
  head: () => ({
    meta: [
      { title: "Verified Reviews & Reputation — AI5K" },
      { name: "description", content: "Inspect multi-tier verified reviews, imported testimonials, and endorsements." },
    ],
  }),
  component: ReviewsRoute,
});

function ReviewsRoute() {
  const { data: reviews = [] } = useQuery(buyerReviewsQuery());

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] mb-1">
            <ShieldCheck className="size-3" />
            <span>Multi-Tier Reputation System</span>
          </div>
          <h1 className="text-2xl font-normal text-foreground tracking-tight">Verified Reviews & Endorsements</h1>
          <p className="text-xs text-muted-foreground font-light">
            AI5K clearly distinguishes between Verified Reviews, Imported Testimonials, and Peer Endorsements.
          </p>
        </div>
      </div>

      {/* Distinction Explanation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <span className="font-mono text-emerald-400 font-bold block uppercase text-[10px]">1. AI5K Verified Review</span>
          <p className="text-muted-foreground text-[11px]">Submitted after an active contract delivery with cryptographic proof signature.</p>
        </div>

        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 space-y-1">
          <span className="font-mono text-cyan-400 font-bold block uppercase text-[10px]">2. Organization Endorsement</span>
          <p className="text-muted-foreground text-[11px]">Attested by participating enterprise lead engineers or lab directors.</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 space-y-1">
          <span className="font-mono text-amber-400 font-bold block uppercase text-[10px]">3. Peer Endorsement</span>
          <p className="text-muted-foreground text-[11px]">Signed by verified peers with inspectable code contribution artifacts.</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-6 rounded-2xl border border-border/80 bg-surface/40 space-y-4 backdrop-blur-xl hover:border-emerald-500/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold grid place-items-center">
                  {rev.reviewerName.substring(0, 2).toUpperCase()}
                </span>
                <div>
                  <span className="font-medium text-foreground block text-sm">{rev.reviewerName}</span>
                  <span className="text-xs text-muted-foreground font-mono">{rev.reviewerOrganization}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase">
                  {rev.kind.replace("-", " ")}
                </span>
              </div>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed font-light italic">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
              <span>Project: {rev.projectTitle}</span>
              <span>Verified On: {rev.verifiedAt}</span>
            </div>
          </div>
        ))}
      </div>

    </PageTransition>
  );
}
