import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MOCK_DELIVERY_PODS } from "@/lib/services/ai5k-service";
import { DeliveryPod, DeliveryPodMember } from "@/lib/types";
import { Zap, Users, ShieldCheck, Plus, Trash2, CheckCircle2, ArrowRight } from "lucide-react";

export function DeliveryPodBuilder() {
  const [pods, setPods] = useState<DeliveryPod[]>(MOCK_DELIVERY_PODS);
  
  // New Pod Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [podName, setPodName] = useState("");
  const [targetOutcome, setTargetOutcome] = useState("");
  const [hourlyRate, setHourlyRate] = useState("$350/hr");

  // Temporary members list for new pod
  const [members, setMembers] = useState<DeliveryPodMember[]>([
    { id: "1", name: "Dr. Elena Rostova", role: "Agentic Systems Lead", avatarInitials: "ER", capabilityContribution: "Multi-Agent Orchestration & CUDA Tuning", capacityPercentage: 100 },
    { id: "2", name: "Marcus Vance", role: "RAG Systems Engineer", avatarInitials: "MV", capabilityContribution: "Vector Indexing & Hybrid Search", capacityPercentage: 80 },
  ]);

  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberContribution, setMemberContribution] = useState("");

  const handleAddMember = () => {
    if (!memberName.trim()) return;
    const newMember: DeliveryPodMember = {
      id: Date.now().toString(),
      name: memberName.trim(),
      role: memberRole.trim() || "AI Specialist",
      avatarInitials: memberName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "AI",
      capabilityContribution: memberContribution.trim() || "Verified Capability",
      capacityPercentage: 100,
    };
    setMembers([...members, newMember]);
    setMemberName("");
    setMemberRole("");
    setMemberContribution("");
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleCreatePod = () => {
    if (!podName.trim()) return;
    const newPod: DeliveryPod = {
      id: `pod-${Date.now()}`,
      name: podName.trim(),
      organizationId: "org-lab-alpha",
      targetOutcome: targetOutcome.trim() || "Automated AI capability delivery.",
      capabilityCoverage: Math.min(100, 75 + members.length * 7),
      hourlyRate: hourlyRate.trim() || "$350/hr",
      status: "active",
      members,
    };
    setPods([newPod, ...pods]);
    setPodName("");
    setTargetOutcome("");
    setCreateOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono text-[11px] mb-1">
            <Zap className="size-3" />
            <span>Organization Workspace</span>
          </div>
          <h1 className="text-2xl font-normal text-foreground tracking-tight">Delivery Pod Builder</h1>
          <p className="text-xs text-muted-foreground font-light">
            Assemble multi-disciplinary AI delivery pods with verified team capability aggregation.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold font-mono text-xs gap-1.5">
              <Plus className="size-3.5" />
              Build New Pod
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-neutral-950 border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-normal text-white">Assemble AI Delivery Pod</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="pod-name" className="text-xs font-mono uppercase text-neutral-400">Pod Name</Label>
                <Input 
                  id="pod-name" 
                  value={podName} 
                  onChange={(e) => setPodName(e.target.value)} 
                  placeholder="e.g. Mortgage AI Automation Pod"
                  className="bg-neutral-900 border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pod-rate" className="text-xs font-mono uppercase text-neutral-400">Hourly / Sprint Rate</Label>
                  <Input 
                    id="pod-rate" 
                    value={hourlyRate} 
                    onChange={(e) => setHourlyRate(e.target.value)} 
                    placeholder="e.g. $400/hr"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-neutral-400">Calculated Coverage</Label>
                  <div className="h-10 px-3 rounded bg-neutral-900 border border-neutral-800 flex items-center font-mono text-xs text-emerald-400">
                    {Math.min(100, 75 + members.length * 7)}% Verified
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pod-outcome" className="text-xs font-mono uppercase text-neutral-400">Target Outcome</Label>
                <Textarea 
                  id="pod-outcome" 
                  rows={2}
                  value={targetOutcome} 
                  onChange={(e) => setTargetOutcome(e.target.value)} 
                  placeholder="Describe target deliverable (e.g. End-to-end loan document processing engine)"
                  className="bg-neutral-900 border-neutral-800 text-white resize-none text-xs"
                />
              </div>

              {/* Members Section */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <Label className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between">
                  <span>Assigned Team Members ({members.length})</span>
                </Label>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {members.map((m) => (
                    <div key={m.id} className="p-2.5 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-medium text-white block">{m.name} ({m.role})</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{m.capabilityContribution}</span>
                      </div>
                      <button onClick={() => handleRemoveMember(m.id)} className="text-neutral-500 hover:text-red-400 p-1">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <Input 
                    placeholder="Member Name" 
                    value={memberName} 
                    onChange={(e) => setMemberName(e.target.value)}
                    className="text-xs bg-neutral-900 border-neutral-800 text-white h-8"
                  />
                  <Input 
                    placeholder="Role (e.g. RAG Lead)" 
                    value={memberRole} 
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="text-xs bg-neutral-900 border-neutral-800 text-white h-8"
                  />
                  <Button type="button" size="sm" onClick={handleAddMember} className="h-8 text-xs bg-neutral-800 hover:bg-neutral-700 text-white">
                    + Add Member
                  </Button>
                </div>
              </div>

              <Button onClick={handleCreatePod} className="w-full bg-[#15846E] hover:bg-[#10b981] text-black font-semibold mt-2">
                Save & Deploy Pod
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Pods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pods.map((pod) => (
          <div key={pod.id} className="rounded-xl border border-border/80 bg-surface/40 p-6 space-y-5 hover:border-cyan-500/30 transition-all group relative">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">
                  {pod.status.toUpperCase()} POD
                </span>
                <h3 className="text-lg font-medium text-foreground group-hover:text-cyan-400 transition-colors">
                  {pod.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono text-xs">
                {pod.hourlyRate}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              {pod.targetOutcome}
            </p>

            {/* Capability Coverage Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Capability Coverage</span>
                <span className="text-emerald-400 font-bold">{pod.capabilityCoverage}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${pod.capabilityCoverage}%` }} />
              </div>
            </div>

            {/* Team Members List */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                Assigned Team ({pod.members.length})
              </span>
              <div className="grid grid-cols-1 gap-2">
                {pod.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-2 rounded bg-surface-foreground/5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="size-6 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold grid place-items-center shrink-0">
                        {m.avatarInitials}
                      </span>
                      <div className="min-w-0">
                        <span className="font-medium text-foreground truncate block">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate block">{m.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">{m.capacityPercentage}% Capacity</span>
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
