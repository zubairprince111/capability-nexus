import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-eyebrow">Error 404</p>
        <h1 className="text-display mt-4 text-4xl">This surface doesn't exist</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The route you followed has no verified counterpart. Head back to a page that does.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            to="/auth/signup"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Mission Control
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-eyebrow">Unrecoverable state</p>
        <h1 className="text-display mt-4 text-3xl">This view didn't load</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Nothing was lost. Retry the request or return to a stable surface.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI5K — The operating system for verified AI capability" },
      {
        name: "description",
        content:
          "AI5K connects AI professionals, organisations and assets through inspectable evidence instead of claims.",
      },
      { name: "author", content: "AI5K" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&family=Pixelify+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
