import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Boxes,
  Command as CommandIcon,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  MessagesSquare,
  Moon,
  Orbit,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Store,
  Sun,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Wordmark } from "@/components/brand/logo";
import { CommandPalette } from "@/components/app/command-palette";
import { StatusDot } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { notificationsQuery, sessionQuery } from "@/lib/queries";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Operate",
    items: [
      { label: "Mission Control", to: "/app", icon: LayoutDashboard },
      { label: "Capability Universe", to: "/app/universe", icon: Orbit },
      { label: "Analytics", to: "/app/analytics", icon: Target },
    ],
  },
  {
    title: "Network",
    items: [
      { label: "Professionals", to: "/app/professionals", icon: Users },
      { label: "Organisations", to: "/app/organizations", icon: ShieldCheck },
      { label: "Community", to: "/app/community", icon: Compass },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Opportunities", to: "/app/opportunities", icon: Target },
      { label: "Projects", to: "/app/projects", icon: Workflow },
      { label: "AI Assets", to: "/app/assets", icon: Boxes },
      { label: "Marketplace", to: "/app/marketplace", icon: Store },
    ],
  },
  {
    title: "Signals",
    items: [
      { label: "Messages", to: "/app/messages", icon: MessagesSquare },
      { label: "Notifications", to: "/app/notifications", icon: Bell },
      { label: "Learning", to: "/app/learning", icon: GraduationCap },
    ],
  },
  {
    title: "Control",
    items: [
      { label: "Settings", to: "/app/settings", icon: Settings },
      { label: "Admin", to: "/app/admin", icon: LifeBuoy },
    ],
  },
];

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-6" aria-label="Application">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          {!collapsed && <p className="text-eyebrow mb-2 px-3">{group.title}</p>}
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
                    {!collapsed && <span className="truncate">{item.label}</span>}
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

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="min-h-10 min-w-10"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useQuery(sessionQuery());
  const { data: notifications } = useQuery(notificationsQuery());
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

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

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-dvh w-full bg-background">
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
          <ScrollArea className="flex-1 px-3 py-2">
            <NavLinks collapsed={collapsed} />
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
                    <ScrollArea className="h-[calc(100dvh-4rem)] px-3 pb-6">
                      <NavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>

              <button
                onClick={() => setPaletteOpen(true)}
                className="flex h-10 min-w-0 items-center gap-2.5 rounded-lg border border-border bg-surface px-3 text-left text-sm text-muted-foreground transition-colors hover:border-ring/40 hover:bg-elevated"
              >
                <Search className="size-4 shrink-0" aria-hidden />
                <span className="truncate">Search people, evidence, opportunities…</span>
                <span className="text-data ml-auto hidden shrink-0 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[0.625rem] sm:flex">
                  <CommandIcon className="size-3" aria-hidden />K
                </span>
              </button>

              <div className="flex items-center gap-1">
                <ThemeToggle />
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
                  params={{ handle: session?.handle ?? "amaraosei" }}
                  className="ml-1 flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2 py-1.5 transition-colors hover:bg-elevated"
                >
                  <span className="grid size-7 place-items-center rounded-md border border-primary/25 bg-primary/10 text-data text-[0.625rem] font-semibold text-primary">
                    {session?.initials ?? "··"}
                  </span>
                  <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                    <span className="truncate text-xs font-medium">{session?.name ?? "Loading"}</span>
                    <span className="text-data truncate text-[0.625rem] text-muted-foreground">
                      Index {session?.capabilityIndex ?? "—"}
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
