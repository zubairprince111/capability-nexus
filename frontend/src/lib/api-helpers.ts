// Typed helpers for the AI5K backend. Shapes mirror backend/app/schemas.
// Contract reference: backend/app/api/v1.

import {
  ApiError,
  fetchApi,
  fetchWithAuth,
  setAuthTokens,
} from "./api";

export { ApiError, setAuthTokens };

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  status: string;
  created_at: string;
}

export interface MeResponse {
  user: UserRead;
  roles: { name: string; organization_id: string | null }[];
}

export interface SignupResponse {
  id: string;
  email: string;
  full_name: string;
  status: string;
  // Local dev only — never populated outside ENV=local.
  verification_token: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export async function signup(
  email: string,
  password: string,
  fullName: string,
): Promise<SignupResponse> {
  const res = await fetchApi("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
  return res.json();
}

export async function verifyEmail(token: string): Promise<UserRead> {
  const res = await fetchApi("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function resendVerification(email: string): Promise<void> {
  await fetchApi("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getMe(): Promise<MeResponse> {
  const res = await fetchWithAuth("/auth/me");
  return res.json();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const res = await fetchWithAuth("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  if (res.status !== 204) {
    let code = "unknown_error";
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch {
      /* non-JSON */
    }
    throw new ApiError(res.status, code, message);
  }
}

export async function changeEmail(
  newEmail: string,
  currentPassword: string,
): Promise<{ email: string }> {
  const res = await fetchWithAuth("/auth/change-email", {
    method: "POST",
    body: JSON.stringify({
      new_email: newEmail,
      current_password: currentPassword,
    }),
  });
  return res.json();
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface ProfileRead {
  id: string;
  owner_type: "individual" | "organization";
  user_id: string | null;
  organization_id: string | null;
  display_name: string;
  headline: string | null;
  job_roles: string[];
  portfolio_links: PortfolioLink[];
  visibility: "private" | "public";
  created_at: string;
  updated_at: string;
}

export function normalizeUrl(u: string): string {
  const t = u.trim();
  return t && !/^https?:\/\//i.test(t) ? `https://${t}` : t;
}

// Prefer 422 field details, then the envelope message, then a generic fallback.
export function describeApiError(err: unknown): string {
  if (
    err instanceof ApiError &&
    err.status === 422 &&
    err.details &&
    typeof err.details === "object"
  ) {
    const entries = Object.entries(err.details as Record<string, string>);
    if (entries.length > 0) {
      return entries.map(([f, m]) => `${f}: ${m}`).join(" · ");
    }
  }
  return (err as Error).message || "Something went wrong";
}

export async function createProfile(body: {
  display_name: string;
  headline?: string | null;
  job_roles?: string[];
  portfolio_links?: PortfolioLink[];
  visibility?: "private" | "public";
}): Promise<ProfileRead> {
  const res = await fetchWithAuth("/profiles", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getMyProfile(): Promise<ProfileRead> {
  const res = await fetchWithAuth("/profiles/me");
  return res.json();
}

export async function updateProfile(
  id: string,
  body: Partial<{
    display_name: string;
    headline: string | null;
    job_roles: string[];
    portfolio_links: PortfolioLink[];
    visibility: "private" | "public";
  }>,
): Promise<ProfileRead> {
  const res = await fetchWithAuth(`/profiles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return res.json();
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface SkillCatalogResponse {
  data: Skill[];
  total: number;
  page: number;
  page_size: number;
}

export interface SkillClaim {
  id: string;
  profile_id: string;
  skill_id: string;
  skill_name: string;
  claim_type: "self_declared" | "evidenced";
  proficiency_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  created_at: string;
}

export async function listSkills(
  page = 1,
  pageSize = 100,
): Promise<SkillCatalogResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  const res = await fetchWithAuth(`/skills?${params.toString()}`);
  return res.json();
}

export async function listSkillClaims(profileId: string): Promise<SkillClaim[]> {
  const res = await fetchWithAuth(`/profiles/${profileId}/skills`);
  return res.json();
}

export async function addSkillClaim(
  profileId: string,
  body: { skill_id?: string; skill_name?: string; category?: string; proficiency_level?: string },
): Promise<SkillClaim> {
  const res = await fetchWithAuth(`/profiles/${profileId}/skills`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateSkillClaim(
  profileId: string,
  claimId: string,
  proficiency_level: string,
): Promise<SkillClaim> {
  const res = await fetchWithAuth(`/profiles/${profileId}/skills/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify({ proficiency_level }),
  });
  return res.json();
}

export async function deleteSkillClaim(
  profileId: string,
  claimId: string,
): Promise<void> {
  await fetchWithAuth(`/profiles/${profileId}/skills/${claimId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Profile checks (readiness analysis)
// ---------------------------------------------------------------------------

export type CheckStatus =
  | "pending"
  | "fetching"
  | "evaluating"
  | "completed"
  | "failed";

export interface CheckSource {
  source: "cv" | "github" | "upwork" | "fiverr";
  status: "ok" | "failed" | "skipped";
  error_code: string | null;
  error_message: string | null;
  from_cache: boolean;
  duration_ms: number | null;
  fetched_at: string;
  raw: { filename?: string; chars?: number } | null;
}

export interface CheckDimension {
  key: string;
  label: string;
  points: number;
  max: number;
  signals: string[];
}

export interface CheckResultDetail {
  evaluator: string;
  readiness_raw: number;
  cap: { capped: boolean; at: number | null; reason: string | null };
  dimensions: CheckDimension[];
}

export interface ProfileCheckResultRead {
  readiness: number;
  capped: boolean;
  partial: boolean;
  result: CheckResultDetail;
  claims: { id: string; evidenced: boolean }[];
  skill_audit: { evidenced: number; self_declared: number; note: string } | null;
  sources_used: string[];
  generation_skipped: boolean;
  duration_ms: number | null;
  created_at: string;
}

export interface ProfileCheck {
  id: string;
  status: CheckStatus;
  github_url: string | null;
  upwork_url: string | null;
  fiverr_url: string | null;
  attempts: number;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  sources: CheckSource[];
  result: ProfileCheckResultRead | null;
}

export interface CvUploadResponse {
  cv_token: string;
  filename: string;
  content_type: string;
  size_bytes: number;
}

export async function uploadCv(file: File): Promise<CvUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetchWithAuth("/profile-checks/cv", {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function createProfileCheck(body: {
  github_url?: string;
  upwork_url?: string;
  fiverr_url?: string;
  cv_token?: string;
  reuse_cv?: boolean;
}): Promise<{ id: string; status: string; poll_url: string }> {
  const res = await fetchWithAuth("/profile-checks", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getProfileCheck(id: string): Promise<ProfileCheck> {
  const res = await fetchWithAuth(`/profile-checks/${id}`);
  return res.json();
}

export async function getLatestProfileCheck(): Promise<ProfileCheck | null> {
  const res = await fetchWithAuth("/profile-checks/latest");
  if (res.status === 404) return null;
  return res.json();
}

export interface CvSkillSuggestions {
  check_id: string;
  filename: string | null;
  suggested: string[];
  already_claimed: string[];
  error?: string;
}

export async function getCvSkillSuggestions(): Promise<CvSkillSuggestions | null> {
  const res = await fetchWithAuth("/profile-checks/cv/suggestions");
  if (res.status === 404) return null;
  return res.json();
}

export interface EngineStatus {
  online: boolean;
  evaluator: string;
  websearch: string;
  websearch_error: string | null;
}

export async function getEngineStatus(): Promise<EngineStatus> {
  const res = await fetchWithAuth("/profile-checks/engine");
  return res.json();
}

// ---------------------------------------------------------------------------
// Evidence
//   source_type: link | testimonial (URL-only, no storage) or
//                document | screenshot | certificate (file, needs S3).
//   File flow is presign → PUT to S3 → POST row with file_key.
// ---------------------------------------------------------------------------

export type EvidenceSourceType =
  | "link"
  | "testimonial"
  | "document"
  | "screenshot"
  | "certificate";

export interface SkillLinkRead {
  id: string;
  evidence_id: string;
  profile_skill_id: string;
}

export interface EvidenceRead {
  id: string;
  profile_id: string;
  uploader_id: string;
  source_type: EvidenceSourceType;
  file_url: string | null;
  download_url: string | null;
  title: string;
  description: string | null;
  verification_status: "pending" | "approved" | "rejected" | string;
  uploaded_at: string;
  skill_links: SkillLinkRead[];
}

export interface PresignRequest {
  source_type: "document" | "screenshot" | "certificate";
  content_type: string;
}

export interface PresignResponse {
  file_key: string;
  upload_url: string;
  expires_in: number;
}

export async function listEvidence(profileId: string): Promise<EvidenceRead[]> {
  const res = await fetchWithAuth(`/profiles/${profileId}/evidence`);
  return res.json();
}

export async function presignEvidence(
  profileId: string,
  sourceType: PresignRequest["source_type"],
  contentType: string,
): Promise<PresignResponse> {
  const res = await fetchWithAuth(
    `/profiles/${profileId}/evidence/presign`,
    {
      method: "POST",
      body: JSON.stringify({ source_type: sourceType, content_type: contentType }),
    },
  );
  return res.json();
}

export async function createEvidence(
  profileId: string,
  body: {
    source_type: EvidenceSourceType;
    title: string;
    description?: string | null;
    url?: string | null;
    file_key?: string | null;
  },
): Promise<EvidenceRead> {
  const res = await fetchWithAuth(`/profiles/${profileId}/evidence`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteEvidence(
  profileId: string,
  evidenceId: string,
): Promise<void> {
  await fetchWithAuth(`/profiles/${profileId}/evidence/${evidenceId}`, {
    method: "DELETE",
  });
}

export async function downloadEvidenceFile(
  profileId: string,
  evidenceId: string,
): Promise<Blob> {
  const res = await fetchWithAuth(
    `/profiles/${profileId}/evidence/${evidenceId}/file`,
  );
  return res.blob();
}

/** Upload the user's file directly to the presigned S3 URL. */
export async function uploadToS3(
  uploadUrl: string,
  contentType: string,
  file: File,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!res.ok) throw new Error(`S3 upload failed (${res.status})`);
}

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export interface OrganizationRead {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
  status: string;
  created_at: string;
}

export interface OrganizationCreatePayload {
  name: string;
  slug?: string | null;
  description?: string | null;
  website_url?: string | null;
}

export interface OrganizationUpdatePayload {
  name?: string;
  description?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
}

export interface MemberUserRead {
  id: string;
  email: string;
  full_name: string;
}

export interface MemberRead {
  id: string;
  organization_id: string;
  user: MemberUserRead;
  status: string;
  consent_given: boolean;
  joined_at: string | null;
}

export interface MemberCreatePayload {
  email: string;
}

export interface InvitationRead {
  member_id: string;
  organization_id: string;
  organization_name: string;
  invited_at: string | null;
}

export interface AggregateSkillRow {
  skill_id: string;
  name: string;
  category: string | null;
  member_count: number;
  evidenced_count: number;
  self_declared_count: number;
}

export async function listMyOrganizations(): Promise<OrganizationRead[]> {
  const res = await fetchWithAuth("/organizations");
  return res.json();
}

export async function getOrganization(id: string): Promise<OrganizationRead> {
  const res = await fetchWithAuth(`/organizations/${id}`);
  return res.json();
}

export async function createOrganization(
  body: OrganizationCreatePayload,
): Promise<OrganizationRead> {
  const res = await fetchWithAuth("/organizations", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateOrganization(
  id: string,
  body: OrganizationUpdatePayload,
): Promise<OrganizationRead> {
  const res = await fetchWithAuth(`/organizations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function listOrgMembers(orgId: string): Promise<MemberRead[]> {
  const res = await fetchWithAuth(`/organizations/${orgId}/members`);
  return res.json();
}

export async function inviteOrgMember(
  orgId: string,
  email: string,
): Promise<MemberRead> {
  const res = await fetchWithAuth(`/organizations/${orgId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function giveOrgConsent(orgId: string): Promise<MemberRead> {
  const res = await fetchWithAuth(`/organizations/${orgId}/members/me/consent`, {
    method: "POST",
  });
  return res.json();
}

export async function removeOrgMember(
  orgId: string,
  memberId: string,
): Promise<void> {
  await fetchWithAuth(`/organizations/${orgId}/members/${memberId}`, {
    method: "DELETE",
  });
}

export async function aggregateOrgSkills(
  orgId: string,
): Promise<AggregateSkillRow[]> {
  const res = await fetchWithAuth(`/organizations/${orgId}/skills`);
  return res.json();
}

export async function listMyInvitations(): Promise<InvitationRead[]> {
  const res = await fetchWithAuth("/organizations/invitations");
  return res.json();
}
