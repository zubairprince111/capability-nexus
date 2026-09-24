import { 
  AppRole, 
  BuyerRequirement, 
  ContractRecord, 
  DeliveryPod, 
  EvidenceItem, 
  ExplainableMatch, 
  PaymentRecord, 
  ProposalItem, 
  VerifiedReview 
} from "@/lib/types";

// Role workspace persistence key
const ROLE_KEY = "ai5k_current_role";

export const getActiveRole = (): AppRole => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(ROLE_KEY) as AppRole | null;
    if (saved && ["professional", "organization", "buyer", "admin"].includes(saved)) {
      return saved;
    }
  }
  return "professional";
};

export const setActiveRole = (role: AppRole): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ROLE_KEY, role);
    window.dispatchEvent(new CustomEvent("ai5k_role_change", { detail: role }));
  }
};

// Mock Delivery Pods
export const MOCK_DELIVERY_PODS: DeliveryPod[] = [
  {
    id: "pod-1",
    name: "Mortgage AI Automation Pod",
    organizationId: "org-lab-alpha",
    targetOutcome: "Automate mortgage document extraction, validation, and risk scoring.",
    capabilityCoverage: 96,
    hourlyRate: "$420/hr",
    status: "active",
    members: [
      { id: "m1", name: "Dr. Elena Rostova", role: "Agentic AI Architect", avatarInitials: "ER", capabilityContribution: "Autonomous Workflows & Reasoning", capacityPercentage: 100 },
      { id: "m2", name: "Marcus Vance", role: "RAG Systems Engineer", avatarInitials: "MV", capabilityContribution: "Document Parsing & Vector Retrieval", capacityPercentage: 80 },
      { id: "m3", name: "Sarah Chen", role: "Model Quantization Lead", avatarInitials: "SC", capabilityContribution: "vLLM High-Throughput Inference", capacityPercentage: 100 },
      { id: "m4", name: "David Kim", role: "Security & Compliance Specialist", avatarInitials: "DK", capabilityContribution: "SOC2 & PII Masking Verification", capacityPercentage: 50 },
    ],
  },
  {
    id: "pod-2",
    name: "Healthcare Clinical RAG Pod",
    organizationId: "org-health-nexus",
    targetOutcome: "Deploy HIPAA-compliant clinical decision support and EHR vector indexing.",
    capabilityCoverage: 92,
    hourlyRate: "$380/hr",
    status: "committed",
    members: [
      { id: "m5", name: "Amara Osei", role: "Lead Healthcare AI Engineer", avatarInitials: "AO", capabilityContribution: "Clinical Dataset Processing & LoRA", capacityPercentage: 100 },
      { id: "m6", name: "Lucas Meyer", role: "Evaluation & Audit Lead", avatarInitials: "LM", capabilityContribution: "Hallucination Benchmark Auditing", capacityPercentage: 75 },
    ],
  },
];

// Mock Buyer Requirements
export const MOCK_BUYER_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: "req-101",
    title: "Autonomous Loan Underwriting Agent Pipeline",
    problem: "Manual loan underwriting takes 48 hours per application and suffers from human transcription error.",
    industry: "Financial Services / FinTech",
    requiredCapabilities: ["RAG Systems", "Autonomous Agent Swarms", "PII Redaction", "vLLM Optimization"],
    expectedOutcome: "Reduce underwriting latency to under 3 minutes with 99.8% precision audit trail.",
    timeline: "6 Weeks",
    budget: "$75,000 - $120,000",
    securityRequirements: ["SOC2 Type II", "On-Premises VPC Deployment", "Cryptographic Audit Trail"],
    existingSystems: "PostgreSQL, Salesforce Financial Cloud, AWS Bedrock",
    status: "matching",
    createdAt: "2026-09-24",
  },
];

// Mock Explainable Matches
export const MOCK_EXPLAINABLE_MATCHES: ExplainableMatch[] = [
  {
    id: "match-1",
    requirementId: "req-101",
    targetId: "pod-1",
    targetType: "delivery-pod",
    name: "Mortgage AI Automation Pod",
    headline: "Pre-assembled team specialized in financial document parsing and agentic workflows.",
    score: 98,
    reasons: [
      { label: "4 Demonstrated RAG Projects", evidenceCount: 4, detail: "Proven multi-modal document extraction pipelines deployed for tier-1 banks." },
      { label: "2 Client-Verified Outcomes", evidenceCount: 2, detail: "Independently audited 99.4% extraction accuracy on complex mortgage deeds." },
      { label: "FinTech Domain Experience", evidenceCount: 6, detail: "Core contributors hold active SOC2 compliance attestations." },
      { label: "Timeline Availability", evidenceCount: 1, detail: "100% capacity ready for immediate sprint deployment." },
    ],
    relevantProjects: ["Mortgage Extraction Pipeline v2", "FinTech Underwriting Agent", "Secure PII Redactor"],
    availability: "Immediate Capacity Available",
    estimatedRate: "$420/hr (Sprint Package)",
  },
  {
    id: "match-2",
    requirementId: "req-101",
    targetId: "pro-elena",
    targetType: "professional",
    name: "Dr. Elena Rostova",
    headline: "Principal Agentic Systems Architect with 8+ years neural network optimization experience.",
    score: 94,
    reasons: [
      { label: "3 Benchmark Proven Models", evidenceCount: 3, detail: "Author of high-throughput agentic evaluation framework." },
      { label: "Top 0.5% Capability Index", evidenceCount: 12, detail: "Cryptographically verified score of 98.4/100 across 18 repositories." },
    ],
    relevantProjects: ["Autonomous Claims Examiner", "Multi-Agent Decision Tree"],
    availability: "Open for Advisory & Lead Sprint",
    estimatedRate: "$250/hr",
  },
];

// Mock Proposals
export const MOCK_PROPOSALS: ProposalItem[] = [
  {
    id: "prop-301",
    opportunityId: "req-101",
    buyerName: "Apex Global Capital",
    title: "Proposal for Autonomous Loan Underwriting Pipeline",
    providerName: "Mortgage AI Automation Pod",
    providerType: "organization",
    recommendedTeam: ["Dr. Elena Rostova (Lead Architect)", "Marcus Vance (RAG Engineer)", "Sarah Chen (Inference Lead)"],
    evidenceUsed: [
      "Cryptographic Benchmark Verification #8821",
      "Tier-1 Bank Client Verification Attestation",
      "SOC2 PII Redaction Audit Log",
    ],
    scope: "Design, build, and deploy an end-to-end agentic workflow to parse, validate, and score loan applications automatically.",
    deliverables: [
      { title: "Phase 1: Architecture & PII Redaction Module", timeline: "Weeks 1 - 2" },
      { title: "Phase 2: RAG Vector Knowledge Engine & Agent Swarm", timeline: "Weeks 3 - 4" },
      { title: "Phase 3: Integration, Audit Trail & VPC Deployment", timeline: "Weeks 5 - 6" },
    ],
    timeline: "6 Weeks (3 Bi-Weekly Sprints)",
    pricing: { type: "milestone", total: "$95,000" },
    risks: ["Legacy API rate limits will require dedicated caching layer (Mitigated)."],
    status: "approved",
    createdAt: "2026-09-24",
  },
];

// Mock Contracts
export const MOCK_CONTRACTS: ContractRecord[] = [
  {
    id: "contract-501",
    proposalId: "prop-301",
    title: "Autonomous Loan Underwriting Contract",
    buyerName: "Apex Global Capital",
    providerName: "Mortgage AI Automation Pod",
    scope: "Full implementation of the Autonomous Loan Underwriting Agent Pipeline as specified in Proposal #prop-301.",
    totalValue: "$95,000",
    paymentTerms: "Escrow Funded per Milestone Approval",
    status: "active",
    signedAt: "2026-09-24 14:30:00",
    milestones: [
      { id: "ms-1", title: "Milestone 1: Architecture & PII Redaction", amount: "$30,000", dueDate: "2026-10-08", status: "funded" },
      { id: "ms-2", title: "Milestone 2: Agent Swarm & RAG Engine", amount: "$35,000", dueDate: "2026-10-22", status: "pending" },
      { id: "ms-3", title: "Milestone 3: Final VPC Deployment & Audit Signoff", amount: "$30,000", dueDate: "2026-11-05", status: "pending" },
    ],
  },
];

// Mock Payment Records
export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-1001",
    contractId: "contract-501",
    milestoneTitle: "Milestone 1: Architecture & PII Redaction (Escrow Deposit)",
    grossAmount: 30000,
    platformFee: 1500,
    netAmount: 28500,
    status: "paid",
    createdAt: "2026-09-24",
  },
];

// Mock Verified Reviews
export const MOCK_VERIFIED_REVIEWS: VerifiedReview[] = [
  {
    id: "rev-1",
    engagementId: "eng-801",
    reviewerName: "Jonathan Sterling",
    reviewerOrganization: "Vanguard Credit Corp",
    kind: "verified-review",
    rating: 5,
    comment: "Delivered the RAG pipeline 4 days ahead of schedule. The extraction accuracy on unstructured PDF forms was confirmed at 99.6% through our independent test suite.",
    verifiedAt: "2026-09-18",
    projectTitle: "Underwriting Automation",
  },
  {
    id: "rev-2",
    engagementId: "eng-702",
    reviewerName: "Dr. Aris Thorne",
    reviewerOrganization: "BioNeuron Labs",
    kind: "organization-endorsement",
    rating: 5,
    comment: "Exceptional expertise in TensorRT model quantization and CUDA kernel tuning. Reduced model latency by 4x.",
    verifiedAt: "2026-08-30",
    projectTitle: "Clinical Inference Engine",
  },
];
