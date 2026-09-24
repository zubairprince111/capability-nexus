import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Search, 
  Cpu, 
  Code2, 
  Users, 
  Building2, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Filter
} from "lucide-react";

import { PageTransition } from "@/components/motion/primitives";
import { SectionHeading, VerificationBadge } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { marketplaceListingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/app/marketplace")({
  validateSearch: (search: Record<string, unknown>): { category?: string | undefined } => ({
    category: typeof search["category"] === "string" ? search["category"] : "all",
  }),
  head: () => ({
    meta: [
      { title: "Marketplace — AI5K Verified Capability" },
      { name: "description", content: "Discover verified AI agents, services, experts, and delivery pods with evidence." },
      { property: "og:title", content: "Marketplace — AI5K Verified Capability" },
      { property: "og:description", content: "Discover verified AI agents, services, experts, and delivery pods with evidence." },
    ],
  }),
  component: MarketplacePage,
});



function MarketplacePage() {
  const { category: initialCategory } = Route.useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: marketplaceListings = [] } = useQuery(marketplaceListingsQuery());

  const filteredListings = marketplaceListings.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <PageTransition className="space-y-8 pb-16">
      <SectionHeading
        eyebrow="Verified AI Marketplace"
        title="Discover Proven AI Solutions"
        description="Browse verified AI agents, services, experts, and delivery pods — every claim backed by inspectable evidence."
      />

      {/* Natural Language Search & Category Filters */}
      <div className="surface-card p-4 sm:p-6 border border-border/80 rounded-2xl space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-emerald-400" />
          <Input
            placeholder="Describe what you are looking for (e.g. RAG system for financial documents, customer support agent)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 bg-background/60 border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold"
                : "bg-surface/60 border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="size-3.5" /> All Listings ({marketplaceListings.length})
          </button>
          <button
            onClick={() => setSelectedCategory("agent")}
            className={`px-4 py-2 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === "agent"
                ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-400 font-semibold"
                : "bg-surface/60 border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="size-3.5 text-cyan-400" /> AI Agents
          </button>
          <button
            onClick={() => setSelectedCategory("service")}
            className={`px-4 py-2 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === "service"
                ? "bg-purple-500/15 border-purple-500/50 text-purple-400 font-semibold"
                : "bg-surface/60 border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="size-3.5 text-purple-400" /> AI Services
          </button>
          <button
            onClick={() => setSelectedCategory("expert")}
            className={`px-4 py-2 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === "expert"
                ? "bg-blue-500/15 border-blue-500/50 text-blue-400 font-semibold"
                : "bg-surface/60 border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5 text-blue-400" /> AI Experts
          </button>
          <button
            onClick={() => setSelectedCategory("pod")}
            className={`px-4 py-2 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === "pod"
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold"
                : "bg-surface/60 border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="size-3.5 text-emerald-400" /> Delivery Pods
          </button>
        </div>
      </div>

      {/* Marketplace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border rounded-2xl bg-surface/40">
            <Search className="size-8 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground">No matching marketplace listings</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Try broadening your query or describe your custom requirement using the Intake Wizard.
            </p>
            <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white">
              <Link to="/app/buyer/intake">Start Intake Wizard</Link>
            </Button>
          </div>
        ) : (
          filteredListings.map((item) => (
            <div
              key={item.id}
              className="surface-card p-6 border border-border/80 rounded-2xl flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-all group hover:shadow-lg hover:shadow-emerald-950/20"
            >
              <div className="space-y-4">
                {/* Header: Category Badge & Verification */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize text-[11px] font-mono bg-surface border-border">
                    {item.category === "pod" ? "Delivery Pod" : item.category === "agent" ? "AI Agent" : item.category}
                  </Badge>
                  <VerificationBadge level={item.verificationLevel} />
                </div>

                {/* Title & Provider */}
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    by <span className="text-foreground font-medium">{item.providerName}</span>
                  </p>
                </div>

                {/* Headline & Description */}
                <p className="text-sm text-foreground/90 font-medium leading-snug">
                  {item.headline}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Trust Proof Signals */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Verified Proof Signals:
                  </span>
                  {item.proofSignals.map((signal, sIdx) => (
                    <div key={sIdx} className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>

                {/* Capabilities Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.capabilities.map((cap, cIdx) => (
                    <Badge key={cIdx} variant="outline" className="text-[10px] bg-background/50 border-border/60 text-muted-foreground">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Footer: Pricing & Action */}
              <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">Pricing / Rate</span>
                  <span className="text-xs font-mono font-bold text-foreground">{item.priceBand}</span>
                </div>
                <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs">
                  <Link to={item.actionTarget as any}>
                    {item.actionLabel} <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
}
