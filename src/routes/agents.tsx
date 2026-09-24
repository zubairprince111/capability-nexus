import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SiteHeader, SiteFooter } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { Cpu, ShieldCheck, ArrowRight, Zap, CheckCircle2, Lock, Terminal } from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "AI Agents & Autonomous Swarms — AI5K" },
      {
        name: "description",
        content:
          "Discover verified autonomous AI agents and agentic swarms built with inspectable proof, zero data leaks, and proven execution benchmarks.",
      },
      { property: "og:title", content: "Verified AI Agents — AI5K" },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col justify-between font-sans">
      <SiteHeader />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        <PageTransition className="space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase">
              <Cpu className="size-3.5" />
              <span>Public Capabilities Guide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-white">
              Autonomous AI Agents & Swarms
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
              Inspect what you get on AI5K: Production-ready autonomous agents trained for high-stakes workflows, backed by zero-leak audit trails and cryptographically verified performance benchmarks.
            </p>
          </div>

          {/* Core Feature Breakdown (Architectural Line Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-neutral-800">
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">01 / PROOF</div>
              <h3 className="text-base font-medium text-white">Inspectable Proof Signals</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Every listed agent includes verifiable RAG execution logs, SOC2 Type II certifications, and precision test suites evaluated against real datasets.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">02 / SECURITY</div>
              <h3 className="text-base font-medium text-white">Zero Data-Leak Audits</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Agents operate within encrypted VPC containers or local runtimes with automated PII masking and immutable audit logs.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">03 / DEPLOYMENT</div>
              <h3 className="text-base font-medium text-white">Turnkey API & Container Deployment</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Instantly connect via REST/GraphQL endpoints or deploy pre-configured Docker/Kubernetes helm charts directly into your infrastructure.
              </p>
            </div>
          </div>

          {/* Sample Featured Agent Types */}
          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-normal text-white">Featured Agent Architectures</h2>
            <div className="divide-y divide-neutral-800 border-y border-neutral-800">
              <div className="py-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">Financial & Mortgage</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono border border-emerald-800/80 text-emerald-400 bg-emerald-950/40">Attested</span>
                  </div>
                </div>
                <h4 className="text-lg font-medium text-white">Autonomous Loan Underwriting Agent</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-2xl">
                  Parses complex mortgage deeds, extracts PII with zero leak audit logs, and scores credit risk in under 3 minutes with 99.4% precision.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50">SOC2 Type II</span>
                  <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50">Sub-3min Processing</span>
                  <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50">API or On-Prem</span>
                </div>
              </div>

              <div className="py-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">Customer Support & Operations</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono border border-neutral-700 text-neutral-300 bg-neutral-900">Reviewed</span>
                  </div>
                </div>
                <h4 className="text-lg font-medium text-white">Support Escalation Agent Swarm</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-2xl">
                  Resolves 80%+ of repetitive support tickets automatically with human-in-the-loop escalation workflows and verified SLA compliance.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50">10k+ Executed Logs</span>
                  <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50">Zendesk / Hubspot / Slack</span>
                  <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-900/50">4.9 Verified Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 text-center space-y-6">
            <h3 className="text-xl font-normal text-white">Ready to explore agents or launch your own?</h3>
            <p className="text-neutral-400 text-xs max-w-xl mx-auto font-light">
              Preview verified agents before creating an account, or log in to deploy agents directly into your projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold px-6 font-mono text-xs tracking-wider rounded-none">
                <Link to="/discover">PREVIEW BEFORE LOGIN <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-neutral-800 bg-transparent hover:bg-neutral-900 text-white font-mono text-xs rounded-none">
                <Link to="/auth/signup">CREATE ACCOUNT</Link>
              </Button>
            </div>
          </div>
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
