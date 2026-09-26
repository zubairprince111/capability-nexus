"use client";

// AppShell = RequireAuth guard + Supabase-style sidebar.

import type { ReactNode } from "react";
import { RequireAuth } from "@/lib/auth-context";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-canvas text-ink flex">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </RequireAuth>
  );
}
