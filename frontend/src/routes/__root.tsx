import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { I18nProvider } from "../lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { SupportChat } from "@/components/SupportChat";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-50" aria-hidden />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-[10rem] font-black leading-none tracking-tighter text-foreground/10 select-none">404</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">Страница не найдена</h1>
        <p className="mt-2 text-sm text-muted-foreground">Такой страницы нет — возможно, ссылка устарела или вы ошиблись адресом.</p>
        <Link
          to="/"
          className="btn-primary mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
      { title: "ClickVPN" },
      { name: "description", content: "ClickVPN — современное веб-приложение для быстрого доступа и удобной подписки." },
      { name: "author", content: "ClickVPN" },
      { property: "og:title", content: "ClickVPN" },
      { property: "og:description", content: "ClickVPN — современное веб-приложение для быстрого доступа и удобной подписки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@ClickVPN" },
      { name: "twitter:title", content: "ClickVPN" },
      { name: "twitter:description", content: "ClickVPN — современное веб-приложение для быстрого доступа и удобной подписки." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
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
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <SupportChat />
      </I18nProvider>
    </QueryClientProvider>
  );
}
