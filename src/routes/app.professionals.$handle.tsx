import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Edit3, 
  Cpu, 
  Layers, 
  Share2,
  Plus,
  Trash2,
  X,
  Ban,
  UserCheck,
  ShieldAlert
} from "lucide-react";
import { getActiveRole } from "@/lib/services/ai5k-service";
import { AppRole } from "@/lib/types";

export const Route = createFileRoute("/app/professionals/$handle")({
  head: () => ({
    meta: [
      { title: "Verified Capability Profile — AI5K" },
      { name: "description", content: "Verified AI capability profile with inspectable evidence signals." },
    ],
  }),
  component: ProfessionalDetail,
});

interface EvidenceProject {
  id: string;
  title: string;
  category: string;
  description: string;
  proofStatus: string;
  metrics: string;
}

interface Certification {
  id: string;
  title: string;
  status: string;
  detail: string;
}

export function ProfessionalDetail() {
  const { handle } = Route.useParams();
  
  const [activeRole, setActiveRoleState] = useState<AppRole>(getActiveRole());
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const handleRoleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AppRole>;
      if (customEvent.detail) {
        setActiveRoleState(customEvent.detail);
      }
    };
    window.addEventListener("ai5k_role_change", handleRoleEvent);
    return () => window.removeEventListener("ai5k_role_change", handleRoleEvent);
  }, []);
  
  // 1. Identity & Overview State
  const [profile, setProfile] = useState({
    name: "Ada Lovelace",
    handle: handle || "adalovelace",
    email: "ada.lovelace@ai5k.network",
    role: "Senior AI Systems & LLM Engineer",
    bio: "Building autonomous AI agents, enterprise RAG pipelines, and fine-tuning open-source models with cryptographically verified proof.",
    location: "San Francisco, CA · Remote",
    index: "96.8",
    joined: "September 2026",
    avatarUrl: "",
  });

  // 2. Skills & Tech Stack State
  const [skills, setSkills] = useState<string[]>([
    "PyTorch",
    "Transformers",
    "LLM Fine-Tuning (LoRA)",
    "LangChain / LlamaIndex",
    "Vector DBs (Qdrant/Pinecone)",
    "vLLM & TensorRT-LLM",
    "Autonomous Agent Swarms",
    "CUDA Optimization",
  ]);

  // 3. Certifications State
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: "1", title: "AI5K Systems Architect (L3)", status: "Verified", detail: "Issued Sep 2026 · Cryptographic Proof Signed" },
    { id: "2", title: "CUDA & GPU Optimization Assessed", status: "Attested", detail: "Passed High-Throughput Benchmarks" },
  ]);

  // 4. Evidence Projects State
  const [projects, setProjects] = useState<EvidenceProject[]>([
    {
      id: "1",
      title: "Enterprise Multi-Agent RAG Engine",
      category: "LLM Systems Architecture",
      description: "Hybrid vector search pipeline with reranking that processes 5M+ technical documents with sub-100ms latency.",
      proofStatus: "Cryptographically Verified",
      metrics: "Sub-100ms Latency · 99.4% Accuracy",
    },
    {
      id: "2",
      title: "Autonomous Code Security Audit Agent",
      category: "AI Agent Swarm",
      description: "Fine-tuned Llama-3-70B model integrated into CI/CD pipelines to detect vulnerability vectors in smart contracts and C++ runtimes.",
      proofStatus: "Enterprise Attested",
      metrics: "72% Reduction in Audit Latency",
    },
    {
      id: "3",
      title: "High-Throughput Vision Model Pipeline",
      category: "Edge AI Optimization",
      description: "TensorRT quantized vision transformer deployed on edge hardware for real-time defect detection.",
      proofStatus: "Verified Signal",
      metrics: "14.2ms Frame Processing Time",
    },
  ]);

  // Modal Dialog States
  const [editIdentityOpen, setEditIdentityOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editRole, setEditRole] = useState(profile.role);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editIndex, setEditIndex] = useState(profile.index);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);

  const [shareOpen, setShareOpen] = useState(false);
  
  // New Skill Input State
  const [newSkill, setNewSkill] = useState("");

  // New Project Modal State
  const [addProjOpen, setAddProjOpen] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projStatus, setProjStatus] = useState("Cryptographically Verified");
  const [projMetrics, setProjMetrics] = useState("");

  // New Certification Modal State
  const [addCertOpen, setAddCertOpen] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certStatus, setCertStatus] = useState("Verified");
  const [certDetail, setCertDetail] = useState("");

  // Load profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("ai5k_user_name");
      const savedEmail = localStorage.getItem("ai5k_user_email");
      const savedHandle = localStorage.getItem("ai5k_user_handle");
      const savedRole = localStorage.getItem("ai5k_user_role");
      const savedBio = localStorage.getItem("ai5k_user_bio");
      const savedLocation = localStorage.getItem("ai5k_user_location");
      const savedIndex = localStorage.getItem("ai5k_user_index");
      const savedAvatarUrl = localStorage.getItem("ai5k_user_avatarUrl");
      const savedSkills = localStorage.getItem("ai5k_user_skills");
      const savedProjects = localStorage.getItem("ai5k_user_projects");
      const savedCerts = localStorage.getItem("ai5k_user_certs");

      if (savedName) setProfile((p) => ({ ...p, name: savedName }));
      if (savedEmail) setProfile((p) => ({ ...p, email: savedEmail }));
      if (savedHandle) setProfile((p) => ({ ...p, handle: savedHandle }));
      if (savedRole) setProfile((p) => ({ ...p, role: savedRole }));
      if (savedBio) setProfile((p) => ({ ...p, bio: savedBio }));
      if (savedLocation) setProfile((p) => ({ ...p, location: savedLocation }));
      if (savedIndex) setProfile((p) => ({ ...p, index: savedIndex }));
      if (savedAvatarUrl) setProfile((p) => ({ ...p, avatarUrl: savedAvatarUrl }));

      if (savedSkills) {
        try {
          const parsed = JSON.parse(savedSkills);
          if (Array.isArray(parsed)) setSkills(parsed);
        } catch {}
      }
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          if (Array.isArray(parsed)) setProjects(parsed);
        } catch {}
      }
      if (savedCerts) {
        try {
          const parsed = JSON.parse(savedCerts);
          if (Array.isArray(parsed)) setCertifications(parsed);
        } catch {}
      }

      setEditName(savedName || profile.name);
      setEditHandle(savedHandle || profile.handle);
      setEditRole(savedRole || profile.role);
      setEditBio(savedBio || profile.bio);
      setEditLocation(savedLocation || profile.location);
      setEditIndex(savedIndex || profile.index);
      setEditAvatarUrl(savedAvatarUrl || profile.avatarUrl);
    }
  }, []);

  // Save Identity Edits
  const handleSaveIdentity = () => {
    localStorage.setItem("ai5k_user_name", editName);
    localStorage.setItem("ai5k_user_handle", editHandle);
    localStorage.setItem("ai5k_user_role", editRole);
    localStorage.setItem("ai5k_user_bio", editBio);
    localStorage.setItem("ai5k_user_location", editLocation);
    localStorage.setItem("ai5k_user_index", editIndex);
    localStorage.setItem("ai5k_user_avatarUrl", editAvatarUrl);

    setProfile((prev) => ({
      ...prev,
      name: editName,
      handle: editHandle,
      role: editRole,
      bio: editBio,
      location: editLocation,
      index: editIndex,
      avatarUrl: editAvatarUrl,
    }));

    setEditIdentityOpen(false);
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    localStorage.setItem("ai5k_user_skills", JSON.stringify(updated));
    setNewSkill("");
  };

  // Delete Skill
  const handleDeleteSkill = (skillToDelete: string) => {
    const updated = skills.filter((s) => s !== skillToDelete);
    setSkills(updated);
    localStorage.setItem("ai5k_user_skills", JSON.stringify(updated));
  };

  // Add Project
  const handleAddProject = () => {
    if (!projTitle.trim()) return;
    const newProj: EvidenceProject = {
      id: Date.now().toString(),
      title: projTitle.trim(),
      category: projCategory.trim() || "AI Project",
      description: projDescription.trim() || "Verified system artifact.",
      proofStatus: projStatus,
      metrics: projMetrics.trim() || "100% Attested",
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("ai5k_user_projects", JSON.stringify(updated));

    setProjTitle("");
    setProjCategory("");
    setProjDescription("");
    setProjMetrics("");
    setAddProjOpen(false);
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("ai5k_user_projects", JSON.stringify(updated));
  };

  // Add Certification
  const handleAddCert = () => {
    if (!certTitle.trim()) return;
    const newCert: Certification = {
      id: Date.now().toString(),
      title: certTitle.trim(),
      status: certStatus,
      detail: certDetail.trim() || "Cryptographic Proof Signed",
    };
    const updated = [...certifications, newCert];
    setCertifications(updated);
    localStorage.setItem("ai5k_user_certs", JSON.stringify(updated));

    setCertTitle("");
    setCertDetail("");
    setAddCertOpen(false);
  };

  // Delete Certification
  const handleDeleteCert = (id: string) => {
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    localStorage.setItem("ai5k_user_certs", JSON.stringify(updated));
  };

  const isAdmin = activeRole === "admin";
  const currentUserHandle = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_handle") : null) || "adalovelace";
  // Admins CANNOT edit another user's profile. Only the owner can edit profile content.
  const isOwner = profile.handle.toLowerCase() === currentUserHandle.toLowerCase();

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <PageTransition className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* 0. PRIVILEGED ADMIN MODERATION BAR (Only visible to Admin) */}
      {isAdmin && (
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-purple-200 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-500/20 border border-purple-500/40 grid place-items-center text-purple-300 shrink-0">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-300">
                <span>Admin Moderation Console</span>
                {isBanned ? (
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold text-[10px]">ACCOUNT BANNED</span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-[10px]">STATUS: ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-purple-300/80 mt-0.5 font-sans font-light">
                Notice: Admins cannot edit profile content (user-owned data integrity). Admin privileges permit banning or suspending accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isBanned ? (
              <Button
                size="sm"
                onClick={() => setIsBanned(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs gap-1.5 shadow-md"
              >
                <UserCheck className="size-3.5" />
                Reinstate Account
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setIsBanned(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs gap-1.5 shadow-md"
              >
                <Ban className="size-3.5" />
                Ban Account
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Banned Notice Banner */}
      {isBanned && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-red-400 font-bold uppercase tracking-wider font-mono text-sm">
            <Ban className="size-4" /> Account Banned by Platform Admin
          </div>
          <p className="text-xs text-red-300/80 font-light">
            This member profile has been banned for platform policy or compliance violations. Public activity and capability matching are suspended.
          </p>
        </div>
      )}

      {/* 1. PROFILE HEADER BANNER */}
      <div className="relative rounded-2xl border border-border/80 bg-surface/60 p-6 sm:p-8 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />
        <div className="absolute top-0 right-0 size-72 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Personal Details */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-neutral-900 border-2 border-emerald-500/30 flex items-center justify-center font-mono font-bold text-2xl text-emerald-400 shadow-xl overflow-hidden relative">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="size-4" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-normal text-foreground tracking-tight">{profile.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px]">
                  <ShieldCheck className="size-3" />
                  Verified Member
                </span>
                {isBanned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-[10px] font-bold">
                    <Ban className="size-3" /> BANNED
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                <span>@{profile.handle}</span>
                <span>·</span>
                <span className="text-foreground/90">{profile.role}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-emerald-500/80" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  {profile.joined}
                </span>
              </div>
            </div>
          </div>

          {/* Capability Index Score Box & Edit Identity Modal (Only for Owner) */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                Capability Index
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-bold text-emerald-400">{profile.index}</span>
                <span className="text-xs text-muted-foreground font-mono">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 font-mono block mt-1">
                Verified Cryptographic Index
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {isOwner && (
                <Dialog open={editIdentityOpen} onOpenChange={setEditIdentityOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-xs font-mono">
                      <Edit3 className="size-3.5" />
                      Edit Identity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-neutral-950 border-neutral-800 text-white" aria-describedby={undefined}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-normal text-white">Edit Profile Details</DialogTitle>
                      <DialogDescription className="sr-only">Edit your profile identity details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-name" className="text-xs font-mono uppercase text-neutral-400">Full Name</Label>
                          <Input 
                            id="edit-name" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="bg-neutral-900 border-neutral-800 text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-handle" className="text-xs font-mono uppercase text-neutral-400">Handle (@)</Label>
                          <Input 
                            id="edit-handle" 
                            value={editHandle} 
                            onChange={(e) => setEditHandle(e.target.value)} 
                            className="bg-neutral-900 border-neutral-800 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-role" className="text-xs font-mono uppercase text-neutral-400">Title / Role</Label>
                          <Input 
                            id="edit-role" 
                            value={editRole} 
                            onChange={(e) => setEditRole(e.target.value)} 
                            className="bg-neutral-900 border-neutral-800 text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-index" className="text-xs font-mono uppercase text-neutral-400">Capability Index</Label>
                          <Input 
                            id="edit-index" 
                            value={editIndex} 
                            onChange={(e) => setEditIndex(e.target.value)} 
                            className="bg-neutral-900 border-neutral-800 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="edit-location" className="text-xs font-mono uppercase text-neutral-400">Location</Label>
                        <Input 
                          id="edit-location" 
                          value={editLocation} 
                          onChange={(e) => setEditLocation(e.target.value)} 
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-bio" className="text-xs font-mono uppercase text-neutral-400">Bio</Label>
                        <Textarea 
                          id="edit-bio" 
                          rows={3}
                          value={editBio} 
                          onChange={(e) => setEditBio(e.target.value)} 
                          className="bg-neutral-900 border-neutral-800 text-white resize-none text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="edit-avatar" className="text-xs font-mono uppercase text-neutral-400">Avatar Image URL (Optional)</Label>
                        <Input 
                          id="edit-avatar" 
                          value={editAvatarUrl} 
                          onChange={(e) => setEditAvatarUrl(e.target.value)} 
                          placeholder="https://example.com/avatar.jpg"
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>

                      <Button onClick={handleSaveIdentity} className="w-full bg-[#15846E] hover:bg-[#10b981] text-black font-semibold mt-2">
                        Save Identity Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground hover:text-foreground font-mono">
                    <Share2 className="size-3.5" />
                    Share Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-neutral-950 border-neutral-800 text-white p-0 overflow-hidden" aria-describedby={undefined}>
                  <DialogTitle className="sr-only">Share Profile</DialogTitle>
                  <DialogDescription className="sr-only">Profile card for sharing</DialogDescription>
                  <div className="relative p-8 bg-gradient-to-br from-neutral-900 to-black overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]" />
                    <div className="absolute top-0 right-0 size-40 bg-emerald-500/10 blur-3xl rounded-full" />
                    <div className="relative z-10 space-y-6">
                      {/* Share Card Content */}
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-neutral-900 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-xl text-emerald-400 shadow-xl overflow-hidden relative">
                          {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.name} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-white leading-none mb-1.5">{profile.name}</h2>
                          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/80">
                            <span>@{profile.handle}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                              <ShieldCheck className="size-3" /> Verified
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm text-neutral-300 font-medium">
                          {profile.role}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
                            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block mb-1">Index Score</span>
                            <span className="text-xl font-mono font-bold text-emerald-400">{profile.index}</span>
                          </div>
                          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/50">
                            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">Projects</span>
                            <span className="text-xl font-mono font-bold text-white">{projects.length} Verified</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {skills.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-neutral-300">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-neutral-400">
                            +{skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center gap-3">
                    <Input 
                      readOnly 
                      value={`https://ai5k.network/app/professionals/${profile.handle}`}
                      className="bg-neutral-900 border-neutral-800 text-xs text-neutral-400 font-mono h-9"
                    />
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://ai5k.network/app/professionals/${profile.handle}`);
                        // In a real app we'd show a toast here
                      }}
                      className="h-9 px-4 bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-xs shrink-0"
                    >
                      Copy Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          </div>

        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-sm leading-relaxed text-foreground/90 font-light max-w-4xl">
            {profile.bio}
          </p>
        </div>

      </div>

      {/* 2. MAIN GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tech Stack & Certifications (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Editable Tech Stack Box */}
          <div className="rounded-xl border border-border/70 bg-surface/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <Cpu className="size-4 text-emerald-500" />
                Technical Stack ({skills.length})
              </h3>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-2.5 py-1 rounded-md bg-surface-foreground/5 border border-border/60 text-xs font-mono text-foreground flex items-center gap-1.5 group"
                >
                  <span>{skill}</span>
                  {isOwner && (
                    <button 
                      onClick={() => handleDeleteSkill(skill)}
                      className="text-muted-foreground hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Remove skill"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add New Skill Input (Owner Only) */}
            {isOwner && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <Input 
                  placeholder="Add new skill..." 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  className="h-8 text-xs bg-background/50 border-border/60 font-mono"
                />
                <Button size="sm" onClick={handleAddSkill} className="h-8 px-3 text-xs bg-[#15846E] hover:bg-[#10b981] text-black font-semibold shrink-0">
                  <Plus className="size-3.5 mr-1" /> Add
                </Button>
              </div>
            )}
          </div>

          {/* Editable Certifications Box */}
          <div className="rounded-xl border border-border/70 bg-surface/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <Award className="size-4 text-emerald-500" />
                Certifications ({certifications.length})
              </h3>

              {isOwner && (
                <Dialog open={addCertOpen} onOpenChange={setAddCertOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-mono text-emerald-400 hover:text-emerald-300">
                      <Plus className="size-3 mr-1" /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-neutral-950 border-neutral-800 text-white" aria-describedby={undefined}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-normal text-white">Add Certification</DialogTitle>
                      <DialogDescription className="sr-only">Add a new certification to your profile</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="cert-title" className="text-xs font-mono uppercase text-neutral-400">Certification Name</Label>
                        <Input 
                          id="cert-title" 
                          value={certTitle} 
                          onChange={(e) => setCertTitle(e.target.value)} 
                          placeholder="e.g. AI5K Verified Systems Architect"
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cert-status" className="text-xs font-mono uppercase text-neutral-400">Verification Status</Label>
                        <Input 
                          id="cert-status" 
                          value={certStatus} 
                          onChange={(e) => setCertStatus(e.target.value)} 
                          placeholder="e.g. Verified / Attested"
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cert-detail" className="text-xs font-mono uppercase text-neutral-400">Details / Attestation Proof</Label>
                        <Input 
                          id="cert-detail" 
                          value={certDetail} 
                          onChange={(e) => setCertDetail(e.target.value)} 
                          placeholder="e.g. Issued Sep 2026 · Cryptographic Proof Signed"
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>
                      <Button onClick={handleAddCert} className="w-full bg-[#15846E] hover:bg-[#10b981] text-black font-semibold mt-2">
                        Add Certification
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-3 rounded-lg bg-background/50 border border-border/50 space-y-1 relative group">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground pr-5">
                    <span>{cert.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">{cert.status}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{cert.detail}</p>
                  {isOwner && (
                    <button 
                      onClick={() => handleDeleteCert(cert.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete Certification"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Editable Evidence Projects (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-normal text-foreground tracking-tight flex items-center gap-2">
              <Layers className="size-5 text-emerald-500" />
              Verified Evidence Projects ({projects.length})
            </h2>

            {isOwner && (
              <Dialog open={addProjOpen} onOpenChange={setAddProjOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 px-3 text-xs bg-[#15846E] hover:bg-[#10b981] text-black font-semibold font-mono">
                    <Plus className="size-3.5 mr-1" /> Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-neutral-950 border-neutral-800 text-white" aria-describedby={undefined}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-normal text-white">Add Evidence Project</DialogTitle>
                    <DialogDescription className="sr-only">Add a new evidence project to your profile</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="proj-title" className="text-xs font-mono uppercase text-neutral-400">Project Title</Label>
                      <Input 
                        id="proj-title" 
                        value={projTitle} 
                        onChange={(e) => setProjTitle(e.target.value)} 
                        placeholder="e.g. Enterprise RAG Search Pipeline"
                        className="bg-neutral-900 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="proj-category" className="text-xs font-mono uppercase text-neutral-400">Category</Label>
                      <Input 
                        id="proj-category" 
                        value={projCategory} 
                        onChange={(e) => setProjCategory(e.target.value)} 
                        placeholder="e.g. LLM Systems Architecture"
                        className="bg-neutral-900 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="proj-desc" className="text-xs font-mono uppercase text-neutral-400">Description & Attestation</Label>
                      <Textarea 
                        id="proj-desc" 
                        rows={3}
                        value={projDescription} 
                        onChange={(e) => setProjDescription(e.target.value)} 
                        placeholder="Describe what was built and verified..."
                        className="bg-neutral-900 border-neutral-800 text-white resize-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="proj-status" className="text-xs font-mono uppercase text-neutral-400">Proof Status</Label>
                        <Input 
                          id="proj-status" 
                          value={projStatus} 
                          onChange={(e) => setProjStatus(e.target.value)} 
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="proj-metrics" className="text-xs font-mono uppercase text-neutral-400">Key Performance Metric</Label>
                        <Input 
                          id="proj-metrics" 
                          value={projMetrics} 
                          onChange={(e) => setProjMetrics(e.target.value)} 
                          placeholder="e.g. Sub-100ms Latency"
                          className="bg-neutral-900 border-neutral-800 text-white"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddProject} className="w-full bg-[#15846E] hover:bg-[#10b981] text-black font-semibold mt-2">
                      Save Evidence Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="rounded-xl border border-border/80 bg-surface/40 p-6 space-y-4 hover:border-emerald-500/30 transition-all group relative">
                
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                      {proj.category}
                    </span>
                    <h3 className="text-base font-medium text-foreground group-hover:text-emerald-400 transition-colors">
                      {proj.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="shrink-0 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                      {proj.proofStatus}
                    </span>
                    {isOwner && (
                      <button 
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete project"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {proj.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="size-3.5" />
                    Cryptographic Proof Verified
                  </span>
                  <span className="text-foreground font-medium text-[11px]">{proj.metrics}</span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </PageTransition>
  );
}
