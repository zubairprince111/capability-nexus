import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("ai5k_authenticated") === "true";
      if (!isAuth) {
        throw redirect({ to: "/auth/login" });
      }
    }
  },
  component: AppRoute,
});

function AppRoute() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("ai5k_authenticated") === "true";
    if (!isAuth) {
      navigate({ to: "/auth/login" });
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Verifying Network Authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
