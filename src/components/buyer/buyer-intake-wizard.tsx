import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Sparkles, Target, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function BuyerIntakeWizard() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState("");
  const [industry, setIndustry] = useState("Financial Services / FinTech");
  const [capabilities, setCapabilities] = useState("RAG Systems, Autonomous Agent Swarms, PII Redaction");
  const [outcome, setOutcome] = useState("");
  const [timeline, setTimeline] = useState("4 - 6 Weeks");
  const [budget, setBudget] = useState("$50,000 - $100,000");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate({ to: "/app/buyer/matches" });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
          Project Requirements & Scope
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
          Specify your technical objectives and constraints to connect with verified providers and delivery pods.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-4 backdrop-blur-xl">
          <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 grid place-items-center mx-auto animate-pulse">
            <ShieldCheck className="size-6" />
          </div>
          <h2 className="text-2xl font-normal text-foreground">Requisition Submitted</h2>
          <p className="text-xs font-mono text-emerald-400">
            Scanning verified evidence logs & matching delivery pods...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitIntake} className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-surface/50 space-y-6 backdrop-blur-xl shadow-xl">
          
          <div className="space-y-2">
            <Label htmlFor="problem" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              1. What core problem or process are you solving?
            </Label>
            <Textarea
              id="problem"
              rows={4}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Manual underwriting of loan documents takes 48 hours. We need an automated agentic pipeline to extract metadata, perform PII redaction, and score applications."
              className="bg-background/60 border-border text-foreground text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                2. Industry / Domain
              </Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. FinTech / Healthcare / Logistics"
                className="bg-background/60 border-border text-foreground text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                3. Desired Timeline
              </Label>
              <Input
                id="timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 6 Weeks"
                className="bg-background/60 border-border text-foreground text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capabilities" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              4. Required Capabilities & Technologies
            </Label>
            <Input
              id="capabilities"
              value={capabilities}
              onChange={(e) => setCapabilities(e.target.value)}
              placeholder="e.g. RAG Systems, Multi-Agent Swarms, vLLM, SOC2 Compliance"
              className="bg-background/60 border-border text-foreground text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="outcome" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                5. Expected Quantitative Outcome
              </Label>
              <Input
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="e.g. Sub-3 minute underwriting latency"
                className="bg-background/60 border-border text-foreground text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                6. Allocated Budget Range
              </Label>
              <Input
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $75,000 - $120,000"
                className="bg-background/60 border-border text-foreground text-sm font-mono"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-semibold font-mono text-xs tracking-wider uppercase group">
            Discover Verified Matches
            <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
          </Button>

        </form>
      )}

    </div>
  );
}
