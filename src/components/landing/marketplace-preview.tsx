import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { 
  Cpu, 
  Code2, 
  Users, 
  Zap, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/system/primitives";

interface PreviewItem {
  id: string;
  category: "agent" | "service" | "expert" | "organization" | "pod";
  title: string;
  headline: string;
  provider: string;
  priceBand: string;
  verificationLevel: "attested" | "verified" | "reviewed";
  proofSignals: string[];
  linkTarget: string;
  ctaText: string;
}

const PREVIEW_ITEMS: PreviewItem[] = [
  {
    id: "agent-1",
    category: "agent",
    title: "Autonomous Loan Underwriting Agent",
    headline: "Parses complex mortgage deeds, extracts PII with zero leak audit logs, and scores risk under 3 mins.",
    provider: "Apex FinTech AI Labs",
    priceBand: "From $1,200/mo API or $75k Deploy",
    verificationLevel: "attested",
    proofSignals: ["4 Demonstrated RAG Projects", "SOC2 Type II Certified", "99.4% Extraction Precision"],
    linkTarget: "/auth/signup",
    ctaText: "Explore Agent",
  },
  {
    id: "pod-1",
    category: "pod",
    title: "Mortgage AI Automation Pod",
    headline: "Pre-assembled 4-person team: Lead AI Architect, RAG Engineer, Quantization Lead, and Security Auditor.",
    provider: "Apex AI Network",
    priceBand: "$420/hr (Sprint Package)",
    verificationLevel: "attested",
    proofSignals: ["12 Verified Capabilities", "Tier-1 Bank Client Verification", "100% Immediate Capacity"],
    linkTarget: "/auth/signup",
    ctaText: "View Delivery Pod",
  },
  {
    id: "service-1",
    category: "service",
    title: "Enterprise RAG Vector Knowledge Engine",
    headline: "Hybrid sparse-dense indexing for internal documents with sub-50ms HNSW latency and VPC isolation.",
    provider: "Dr. Elena Rostova & Team",
    priceBand: "Starting at $45,000",
    verificationLevel: "verified",
    proofSignals: ["Sub-50ms Latency Benchmark", "8 Deployed RAG Systems", "Replicated Audit"],
    linkTarget: "/auth/signup",
    ctaText: "Request Implementation",
  },
  {
    id: "expert-1",
    category: "expert",
    title: "Dr. Elena Rostova",
    headline: "Principal Agentic AI Architect with 8+ years neural network optimization & vLLM fine-tuning experience.",
    provider: "Independent Specialist",
    priceBand: "$250/hr (Advisory & Lead)",
    verificationLevel: "attested",
    proofSignals: ["Top 0.5% Capability Index", "14 Verified Repositories", "Cryptographic Proof Score 98.4"],
    linkTarget: "/auth/signup",
    ctaText: "View Expert Profile",
  },
  {
    id: "pod-2",
    category: "pod",
    title: "Healthcare Clinical RAG Pod",
    headline: "HIPAA-compliant clinical decision support and EHR vector indexing pod.",
    provider: "BioNeuron Labs",
    priceBand: "$380/hr",
    verificationLevel: "verified",
    proofSignals: ["HIPAA Audit Attested", "99.6% Medical Paper Extraction", "Clinical Dataset Certified"],
    linkTarget: "/auth/signup",
    ctaText: "View Delivery Pod",
  },
  {
    id: "agent-2",
    category: "agent",
    title: "Support Escalation Agent Swarm",
    headline: "Resolves 80%+ repetitive support tickets automatically with human escalation workflows.",
    provider: "Automation Studio",
    priceBand: "From $850/mo",
    verificationLevel: "reviewed",
    proofSignals: ["10,000+ Executed Ticket Logs", "Zero Plain-Text Leak Audit", "4.9 Verified Review"],
    linkTarget: "/auth/signup",
    ctaText: "Explore Agent",
  },
];

export function MarketplacePreview() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredItems = PREVIEW_ITEMS.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <section className="relative w-full bg-black text-white py-24 border-t border-white/10 overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="size-1.5 rounded-full bg-[#10b981]" />
              <span className="text-xs font-mono tracking-[0.2em] text-[#10b981] uppercase">
                Explore
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white">
              What you can discover on AI5K
            </h2>
            <p className="text-base text-neutral-400 font-light mt-2 max-w-xl">
              Preview real verified agents, services, experts, and delivery pods — every claim backed by inspectable proof.
            </p>
          </div>

          <Button
            asChild
            className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold font-mono text-xs tracking-wider rounded-none shrink-0"
          >
            <Link to="/auth/signup">
              Explore Full Marketplace <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 font-mono text-xs border-b border-neutral-900">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-none transition-all shrink-0 flex items-center gap-1.5 border ${
              activeTab === "all"
                ? "bg-[#15846E]/20 border-[#10b981] text-[#10b981] font-semibold"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800"
            }`}
          >
            All Preview Items
          </button>
          <button
            onClick={() => setActiveTab("agent")}
            className={`px-4 py-2 rounded-none transition-all shrink-0 flex items-center gap-1.5 border ${
              activeTab === "agent"
                ? "bg-[#15846E]/20 border-[#10b981] text-[#10b981] font-semibold"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800"
            }`}
          >
            <Cpu className="size-3.5 text-neutral-400" /> AI Agents
          </button>
          <button
            onClick={() => setActiveTab("service")}
            className={`px-4 py-2 rounded-none transition-all shrink-0 flex items-center gap-1.5 border ${
              activeTab === "service"
                ? "bg-[#15846E]/20 border-[#10b981] text-[#10b981] font-semibold"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800"
            }`}
          >
            <Code2 className="size-3.5 text-neutral-400" /> AI Services
          </button>
          <button
            onClick={() => setActiveTab("expert")}
            className={`px-4 py-2 rounded-none transition-all shrink-0 flex items-center gap-1.5 border ${
              activeTab === "expert"
                ? "bg-[#15846E]/20 border-[#10b981] text-[#10b981] font-semibold"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800"
            }`}
          >
            <Users className="size-3.5 text-neutral-400" /> AI Experts
          </button>
          <button
            onClick={() => setActiveTab("pod")}
            className={`px-4 py-2 rounded-none transition-all shrink-0 flex items-center gap-1.5 border ${
              activeTab === "pod"
                ? "bg-[#15846E]/20 border-[#10b981] text-[#10b981] font-semibold"
                : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800"
            }`}
          >
            <Zap className="size-3.5 text-neutral-400" /> Delivery Pods
          </button>
        </div>

        {/* High-Grade Architectural Line Catalog (No cards) */}
        <div className="border-t border-neutral-800 divide-y divide-neutral-800/80">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="py-6 px-2 hover:bg-neutral-950/60 transition-colors group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Category, Title, Provider, Headline */}
              <div className="space-y-2 lg:max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border border-neutral-800 text-neutral-400 bg-neutral-900/50">
                    {item.category === "pod" ? "Delivery Pod" : item.category === "agent" ? "AI Agent" : item.category}
                  </span>
                  <VerificationBadge level={item.verificationLevel} />
                  <span className="text-xs font-mono text-neutral-500">
                    by <span className="text-neutral-300 font-normal">{item.provider}</span>
                  </span>
                </div>

                <h3 className="text-lg font-medium text-white group-hover:text-[#10b981] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {item.headline}
                </p>

                {/* Inline Proof Signals */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-[11px] text-neutral-400">
                  {item.proofSignals.map((signal, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-emerald-400/90">
                      <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Pricing & Action */}
              <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-900">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Pricing</span>
                  <span className="text-xs font-mono font-medium text-white">{item.priceBand}</span>
                </div>

                <Button
                  asChild
                  size="sm"
                  className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-xs rounded-none font-mono tracking-wider px-5"
                >
                  <Link to={item.linkTarget as any}>
                    {item.ctaText} <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Intake Link (Architectural Hairline Container) */}
        <div className="mt-16 p-8 border border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="text-xs font-mono text-[#10b981] tracking-widest uppercase mb-1">INTAKE WIZARD</div>
            <h3 className="text-xl font-normal text-white">Have a specific AI system requirement?</h3>
            <p className="text-xs text-neutral-400 mt-1 font-light max-w-xl">
              Describe your problem in plain natural language and AI5K will return verifiable matches.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold font-mono text-xs tracking-wider rounded-none shrink-0 px-6"
          >
            <Link to="/auth/signup">
              Start Intake Wizard <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
