import { useState } from "react";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Layers, 
  Award, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  Cpu, 
  Zap,
  ChevronRight,
  ExternalLink,
  Lock,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricTile, SectionHeading, VerificationBadge } from "@/components/system/primitives";

export interface OrgTeamMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  status: "Active" | "Pending invitation" | "Inactive" | "Revoked" | "No longer affiliated";
  consentGiven: boolean;
  verifiedCapabilitiesCount: number;
}

export interface AggregatedCapability {
  name: string;
  category: string;
  totalCapabilities: number;
  contributors: { name: string; role: string; avatarInitials: string; verifiedCount: number }[];
}

const INITIAL_MEMBERS: OrgTeamMember[] = [
  { id: "tm-1", name: "Dr. Elena Rostova", role: "Principal Agentic Systems Architect", avatarInitials: "ER", status: "Active", consentGiven: true, verifiedCapabilitiesCount: 14 },
  { id: "tm-2", name: "Marcus Vance", role: "Lead RAG Systems Engineer", avatarInitials: "MV", status: "Active", consentGiven: true, verifiedCapabilitiesCount: 9 },
  { id: "tm-3", name: "Sarah Chen", role: "Inference & Quantization Lead", avatarInitials: "SC", status: "Active", consentGiven: true, verifiedCapabilitiesCount: 11 },
  { id: "tm-4", name: "David Kim", role: "Security & Compliance Specialist", avatarInitials: "DK", status: "Pending invitation", consentGiven: false, verifiedCapabilitiesCount: 5 },
  { id: "tm-5", name: "Alexei Miller", role: "Full-Stack AI Integrator", avatarInitials: "AM", status: "Inactive", consentGiven: false, verifiedCapabilitiesCount: 3 },
];

const AGGREGATED_CAPABILITIES: AggregatedCapability[] = [
  {
    name: "RAG Systems & Vector Search",
    category: "Retrieval Architecture",
    totalCapabilities: 18,
    contributors: [
      { name: "Dr. Elena Rostova", role: "Architect", avatarInitials: "ER", verifiedCount: 7 },
      { name: "Marcus Vance", role: "RAG Engineer", avatarInitials: "MV", verifiedCount: 8 },
      { name: "Sarah Chen", role: "Inference Lead", avatarInitials: "SC", verifiedCount: 3 },
    ],
  },
  {
    name: "Autonomous Agent Swarms",
    category: "Multi-Agent Systems",
    totalCapabilities: 14,
    contributors: [
      { name: "Dr. Elena Rostova", role: "Architect", avatarInitials: "ER", verifiedCount: 10 },
      { name: "Sarah Chen", role: "Inference Lead", avatarInitials: "SC", verifiedCount: 4 },
    ],
  },
  {
    name: "Model Quantization & vLLM",
    category: "High-Throughput Inference",
    totalCapabilities: 12,
    contributors: [
      { name: "Sarah Chen", role: "Inference Lead", avatarInitials: "SC", verifiedCount: 9 },
      { name: "Marcus Vance", role: "RAG Engineer", avatarInitials: "MV", verifiedCount: 3 },
    ],
  },
];

export function OrgOverview() {
  const [members, setMembers] = useState<OrgTeamMember[]>(INITIAL_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");

  const activeMembersCount = members.filter((m) => m.status === "Active").length;
  const pendingMembersCount = members.filter((m) => m.status === "Pending invitation").length;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const namePart = inviteEmail.split("@")[0] || "Contributor";
    const newMember: OrgTeamMember = {
      id: `tm-${Date.now()}`,
      name: namePart,
      role: inviteRole || "AI Engineering Specialist",
      avatarInitials: namePart.substring(0, 2).toUpperCase(),
      status: "Pending invitation",
      consentGiven: false,
      verifiedCapabilitiesCount: 0,
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setInviteRole("");
    setShowInviteModal(false);
  };

  const getStatusBadge = (status: OrgTeamMember["status"]) => {
    switch (status) {
      case "Active":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Active Member</Badge>;
      case "Pending invitation":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30"><Clock className="size-3 mr-1" /> Pending Invitation</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Inactive</Badge>;
      case "Revoked":
      case "No longer affiliated":
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Organization Header */}
      <div className="surface-card p-6 sm:p-8 border border-border/80 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building2 className="size-48 text-emerald-400" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-2xl font-bold text-emerald-400 font-mono shadow-inner">
              AF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Apex FinTech AI Labs</h1>
                <VerificationBadge level="attested" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enterprise AI Delivery Pod & Custom Model Fine-tuning Organization
              </p>
            </div>
          </div>
          <Button onClick={() => setShowInviteModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
            <UserPlus className="size-4 mr-2" /> Invite Contributor
          </Button>
        </div>

        {/* Posture & Focus Badges */}
        <div className="mt-6 pt-6 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-mono">Service Lines:</span>
          <Badge variant="outline" className="bg-surface border-border">Financial Risk Modeling</Badge>
          <Badge variant="outline" className="bg-surface border-border">Autonomous Underwriting</Badge>
          <Badge variant="outline" className="bg-surface border-border">RAG Knowledge Engines</Badge>
          <span className="mx-2 text-border">|</span>
          <span className="text-muted-foreground font-mono">Security Posture:</span>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <ShieldCheck className="size-3 mr-1" /> SOC2 Type II Certified
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            HIPAA Compliant
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile label="Active Team Contributors" value={activeMembersCount} hint="Consent verified" />
        <MetricTile label="Pending Invitations" value={pendingMembersCount} hint="Awaiting contributor signoff" />
        <MetricTile label="Aggregated Capability Index" value="98.2 / 100" delta={8.5} hint="Proof-weighted collective score" />
        <MetricTile label="Active Delivery Pods" value="2 Pods" hint="Mortgage AI & Healthcare Pods" />
      </div>

      {/* Team Capability Aggregator */}
      <div className="space-y-4">
        <SectionHeading
          eyebrow="Capability Provenance"
          title="Team Capability Aggregation"
          description="Visual provenance breaking down where organization capabilities originate from verified team members."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGGREGATED_CAPABILITIES.map((cap, idx) => (
            <div key={idx} className="surface-card p-5 border border-border/80 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase">{cap.category}</span>
                <Badge variant="outline" className="font-mono text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {cap.totalCapabilities} Verified Signals
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-foreground">{cap.name}</h3>

              <div className="space-y-2 border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground font-mono uppercase block">Key Contributors:</span>
                {cap.contributors.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between text-xs p-2 rounded bg-background/50 border border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="size-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center">
                        {c.avatarInitials}
                      </span>
                      <div>
                        <span className="font-medium text-foreground block">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.role}</span>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">{c.verifiedCount} proofs</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roster & Consent States */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeading
            eyebrow="Organization Roster"
            title="Team Members & Membership States"
            description="Manage member consent, capacity allocation, and role assignments."
          />
          <Button variant="outline" onClick={() => setShowInviteModal(true)} size="sm" className="border-border">
            <UserPlus className="size-4 mr-1.5" /> Add Member
          </Button>
        </div>

        <div className="surface-card overflow-hidden border border-border/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/90 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border/80">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Role / Title</th>
                <th className="p-4">Membership Status</th>
                <th className="p-4">Consent Status</th>
                <th className="p-4">Verified Proofs</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-accent/40 transition-colors">
                  <td className="p-4 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-surface border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground">
                        {member.avatarInitials}
                      </div>
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground font-mono">{member.role}</td>
                  <td className="p-4">{getStatusBadge(member.status)}</td>
                  <td className="p-4">
                    {member.consentGiven ? (
                      <span className="inline-flex items-center text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="size-3.5 mr-1" /> Consent Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-amber-400 font-mono">
                        <Lock className="size-3.5 mr-1" /> Awaiting Consent
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs text-foreground font-semibold">
                    {member.verifiedCapabilitiesCount} Verified
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md surface-card border border-border/90 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="text-lg font-semibold text-foreground">Invite Team Contributor</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowInviteModal(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Contributor Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@apexfintech.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Organization Role / Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead RAG Systems Architect"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                An automated AI5K membership consent invitation will be sent. The contributor must sign in and approve capability aggregation before their verified proofs are listed under Apex FinTech.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
