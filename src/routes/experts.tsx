import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SiteHeader, SiteFooter } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, ArrowRight, Award, Star, CheckCircle, Code } from "lucide-react";

export const Route = createFileRoute("/experts")({
  head: () => ({
    meta: [
      { title: "Verified AI Experts & Engineers — AI5K" },
      {
        name: "description",
        content:
          "Discover top AI engineers, RAG architects, and model fine-tuning specialists with verified capability scores and client attestations.",
      },
      { property: "og:title", content: "Verified AI Experts — AI5K" },
    ],
  }),
  component: ExpertsPage,
});

function ExpertsPage() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col justify-between font-sans">
      <SiteHeader />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        <PageTransition className="space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono tracking-wider uppercase">
              <Users className="size-3.5" />
              <span>Public Capabilities Guide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-white">
              Verified AI Experts & Engineers
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
              What you will get on AI5K Experts: Independent AI architects and engineers whose skills are proven through inspectable GitHub repositories, production benchmarks, and client reviews instead of self-declared resumes.
            </p>
          </div>

          {/* Verification Criteria (Architectural Line Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-neutral-800">
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">01 / INDEX</div>
              <h3 className="text-base font-medium text-white">Capability Index Ranking</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Engineers are scored on an objective 0–100 capability scale based on verifiable code commits, model benchmarks, and production deployments.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">02 / CODEBASE</div>
              <h3 className="text-base font-medium text-white">Inspectable Repositories</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Inspect public codebase proof, architecture diagrams, and test suites attached directly to professional profiles.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">03 / ATTESTATION</div>
              <h3 className="text-base font-medium text-white">Client Attestation & Reviews</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Verifiable feedback from enterprise buyers confirming completed project scopes and technical leadership.
              </p>
            </div>
          </div>

          {/* Featured Specialist Profile Preview */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-none bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#10b981] font-mono font-bold text-sm">
                  ER
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Dr. Elena Rostova</h3>
                  <p className="text-xs font-mono text-neutral-400">Principal Agentic AI Architect • Independent Specialist</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-mono bg-neutral-900 text-emerald-400 border border-emerald-800/80">Top 0.5% Capability Index</span>
            </div>

            <p className="text-neutral-400 text-xs font-light leading-relaxed">
              8+ years neural network optimization, vLLM fine-tuning, and multi-agent orchestration experience. Built enterprise RAG systems for Fortune 500 financial institutions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs text-neutral-400">
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-emerald-400 font-bold">98.4 Proof Score</div>
                <div className="text-[11px] text-neutral-500">Cryptographic Proof Index</div>
              </div>
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-white font-bold">14 Verified Repos</div>
                <div className="text-[11px] text-neutral-500">Inspectable Codebase</div>
              </div>
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-neutral-300 font-bold">$250 / hr</div>
                <div className="text-[11px] text-neutral-500">Advisory & Technical Lead</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 text-center space-y-6">
            <h3 className="text-xl font-normal text-white">Looking for top AI engineering talent?</h3>
            <p className="text-neutral-400 text-xs max-w-xl mx-auto font-light">
              Explore expert profiles before signing in, or create an account to hire verified specialists directly.
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
