import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Banknote,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  ChevronDown,
  Command as CommandIcon,
  Compass,
  CreditCard,
  FileCheck2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  MessagesSquare,
  Orbit,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  User,
  Users,
  Workflow,
  Zap,
  LogOut,
  Lock
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Wordmark } from "@/components/brand/logo";
import { CommandPalette } from "@/components/app/command-palette";
import { StatusDot } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { notificationsQuery, sessionQuery } from "@/lib/queries";
import { getActiveRole, setActiveRole, hasAdminAccess } from "@/lib/services/ai5k-service";
import { AppRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// 1. PROFESSIONAL WORKSPACE NAV
const getProfessionalNav = (userHandle: string): NavGroup[] => [
  {
    title: "Discover",
    items: [
      { label: "Capability Network", to: "/app/universe", icon: Orbit },
      { label: "Opportunities", to: "/app/opportunities", icon: Target },
      { label: "Matches", to: "/app/buyer/matches", icon: Sparkles },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Proposals", to: "/app/buyer/proposals", icon: FileText },
      { label: "Engagements & Projects", to: "/app/projects", icon: Workflow },
      { label: "Messages", to: "/app/messages", icon: MessagesSquare },
    ],
  },
  {
    title: "Trust & Identity",
    items: [
      { label: "My Profile", to: `/app/professionals/${userHandle}`, icon: User },
      { label: "Evidence Vault", to: "/app/admin/verification", icon: FileCheck2 },
      { label: "Assessments", to: "/app/learning", icon: GraduationCap },
      { label: "Verified Reviews", to: "/app/buyer/reviews", icon: ShieldCheck },
    ],
  },
  {
    title: "Finance & Account",
    items: [
      { label: "Earnings & Payouts", to: "/app/buyer/payments", icon: Banknote },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ],
  },
];

// 2. ORGANIZATION WORKSPACE NAV
const ORGANIZATION_NAV: NavGroup[] = [
  {
    title: "Operate & Team",
    items: [
      { label: "Organization Overview", to: "/app/organization/overview", icon: Building2 },
      { label: "Team Aggregation", to: "/app/organizations", icon: Users },
      { label: "Delivery Pod Builder", to: "/app/organization/pods", icon: Zap },
    ],
  },
  {
    title: "Commerce & Services",
    items: [
      { label: "Services Portfolio", to: "/app/marketplace", icon: Store },
      { label: "Projects", to: "/app/projects", icon: Workflow },
      { label: "Opportunities", to: "/app/opportunities", icon: Target },
      { label: "Proposals & Contracts", to: "/app/buyer/contracts", icon: FileText },
    ],
  },
  {
    title: "Trust & Finance",
    items: [
      { label: "Evidence Audit Vault", to: "/app/admin/verification", icon: FileCheck2 },
      { label: "Revenue & Payouts", to: "/app/buyer/payments", icon: CreditCard },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ],
  },
];

// 3. BUYER WORKSPACE NAV
const BUYER_NAV: NavGroup[] = [
  {
    title: "Discover & Scope",
    items: [
      { label: "Create Project Scope", to: "/app/buyer/intake", icon: Sparkles },
      { label: "My Project Requests", to: "/app/buyer/requests", icon: Target },
      { label: "Explainable Matches", to: "/app/buyer/matches", icon: Orbit },
      { label: "Saved Capabilities", to: "/app/buyer/saved", icon: Boxes },
    ],
  },
  {
    title: "Commercial Execution",
    items: [
      { label: "Proposals Received", to: "/app/buyer/proposals", icon: FileText },
      { label: "Contracts & Escrow", to: "/app/buyer/contracts", icon: ShieldCheck },
      { label: "Active Engagements", to: "/app/projects", icon: Workflow },
      { label: "Payments & Invoices", to: "/app/buyer/payments", icon: Receipt },
    ],
  },
  {
    title: "Communication & Trust",
    items: [
      { label: "Messages", to: "/app/messages", icon: MessagesSquare },
      { label: "Verified Reviews", to: "/app/buyer/reviews", icon: FileCheck2 },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ],
  },
];

// 4. ADMIN / OPERATIONS CONSOLE NAV (PRIVILEGED)
const ADMIN_NAV: NavGroup[] = [
  {
    title: "Mission Control",
    items: [
      { label: "Overview", to: "/app", icon: LayoutDashboard },
      { label: "Capability Universe", to: "/app/universe", icon: Orbit },
      { label: "Analytics", to: "/app/analytics", icon: Target },
    ],
  },
  {
    title: "Network & Governance",
    items: [
      { label: "Professionals", to: "/app/professionals", icon: Users },
      { label: "Organizations", to: "/app/organizations", icon: ShieldCheck },
      { label: "Verification Queue", to: "/app/admin/verification", icon: FileCheck2 },
      { label: "Learning & Audits", to: "/app/learning", icon: GraduationCap },
    ],
  },
  {
    title: "Commerce & System",
    items: [
      { label: "Opportunities", to: "/app/opportunities", icon: Target },
      { label: "AI Assets", to: "/app/assets", icon: Boxes },
      { label: "Marketplace", to: "/app/marketplace", icon: Store },
      { label: "Community", to: "/app/community", icon: Compass },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ],
  },
];

function getRoleNav(role: AppRole, userHandle: string): NavGroup[] {
  switch (role) {
    case "professional":
      return getProfessionalNav(userHandle);
    case "organization":
      return ORGANIZATION_NAV;
    case "buyer":
      return BUYER_NAV;
    case "admin":
      return hasAdminAccess() ? ADMIN_NAV : getProfessionalNav(userHandle);
    default:
      return getProfessionalNav(userHandle);
  }
}

function NavLinks({ groups, collapsed, onNavigate }: { groups: NavGroup[]; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-6" aria-label="Application">
      {groups.map((group) => (
        <div key={group.title}>
          {!collapsed && <p className="text-eyebrow mb-2 px-3 text-[10px] font-mono tracking-widest text-muted-foreground uppercase">{group.title}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {!collapsed && <span className="truncate text-xs">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}


export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true); // Always closed by default
  const [isHovered, setIsHovered] = useState(false); // Expands on cursor hover
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<AppRole>(getActiveRole());

  const { data: session } = useQuery(sessionQuery());
  const { data: notifications } = useQuery(notificationsQuery());
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  useEffect(() => {
    const handleRoleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AppRole>;
      if (customEvent.detail) {
        setCurrentRole(customEvent.detail);
      }
    };
    window.addEventListener("ai5k_role_change", handleRoleEvent);
    return () => window.removeEventListener("ai5k_role_change", handleRoleEvent);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "\\") {
        event.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleRoleSwitch = (role: AppRole) => {
    setActiveRole(role);
    setCurrentRole(role);
    setCollapsed(true);
    setIsHovered(false);
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai5k_user_name");
      localStorage.removeItem("ai5k_user_email");
      localStorage.removeItem("ai5k_user_handle");
      localStorage.removeItem("ai5k_user_role");
      localStorage.removeItem("ai5k_user_bio");
      window.location.href = "/";
    }
  };

  const userName = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_name") : null) || session?.name || "Ada Lovelace";
  const userHandle = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_handle") : null) || session?.handle || "adalovelace";
  const userInitials = userName.split(" ").filter(Boolean).map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "AL";

  const navGroups = getRoleNav(currentRole, userHandle);

  const isAdmin = currentRole === "admin";
  const isEffectiveCollapsed = collapsed && !isHovered;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-dvh w-full bg-background">
        
        {/* Sidebar Navigation */}
        <aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 z-40 lg:flex",
            isEffectiveCollapsed ? "w-[4.5rem]" : "w-[16.5rem]",
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" aria-label="AI5K home">
              {isEffectiveCollapsed ? <Wordmark subtle className="[&>span:last-child]:hidden" /> : <Wordmark />}
            </Link>
          </div>



          <ScrollArea className="flex-1 px-3 py-2">
            <NavLinks groups={navGroups} collapsed={isEffectiveCollapsed} />
          </ScrollArea>

          <div className="border-t border-sidebar-border p-3 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={cn(
                "w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 text-xs font-mono transition-colors",
                isEffectiveCollapsed && "justify-center px-2"
              )}
              title={isEffectiveCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="size-4 shrink-0" />
              {!isEffectiveCollapsed && <span>Sign Out</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed((c) => !c)}
              className="w-full justify-start gap-3 text-muted-foreground"
              aria-label={isEffectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isEffectiveCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              {!isEffectiveCollapsed && <span className="text-xs">{collapsed ? "Pin Open · ⌘\\" : "Collapse · ⌘\\"}</span>}
            </Button>
          </div>
        </aside>

        {/* Main Workspace Body */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className={cn(
            "sticky top-0 z-30 border-b backdrop-blur-xl transition-colors",
            isAdmin 
              ? "border-purple-500/30 bg-neutral-950/90" 
              : "border-border bg-background/85"
          )}>
            {/* Visually Distinct Admin Header Banner */}
            {isAdmin && (
              <div className="bg-purple-950/40 border-b border-purple-500/30 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-purple-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-purple-400 animate-pulse" />
                  <span className="font-bold tracking-wider uppercase">PRIVILEGED ADMIN CONSOLE</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-[10px] text-purple-200 border border-purple-500/40">Demo RBAC Access</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRoleSwitch("professional")}
                  className="h-6 text-[10px] border-purple-500/40 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                >
                  <LogOut className="size-3 mr-1" /> Exit Admin Console
                </Button>
              </div>
            )}

            <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
              
              <div className="flex items-center gap-2">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="min-h-11 min-w-11 lg:hidden" aria-label="Open navigation">
                      <PanelLeftOpen className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[17rem] bg-sidebar p-0">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <div className="flex h-16 items-center px-4">
                      <Wordmark />
                    </div>
                    <ScrollArea className="h-[calc(100dvh-5rem)] px-3 pb-6">
                      <NavLinks groups={navGroups} collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Search Bar */}
              <button
                onClick={() => setPaletteOpen(true)}
                className="flex h-10 min-w-0 items-center gap-2.5 rounded-lg border border-border bg-surface px-3 text-left text-sm text-muted-foreground transition-colors hover:border-ring/40 hover:bg-elevated"
              >
                <Search className="size-4 shrink-0" aria-hidden />
                <span className="truncate">Search capabilities, evidence, opportunities…</span>
                <span className="text-data ml-auto hidden shrink-0 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[0.625rem] sm:flex">
                  <CommandIcon className="size-3" aria-hidden />K
                </span>
              </button>

              {/* User Identity & Notifications */}
              <div className="flex items-center gap-2">
                {/* Notifications Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Notifications, ${unread} unread`}
                      className="relative grid min-h-10 min-w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Bell className="size-4" />
                      {unread > 0 && (
                        <span className="absolute right-2 top-2">
                          <StatusDot tone="proof" pulse />
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 sm:w-96 bg-neutral-950 border-neutral-800 text-white z-50 p-0 shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Bell className="size-4 text-emerald-400" />
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                          Notifications & Signals
                        </span>
                      </div>
                      {unread > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                          {unread} UNREAD
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-400">All Read</span>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-900">
                      {notifications && notifications.length > 0 ? (
                        notifications.map((item: any) => (
                          <div key={item.id} className={cn("p-3.5 text-xs space-y-1 transition-colors hover:bg-neutral-900/80 cursor-pointer", !item.read && "bg-emerald-950/20")}>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white font-mono">{item.title}</span>
                              <span className="text-[10px] font-mono text-neutral-400">{item.timestamp || item.created_at || "Recent"}</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
                              {item.message || item.description || "Attestation or capability signal updated."}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs font-mono text-neutral-400">
                          No active notifications or signals.
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="ml-1 flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 transition-all hover:bg-elevated hover:border-primary/40 group text-left"
                    >
                      <span className="grid size-7 place-items-center rounded-md border border-primary/25 bg-primary/10 text-data text-[0.625rem] font-semibold text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        {userInitials}
                      </span>
                      <span className="hidden min-w-0 flex-col leading-tight md:flex">
                        <span className="truncate text-xs font-medium text-foreground">{userName}</span>
                        <span className="text-data truncate text-[0.625rem] text-muted-foreground flex items-center gap-1">
                          <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="capitalize font-mono text-emerald-400 font-semibold">{currentRole}</span>
                        </span>
                      </span>
                      <ChevronDown className="size-3 text-muted-foreground shrink-0 hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-neutral-950 border-neutral-800 text-white z-50">
                    <DropdownMenuLabel className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest px-2 py-1.5">
                      User Account
                    </DropdownMenuLabel>
                    <div className="px-2 py-1.5 text-xs border-b border-neutral-800 mb-1">
                      <div className="font-semibold text-white">{userName}</div>
                      <div className="text-[11px] font-mono text-neutral-400">@{userHandle}</div>
                    </div>

                    <DropdownMenuLabel className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest px-2 py-1 flex items-center justify-between">
                      <span>Switch Stakeholder Workspace</span>
                    </DropdownMenuLabel>

                    <div className="p-1 bg-neutral-900 border border-neutral-800 rounded-md grid grid-cols-3 gap-1 mx-2 my-1 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("professional")}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1 px-1 rounded transition-all text-[11px]",
                          currentRole === "professional"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        )}
                        title="Professional Workspace"
                      >
                        <User className="size-3 text-emerald-400" />
                        <span>Pro</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("organization")}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1 px-1 rounded transition-all text-[11px]",
                          currentRole === "organization"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        )}
                        title="Organization Workspace"
                      >
                        <Building2 className="size-3 text-cyan-400" />
                        <span>Org</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("buyer")}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1 px-1 rounded transition-all text-[11px]",
                          currentRole === "buyer"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        )}
                        title="Buyer Workspace"
                      >
                        <ShoppingBag className="size-3 text-amber-400" />
                        <span>Buyer</span>
                      </button>
                    </div>

                    {/* Privileged Operational Console (Role-Gated: Only visible if user has 'admin' role) */}
                    {hasAdminAccess() && (
                      <>
                        <DropdownMenuSeparator className="bg-neutral-800 my-1" />
                        <DropdownMenuLabel className="text-[10px] font-mono text-purple-400 uppercase tracking-widest px-2 py-1">
                          Privileged Console
                        </DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => handleRoleSwitch("admin")} 
                          className={cn(
                            "gap-2.5 text-xs font-mono cursor-pointer py-2 border border-purple-500/30 rounded my-1",
                            currentRole === "admin" 
                              ? "bg-purple-950/60 text-purple-300 border-purple-500/60 font-bold" 
                              : "bg-purple-950/20 text-purple-300 hover:bg-purple-900/40"
                          )}
                        >
                          <ShieldCheck className="size-4 text-purple-400 shrink-0" /> 
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold">Enter Admin Mission Control</span>
                            <span className="text-[10px] text-purple-400/80">RBAC Operational Access</span>
                          </div>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="bg-neutral-800 my-1" />

                    <DropdownMenuItem asChild className="gap-2 text-xs cursor-pointer hover:bg-neutral-900 py-1.5">
                      <Link to="/app/professionals/$handle" params={{ handle: userHandle }}>
                        <User className="size-3.5 text-neutral-400" /> View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="gap-2 text-xs cursor-pointer hover:bg-neutral-900 py-1.5">
                      <Link to="/app/settings">
                        <Settings className="size-3.5 text-neutral-400" /> Account Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-neutral-800 my-1" />

                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="gap-2 text-xs font-mono text-red-400 font-semibold cursor-pointer hover:bg-red-950/40 hover:text-red-300 py-2"
                    >
                      <LogOut className="size-3.5 text-red-400" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </div>

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </TooltipProvider>
  );
}
