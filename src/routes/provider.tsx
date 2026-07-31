import { Outlet, createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Banknote,
  BookOpen,
  Code,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Wallet,
} from "lucide-react";

import { Wordmark } from "@/components/brand/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/site/site-chrome"; // We'll adapt theme toggle if needed

export const Route = createFileRoute("/provider")({
  component: ProviderLayout,
});

const SIDEBAR_LINKS = [
  { label: "Overview", to: "/provider", icon: LayoutDashboard },
  { label: "Earnings", to: "/provider/earnings", icon: Banknote },
  { label: "My Services", to: "/provider/services", icon: Code },
  { label: "API Keys", to: "/provider/api-keys", icon: Code }, // Using Code for now
  { label: "Logs", to: "/provider/logs", icon: Activity },
];

const BOTTOM_LINKS = [
  { label: "Withdraw Funds", to: "/provider/withdraw", icon: Wallet, variant: "button" },
  { label: "Support", to: "/provider/support", icon: LifeBuoy },
  { label: "Documentation", to: "/provider/docs", icon: BookOpen },
];

function ProviderLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <Wordmark />
          </Link>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="font-mono text-sm font-bold">CH</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-foreground">Creator Hub</span>
              <span className="truncate text-xs text-muted-foreground">Pro Account</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1.5 py-4">
            {SIDEBAR_LINKS.map((item) => {
              const active = item.to === "/provider" ? pathname === "/provider" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-surface-foreground/5 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="mt-auto border-t border-border p-4">
          <nav className="space-y-1.5">
            {BOTTOM_LINKS.map((item) => {
              const Icon = item.icon;
              if (item.variant === "button") {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-foreground/5 px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-foreground/10 mb-4"
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-6 backdrop-blur-xl">
          <div className="flex flex-1 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Marketplace</span>
            <span className="text-sm font-medium text-primary">Dashboard</span>
            <span className="text-sm font-medium text-muted-foreground">Library</span>
            <span className="text-sm font-medium text-muted-foreground">Analytics</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/provider/create-service" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              Create Tool
            </Link>
            <div className="size-8 rounded-full bg-surface-foreground/10" />
          </div>
        </header>

        <main className="min-w-0 flex-1 bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
