/**
 * AI5K domain contracts (DTOs).
 *
 * These types are the single source of truth shared by the mock transport and
 * every UI surface. When a real backend arrives, only the transport in
 * `src/lib/api/transport.ts` changes — these shapes stay identical.
 */

export type ID = string;

export type VerificationLevel = "unverified" | "claimed" | "reviewed" | "verified" | "attested";

export type EvidenceKind =
  | "repository"
  | "publication"
  | "deployment"
  | "benchmark"
  | "certification"
  | "audit"
  | "reference";

export interface Evidence {
  id: ID;
  kind: EvidenceKind;
  title: string;
  issuer: string;
  verifiedAt: string | null;
  level: VerificationLevel;
  strength: number; // 0-100
  summary: string;
}

export interface CapabilityDomain {
  id: ID;
  name: string;
  score: number; // 0-100 proof-weighted
  evidenceCount: number;
  trend: number; // percentage change
}

export interface Professional {
  id: ID;
  handle: string;
  name: string;
  title: string;
  location: string;
  region: string;
  timezone: string;
  initials: string;
  level: VerificationLevel;
  capabilityIndex: number; // 0-1000
  proofRatio: number; // 0-1
  availability: "open" | "selective" | "committed";
  rateBand: string;
  headline: string;
  bio: string;
  domains: CapabilityDomain[];
  evidence: Evidence[];
  organizations: { id: ID; name: string; role: string; period: string }[];
  languages: string[];
  yearsExperience: number;
  responseHours: number;
  attestations: number;
}

export interface Organization {
  id: ID;
  slug: string;
  name: string;
  kind: "lab" | "enterprise" | "studio" | "institute" | "public-sector";
  headquarters: string;
  region: string;
  initials: string;
  level: VerificationLevel;
  trustIndex: number;
  people: number;
  openOpportunities: number;
  focus: string[];
  summary: string;
  founded: number;
  verifiedAssets: number;
}

export interface AIAsset {
  id: ID;
  name: string;
  category: "model" | "dataset" | "agent" | "evaluation" | "pipeline";
  owner: string;
  license: string;
  level: VerificationLevel;
  evaluations: number;
  adoption: number;
  latencyMs: number;
  summary: string;
  updatedAt: string;
}

export interface Opportunity {
  id: ID;
  title: string;
  organization: string;
  organizationId: ID;
  mode: "contract" | "full-time" | "advisory" | "research";
  location: string;
  region: string;
  compensation: string;
  postedAt: string;
  closesAt: string;
  requiredDomains: string[];
  proofThreshold: number;
  matchScore: number;
  applicants: number;
  summary: string;
  responsibilities: string[];
  evidenceRequested: EvidenceKind[];
}

export interface Project {
  id: ID;
  name: string;
  organization: string;
  status: "scoping" | "active" | "review" | "shipped";
  progress: number;
  contributors: number;
  evidenceArtifacts: number;
  domain: string;
  updatedAt: string;
  summary: string;
}

export interface NotificationItem {
  id: ID;
  kind: "attestation" | "opportunity" | "message" | "system" | "evidence";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface MessageThread {
  id: ID;
  counterpart: string;
  counterpartRole: string;
  initials: string;
  lastMessageAt: string;
  unread: number;
  subject: string;
  messages: { id: ID; from: "me" | "them"; body: string; at: string }[];
}

export interface LearningTrack {
  id: ID;
  title: string;
  provider: string;
  hours: number;
  level: "foundation" | "practitioner" | "expert";
  enrolled: number;
  outcome: string;
  progress: number;
}

export interface CommunitySignal {
  id: ID;
  author: string;
  initials: string;
  role: string;
  at: string;
  body: string;
  topic: string;
  attestations: number;
  replies: number;
}

export interface MissionMetric {
  id: ID;
  label: string;
  value: number;
  unit?: string;
  delta: number;
  hint: string;
}

export interface SeriesPoint {
  period: string;
  proof: number;
  claims: number;
  attestations: number;
}

export interface UniverseNode {
  id: ID;
  label: string;
  kind: "core" | "domain" | "project" | "evidence" | "organization" | "asset" | "person";
  weight: number; // 0-100 drives radius
  level: VerificationLevel;
  detail: string;
  parent?: ID;
}

export interface UniverseEdge {
  from: ID;
  to: ID;
  strength: number; // 0-100
}

export interface UniverseGraph {
  subject: string;
  nodes: UniverseNode[];
  edges: UniverseEdge[];
}

export interface AuditEvent {
  id: ID;
  actor: string;
  action: string;
  target: string;
  at: string;
  severity: "info" | "notice" | "critical";
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  filters?: Record<string, string | undefined>;
}

export interface SessionUser {
  id: ID;
  name: string;
  handle: string;
  initials: string;
  role: "professional" | "organization" | "admin";
  capabilityIndex: number;
  level: VerificationLevel;
}
