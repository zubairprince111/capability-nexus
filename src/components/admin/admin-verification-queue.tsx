import { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  Filter, 
  Search, 
  Clock, 
  AlertTriangle,
  FileCheck,
  Building2,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MetricTile, SectionHeading } from "@/components/system/primitives";
import { AuditState, DetailedEvidenceType } from "@/lib/types";

export interface PendingEvidenceItem {
  id: string;
  contributorName: string;
  contributorType: "professional" | "organization";
  title: string;
  evidenceType: DetailedEvidenceType;
  relatedCapability: string;
  source: string;
  proofUrl: string;
  submittedAt: string;
  status: AuditState;
  auditDetails: string;
  verificationScore?: number;
}

const INITIAL_QUEUE: PendingEvidenceItem[] = [
  {
    id: "ev-901",
    contributorName: "Dr. Elena Rostova",
    contributorType: "professional",
    title: "vLLM Multi-GPU Quantization Benchmark Suite",
    evidenceType: "assessed",
    relatedCapability: "Model Quantization & Inference",
    source: "Automated Benchmarking Engine #vLLM-992",
    proofUrl: "https://github.com/ai5k-proofs/vllm-quant-benchmark",
    submittedAt: "2026-09-24 10:15",
    status: "pending",
    auditDetails: "Independent automated benchmark test reported 4.2x throughput increase at 4-bit FP4 precision on 8x H100 GPUs.",
    verificationScore: 98,
  },
  {
    id: "ev-902",
    contributorName: "Apex FinTech Labs",
    contributorType: "organization",
    title: "SOC2 Type II PII Redaction Audit Certificate",
    evidenceType: "client-verified",
    relatedCapability: "PII Masking & Compliance",
    source: "Deloitte Third-Party Security Audit #48102",
    proofUrl: "https://audit.deloitte-verify.com/attestation/48102",
    submittedAt: "2026-09-23 16:40",
    status: "pending",
    auditDetails: "Third-party audit verifying zero plain-text leaks across 10 million simulated financial records.",
    verificationScore: 99,
  },
  {
    id: "ev-903",
    contributorName: "Marcus Vance",
    contributorType: "professional",
    title: "RAG Vector Indexing Benchmark on 100M Documents",
    evidenceType: "project-demonstrated",
    relatedCapability: "RAG Systems",
    source: "Client Attestation (Vanguard Credit Corp)",
    proofUrl: "https://ai5k.network/attestations/vanguard-909",
    submittedAt: "2026-09-22 09:30",
    status: "pending",
    auditDetails: "Sub-50ms latency on hybrid sparse-dense retrieval over HNSW index.",
    verificationScore: 94,
  },
  {
    id: "ev-904",
    contributorName: "Sarah Chen",
    contributorType: "professional",
    title: "NVIDIA TensorRT-LLM Certification",
    evidenceType: "certification-backed",
    relatedCapability: "CUDA Kernel Tuning",
    source: "NVIDIA Deep Learning Institute",
    proofUrl: "https://nvidia.com/dli/certificates/881290",
    submittedAt: "2026-09-21 14:00",
    status: "verified",
    auditDetails: "Verified directly via NVIDIA DLI OAuth API.",
    verificationScore: 100,
  },
];

export function AdminVerificationQueue() {
  const [items, setItems] = useState<PendingEvidenceItem[]>(INITIAL_QUEUE);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItem, setActiveItem] = useState<PendingEvidenceItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesType = selectedType === "all" || item.evidenceType === selectedType;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedCapability.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const verifiedCount = items.filter((i) => i.status === "verified").length;
  const rejectedCount = items.filter((i) => i.status === "rejected").length;

  const handleUpdateStatus = (id: string, newStatus: AuditState) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (activeItem?.id === id) {
      setActiveItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const getTypeBadgeColor = (type: DetailedEvidenceType) => {
    switch (type) {
      case "client-verified":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "assessed":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "certification-backed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "project-demonstrated":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusBadge = (status: AuditState) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="size-3 mr-1" /> Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            <XCircle className="size-3 mr-1" /> Rejected
          </Badge>
        );
      case "needs-clarification":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            <HelpCircle className="size-3 mr-1" /> Clarification Requested
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            <Clock className="size-3 mr-1" /> Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="AI5K Operations — Network Governance"
        title="Evidence Review & Verification Queue"
        description="Inspect submitted proof artifacts, verify third-party attestations, and maintain network capability integrity."
      />

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Pending Verifications"
          value={pendingCount}
          hint="Requires human/automated review"
        />
        <MetricTile
          label="Verified Evidence Items"
          value={verifiedCount}
          delta={12.4}
          hint="Verified at source or by audit"
        />
        <MetricTile
          label="Rejected / Flagged Claims"
          value={rejectedCount}
          hint="Failed proof validation threshold"
        />
        <MetricTile
          label="Verification Health Index"
          value="99.4%"
          hint="Cryptographic audit compliance score"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-surface/80 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search contributor, capability, or proof title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/60 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Filter className="size-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 px-3 text-xs rounded-md border border-border/60 bg-background text-foreground shrink-0 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Evidence Types</option>
            <option value="assessed">Assessed</option>
            <option value="client-verified">Client-Verified</option>
            <option value="certification-backed">Certification-Backed</option>
            <option value="project-demonstrated">Project-Demonstrated</option>
            <option value="self-declared">Self-Declared</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 text-xs rounded-md border border-border/60 bg-background text-foreground shrink-0 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="needs-clarification">Needs Clarification</option>
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="surface-card overflow-hidden border border-border/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/90 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border/80">
              <tr>
                <th className="p-4">Contributor</th>
                <th className="p-4">Evidence Title & Capability</th>
                <th className="p-4">Type</th>
                <th className="p-4">Source / Proof</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No evidence items match your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {item.contributorType === "organization" ? (
                          <Building2 className="size-4 text-cyan-400 shrink-0" />
                        ) : (
                          <UserCheck className="size-4 text-emerald-400 shrink-0" />
                        )}
                        <span>{item.contributorName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {item.relatedCapability}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={`capitalize text-xs ${getTypeBadgeColor(item.evidenceType)}`}>
                        {item.evidenceType.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="p-4 max-w-xs truncate text-xs text-muted-foreground font-mono">
                      <div className="truncate">{item.source}</div>
                      <a
                        href={item.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1 font-sans text-xs"
                      >
                        Inspect Artifact <ExternalLink className="size-3" />
                      </a>
                    </td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveItem(item)}
                        className="text-xs h-8 border-border hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        Audit Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal / Panel */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl surface-card border border-border/90 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border/80 pb-4">
              <div>
                <Badge variant="outline" className={`capitalize mb-2 text-xs ${getTypeBadgeColor(activeItem.evidenceType)}`}>
                  {activeItem.evidenceType.replace("-", " ")}
                </Badge>
                <h3 className="text-xl font-semibold text-foreground">{activeItem.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Submitted by <strong className="text-foreground">{activeItem.contributorName}</strong> on {activeItem.submittedAt}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveItem(null)} className="text-muted-foreground">
                ✕
              </Button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-background/60 border border-border/60">
                <div>
                  <span className="text-xs text-muted-foreground font-mono uppercase block">Target Capability</span>
                  <span className="font-semibold text-foreground">{activeItem.relatedCapability}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono uppercase block">Verification Score</span>
                  <span className="font-semibold text-emerald-400">{activeItem.verificationScore ?? 95}/100</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-muted-foreground mb-1">Source & Attestation Channel</h4>
                <div className="p-3 rounded bg-background/40 font-mono text-xs text-foreground border border-border/40">
                  {activeItem.source}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-muted-foreground mb-1">Audit Details & Proof Summary</h4>
                <p className="text-sm text-foreground/90 leading-relaxed p-3 rounded bg-background/40 border border-border/40">
                  {activeItem.auditDetails}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-muted-foreground mb-1">Artifact Link</h4>
                <a
                  href={activeItem.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  {activeItem.proofUrl} <ExternalLink className="size-3" />
                </a>
              </div>
            </div>

            <div className="border-t border-border/80 pt-4 flex flex-wrap items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(activeItem.id, "needs-clarification")}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <HelpCircle className="size-4 mr-1.5" /> Request Clarification
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(activeItem.id, "rejected")}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="size-4 mr-1.5" /> Reject Claim
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(activeItem.id, "verified")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                <ShieldCheck className="size-4 mr-1.5" /> Issue Verified Attestation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
