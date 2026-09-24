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
  Zap
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
import { getActiveRole, setActiveRole } from "@/lib/services/ai5k-service";
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
const PROFESSIONAL_NAV: NavGroup[] = [
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
      { label: "My Profile", to: "/app/professionals/$handle", icon: User },
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
    title: "Discover & Intake",
    items: [
      { label: "What to Build? Intake", to: "/app/buyer/intake", icon: Sparkles },
      { label: "My Requisitions", to: "/app/buyer/requests", icon: Target },
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

// 4. ADMIN / OPERATIONS WORKSPACE NAV
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
    title: "Network & Trust",
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

function getRoleNav(role: AppRole): NavGroup[] {
  switch (role) {
    case "professional":
      return PROFESSIONAL_NAV;
    case "organization":
      return ORGANIZATION_NAV;
    case "buyer":
      return BUYER_NAV;
    case "admin":
      return ADMIN_NAV;
    default:
      return PROFESSIONAL_NAV;
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

function WorkspaceSwitcher({ activeRole, onSwitchRole, collapsed }: { activeRole: AppRole; onSwitchRole: (role: AppRole) => void; collapsed: boolean }) {
  const ROLE_LABELS: Record<AppRole, { label: string; icon: LucideIcon; color: string }> = {
    professional: { label: "Professional Workspace", icon: User, color: "text-emerald-400" },
    organization: { label: "Organization Workspace", icon: Building2, color: "text-cyan-400" },
    buyer: { label: "Buyer Workspace", icon: ShoppingBag, color: "text-amber-400" },
    admin: { label: "Admin / Operations", icon: ShieldCheck, color: "text-purple-400" },
  };

  const current = ROLE_LABELS[activeRole];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 text-left text-xs font-mono transition-all hover:border-primary/40 hover:bg-elevated w-full",
            collapsed ? "justify-center px-2" : "justify-between"
          )}
          title={collapsed ? current.label : undefined}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={cn("size-3.5 shrink-0", current.color)} />
            {!collapsed && <span className="truncate text-foreground font-medium text-[11px]">{current.label}</span>}
          </div>
          {!collapsed && <ChevronDown className="size-3 text-muted-foreground shrink-0" />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-60 bg-neutral-950 border-neutral-800 text-white z-50">
        <DropdownMenuLabel className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest px-2 py-1.5">
          Select Workspace
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuItem 
          onClick={() => onSwitchRole("professional")} 
          className={cn("gap-2.5 text-xs font-mono cursor-pointer hover:bg-neutral-900 py-2", activeRole === "professional" && "bg-emerald-950/40 text-emerald-400")}
        >
          <User className="size-4 text-emerald-400" /> 
          <span>Professional Workspace</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => onSwitchRole("organization")} 
          className={cn("gap-2.5 text-xs font-mono cursor-pointer hover:bg-neutral-900 py-2", activeRole === "organization" && "bg-cyan-950/40 text-cyan-400")}
        >
          <Building2 className="size-4 text-cyan-400" /> 
          <span>Organization Workspace</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => onSwitchRole("buyer")} 
          className={cn("gap-2.5 text-xs font-mono cursor-pointer hover:bg-neutral-900 py-2", activeRole === "buyer" && "bg-amber-950/40 text-amber-400")}
        >
          <ShoppingBag className="size-4 text-amber-400" /> 
          <span>Buyer Workspace</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => onSwitchRole("admin")} 
          className={cn("gap-2.5 text-xs font-mono cursor-pointer hover:bg-neutral-900 py-2", activeRole === "admin" && "bg-purple-950/40 text-purple-400")}
        >
          <ShieldCheck className="size-4 text-purple-400" /> 
          <span>Admin / Operations</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
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
  };

  const navGroups = getRoleNav(currentRole);

  const userName = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_name") : null) || session?.name || "Ada Lovelace";
  const userHandle = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_handle") : null) || session?.handle || "adalovelace";
  const userIndex = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_index") : null) || session?.capabilityIndex || "96.8";
  const userInitials = userName.split(" ").filter(Boolean).map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "AL";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-dvh w-full bg-background">
        
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex",
            collapsed ? "w-[4.5rem]" : "w-[16.5rem]",
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" aria-label="AI5K home">
              {collapsed ? <Wordmark subtle className="[&>span:last-child]:hidden" /> : <Wordmark />}
            </Link>
          </div>

          {/* Workspace Switcher in Sidebar */}
          <div className="px-3 pb-3">
            <WorkspaceSwitcher activeRole={currentRole} onSwitchRole={handleRoleSwitch} collapsed={collapsed} />
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <NavLinks groups={navGroups} collapsed={collapsed} />
          </ScrollArea>

          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed((c) => !c)}
              className="w-full justify-start gap-3 text-muted-foreground"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              {!collapsed && <span className="text-xs">Collapse · ⌘\</span>}
            </Button>
          </div>
        </aside>

        {/* Main Workspace Body */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
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
                    <div className="px-3 pb-3">
                      <WorkspaceSwitcher activeRole={currentRole} onSwitchRole={handleRoleSwitch} collapsed={false} />
                    </div>
                    <ScrollArea className="h-[calc(100dvh-7rem)] px-3 pb-6">
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
                <div className="hidden sm:block">
                  <WorkspaceSwitcher activeRole={currentRole} onSwitchRole={handleRoleSwitch} collapsed={false} />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/app/notifications"
                      aria-label={`Notifications, ${unread} unread`}
                      className="relative grid min-h-10 min-w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Bell className="size-4" />
                      {unread > 0 && (
                        <span className="absolute right-2 top-2">
                          <StatusDot tone="proof" pulse />
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{unread} unread signals</TooltipContent>
                </Tooltip>

                <Link
                  to="/app/professionals/$handle"
                  params={{ handle: userHandle }}
                  className="ml-1 flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 transition-colors hover:bg-elevated hover:border-primary/40 group"
                >
                  <span className="grid size-7 place-items-center rounded-md border border-primary/25 bg-primary/10 text-data text-[0.625rem] font-semibold text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    {userInitials}
                  </span>
                  <span className="hidden min-w-0 flex-col leading-tight md:flex">
                    <span className="truncate text-xs font-medium text-foreground">{userName}</span>
                    <span className="text-data truncate text-[0.625rem] text-muted-foreground flex items-center gap-1">
                      <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                      Index {userIndex}
                    </span>
                  </span>
                </Link>
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
