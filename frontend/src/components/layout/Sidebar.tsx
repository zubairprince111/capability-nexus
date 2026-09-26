"use client";

// AppSidebar — Supabase-style collapsible left rail.
// Collapsed by default; expands on hover (icons-only → icons + labels).
// Hairline border, restrained teal accent, mono labels for section headers.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  dashboard: <Icon d="M3 13h7V3H3v10zm0 8h7v-6H3v6zm11 0h7V11h-7v10zm0-18v6h7V3h-7z" />,
  analyze: <Icon d="M4 4h16M4 10h16M4 16h10M18 16l3 3M21 16l-3 3" />,
  organizations: <Icon d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01" />,
  profile: <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />,
  skills: <Icon d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6z" />,
  evidence: <Icon d="M9 12h6M9 16h6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />,
  settings: <Icon d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />,
  logout: <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: ICONS.dashboard },
      { href: "/analyze", label: "Analysis", icon: ICONS.analyze },
      { href: "/organizations", label: "Organizations", icon: ICONS.organizations },
    ],
  },
  {
    title: "Profile",
    items: [
      { href: "/profile/me", label: "Profile", icon: ICONS.profile },
      { href: "/profile/me/skills", label: "Skills", icon: ICONS.skills },
      { href: "/profile/me/evidence", label: "Evidence", icon: ICONS.evidence },
      { href: "/settings", label: "Settings", icon: ICONS.settings },
    ],
  },
];

interface SidebarProps {
  collapsedWidth?: number;
  expandedWidth?: number;
}

export default function Sidebar({
  collapsedWidth = 64,
  expandedWidth = 240,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const detailsRefs = useRef<HTMLDetailsElement[]>([]);

  const expanded = hovered || pinned;

  // Close any open <details> menus on route change.
  useEffect(() => {
    detailsRefs.current.forEach((d) => d?.removeAttribute("open"));
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const initials = (user?.full_name ?? "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="sticky top-0 hidden lg:flex flex-col h-dvh shrink-0 border-r border-hairline bg-canvas"
      style={{
        width: expanded ? expandedWidth : collapsedWidth,
        transition: "width 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      aria-label="Primary navigation"
    >
      {/* Brand */}
      <div className="flex items-center h-24 px-5 border-b border-hairline">
        <Logo href="/dashboard" size={80} />
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-2 py-4 overflow-y-auto"
        aria-label="Primary"
        style={{ scrollbarWidth: "thin" }}
      >
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.title} className={gi === 0 ? "" : "mt-6"}>
            {expanded && (
              <p className="px-3 mb-2 font-mono uppercase tracking-[0.18em] text-micro text-muted-2 overflow-hidden whitespace-nowrap">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-md h-9 text-[13px] transition-colors ${
                        expanded ? "px-3" : "justify-center px-0"
                      } ${
                        active
                          ? "bg-stone text-ink"
                          : "text-muted hover:bg-stone hover:text-ink"
                      }`}
                      title={!expanded ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-emerald rounded-r-full"
                        />
                      )}
                      <span className="shrink-0 inline-flex items-center justify-center size-4">
                        {item.icon}
                      </span>
                      {expanded && (
                        <span className="truncate overflow-hidden whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: user + collapse control */}
      <div className="border-t border-hairline p-2 space-y-1">
        <details
          ref={(el) => {
            if (el) detailsRefs.current[0] = el;
          }}
          className="group rounded-md"
        >
          <summary
            className={`list-none flex items-center gap-3 rounded-md cursor-pointer h-10 transition-colors hover:bg-stone ${
              expanded ? "px-3" : "justify-center px-0"
            }`}
          >
            <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-stone border border-border-light text-ink-soft text-[11px] font-mono">
              {initials}
            </span>
            {expanded && (
              <span className="flex-1 min-w-0 text-left">
                <span className="block text-[13px] text-ink truncate">
                  {user?.full_name}
                </span>
                <span className="block font-mono uppercase tracking-[0.18em] text-micro text-muted-2 truncate">
                  Account
                </span>
              </span>
            )}
            {expanded && (
              <span
                aria-hidden
                className="text-muted-2 text-micro transition-transform group-open:rotate-90"
              >
                ›
              </span>
            )}
          </summary>
          {expanded && (
            <div className="mt-1 ml-2 bg-stone border border-border-light rounded-md py-1 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.8)]">
              <Link
                href="/settings"
                className="block px-3 py-2 text-[13px] text-muted hover:text-ink hover:bg-stone-2 rounded-sm mx-1"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full text-left px-3 py-2 text-[13px] text-error-red hover:bg-stone-2 rounded-sm mx-1"
              >
                Log out
              </button>
            </div>
          )}
        </details>

        <button
          type="button"
          onClick={() => setPinned((p) => !p)}
          className={`w-full flex items-center gap-3 rounded-md h-9 text-[12px] text-muted-2 hover:text-ink hover:bg-stone transition-colors ${
            expanded ? "px-3" : "justify-center px-0"
          }`}
          aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
          title={!expanded ? (pinned ? "Unpin" : "Pin open") : undefined}
        >
          <span aria-hidden className="text-[14px] leading-none">
            {pinned ? "«" : "›"}
          </span>
          {expanded && (
            <span className="font-mono uppercase tracking-[0.18em] text-micro">
              {pinned ? "Pinned" : "Hover-only"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
