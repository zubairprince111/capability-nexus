import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { DesktopRequiredNotice } from "@/components/app/desktop-required-notice";

function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= minWidth;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= minWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minWidth]);

  return isDesktop;
}

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("ai5k_authenticated") === "true";
      if (!isAuth) {
        throw redirect({
          to: "/auth/login",
          search: { redirect: location.href },
        });
      }
    }
  },
  component: AppRoute,
});

function AppRoute() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const isDesktop = useIsDesktop(1024);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("ai5k_authenticated") === "true";
      if (!isAuth) {
        const currentPath = window.location.pathname + window.location.search;
        navigate({
          to: "/auth/login",
          search: { redirect: currentPath },
        });
      } else {
        setAuthorized(true);
      }
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

  // If user opens /app on mobile / small screen (< 1024px), show warm desktop required notice
  if (!isDesktop) {
    return <DesktopRequiredNotice />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
