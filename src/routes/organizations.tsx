import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SiteHeader, SiteFooter } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, ArrowRight, Users, CheckCircle2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/organizations")({
  head: () => ({
    meta: [
      { title: "AI Delivery Pods & Partner Organizations — AI5K" },
      {
        name: "description",
        content:
          "Discover pre-assembled multidisciplinary AI engineering pods and verified partner organizations ready for immediate deployment.",
      },
      { property: "og:title", content: "AI Delivery Pods — AI5K" },
    ],
  }),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col justify-between font-sans">
      <SiteHeader />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        <PageTransition className="space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wider uppercase">
              <Building2 className="size-3.5" />
              <span>Public Capabilities Guide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-white">
              AI Delivery Pods & Organizations
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
              What you will get on AI5K Organizations: Pre-assembled 4-to-6 person engineering teams (Lead Architect, RAG Engineer, Quantization Lead, and Security Auditor) backed by verified corporate attestations and sprint SLA contracts.
            </p>
          </div>

          {/* Pod Pillars (Architectural Line Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-neutral-800">
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">01 / PODS</div>
              <h3 className="text-base font-medium text-white">Pre-Assembled Pod Roles</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Skip months of recruiting. Access fully aligned engineering pods with complementary skill sets ready for immediate deployment.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">02 / COMPLIANCE</div>
              <h3 className="text-base font-medium text-white">Corporate Attestations</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Organizations hold verified Tier-1 client attestations, SOC2 Type II, HIPAA, and ISO security compliance credentials.
              </p>
            </div>

            <div className="space-y-3 md:border-l md:border-neutral-800/80 md:pl-8">
              <div className="font-mono text-xs text-[#15846E] tracking-widest font-semibold">03 / PRICING</div>
              <h3 className="text-base font-medium text-white">Sprint & Fixed SLA Pricing</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Transparent sprint packages and milestone-driven contracts backed by AI5K platform escrow and progress tracking.
              </p>
            </div>
          </div>

          {/* Sample Delivery Pod */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-[#15846E] uppercase tracking-widest">Featured Delivery Pod</span>
                <h3 className="text-xl font-medium text-white mt-1">Mortgage AI Automation Pod</h3>
                <p className="text-xs font-mono text-neutral-400">by Apex AI Network</p>
              </div>
              <span className="px-3 py-1 text-xs font-mono bg-neutral-900 text-emerald-400 border border-emerald-800/80">100% Immediate Capacity</span>
            </div>

            <p className="text-neutral-400 text-xs font-light leading-relaxed">
              Pre-assembled 4-person team comprising Lead AI Architect, RAG Engineer, Quantization Specialist, and Security Auditor for financial processing automation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs text-neutral-400">
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-emerald-400 font-bold">12 Verified Capabilities</div>
                <div className="text-[11px] text-neutral-500">Pod Proof Signals</div>
              </div>
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-white font-bold">Tier-1 Client Verified</div>
                <div className="text-[11px] text-neutral-500">Banking Audit Proof</div>
              </div>
              <div className="p-3 bg-black border border-neutral-800">
                <div className="text-neutral-300 font-bold">$420 / hr</div>
                <div className="text-[11px] text-neutral-500">Sprint Package Rate</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-8 border border-neutral-800 bg-neutral-950 text-center space-y-6">
            <h3 className="text-xl font-normal text-white">Need an entire AI engineering team?</h3>
            <p className="text-neutral-400 text-xs max-w-xl mx-auto font-light">
              Explore delivery pods before logging in, or create an account to request custom pod assembly for your organization.
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
