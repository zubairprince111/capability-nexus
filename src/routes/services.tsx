import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SiteHeader, SiteFooter } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { Code2, ShieldCheck, ArrowRight, Database, Server, Cpu } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Verified AI Services & RAG Pipelines — AI5K" },
      {
        name: "description",
        content:
          "Explore custom vector knowledge bases, model fine-tuning, RAG pipelines, and enterprise AI workflows verified with inspectable performance benchmarks.",
      },
      { property: "og:title", content: "Verified AI Services — AI5K" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col justify-between font-sans">
      <SiteHeader />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        <PageTransition className="space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono tracking-wider uppercase">
              <Code2 className="size-3.5" />
              <span>Public Capabilities Guide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-white">
              Enterprise AI Services & Workflows
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
              What you will get from AI5K Services: Verified RAG knowledge engines, custom LLM fine-tuning, vector database optimization, and high-performance inference APIs built with inspectable proof.
            </p>
          </div>

          {/* Service Pillars (Architectural Line Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-neutral-800">
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">01 / RETRIEVAL</div>
              <h3 className="text-base font-medium text-white">Hybrid Sparse-Dense RAG</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Sub-50ms HNSW index queries for enterprise document search with VPC isolation and zero leakage across tenant boundaries.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">02 / TUNING</div>
              <h3 className="text-base font-medium text-white">Open Source Fine-Tuning</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Custom LoRA / QLoRA fine-tuning for open models (Llama 3.3, Qwen 2.5, DeepSeek) tuned specifically for your domain taxonomy.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">03 / INFERENCE</div>
              <h3 className="text-base font-medium text-white">High-Throughput vLLM Serving</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Production-grade model serving infrastructure with autoscaling GPU clusters and SLA latency guarantees.
              </p>
            </div>
          </div>

          {/* Service Showcase */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-[#15846E] uppercase tracking-widest">Featured Enterprise Service</span>
                <h3 className="text-xl font-medium text-white mt-1">Enterprise RAG Vector Knowledge Engine</h3>
              </div>
              <span className="px-3 py-1 text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">Verified Implementation</span>
            </div>
            <p className="text-neutral-400 text-xs font-light leading-relaxed">
              Complete document vectorization pipeline with sparse-dense hybrid retrieval, automated chunking, and deterministic anti-hallucination guardrails. Tested against 1M+ internal enterprise files.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs text-neutral-400">
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-emerald-400 font-bold">Sub-50ms HNSW</div>
                <div className="text-[11px] text-neutral-500">Query Latency</div>
              </div>
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-white font-bold">8 Deployed RAG Systems</div>
                <div className="text-[11px] text-neutral-500">Production Proof</div>
              </div>
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-neutral-300 font-bold">VPC Isolated</div>
                <div className="text-[11px] text-neutral-500">Security Architecture</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 text-center space-y-6">
            <h3 className="text-xl font-normal text-white">Need a custom AI service or RAG pipeline?</h3>
            <p className="text-neutral-400 text-xs max-w-xl mx-auto font-light">
              Use our structured intake wizard to submit your project requirements and receive verified proposals from certified providers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold px-6 font-mono text-xs tracking-wider rounded-none">
                <Link to="/discover">EXPLORE BEFORE LOGIN <ArrowRight className="ml-2 size-4" /></Link>
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
