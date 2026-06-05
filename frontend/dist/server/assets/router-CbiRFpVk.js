import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from "react";
import { Toaster as Toaster$1 } from "sonner";
import { z } from "zod";
const appCss = "/assets/styles-DQLmhD9t.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const dict = {
  ru: {
    "nav.pricing": "Тарифы",
    "nav.features": "Возможности",
    "nav.faq": "FAQ",
    "nav.signin": "Войти",
    "nav.connect": "Подключиться",
    "nav.dashboard": "Кабинет",
    "nav.signout": "Выйти",
    "auth.title": "Вход по email и паролю",
    "auth.subtitle": "Введите email и пароль, чтобы войти в аккаунт",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.send": "Войти",
    "auth.error.generic": "Не удалось выполнить запрос",
    "dash.title": "Личный кабинет",
    "dash.overview": "Обзор",
    "dash.devices": "Устройства",
    "dash.payments": "Платежи",
    "dash.settings": "Настройки",
    "dash.subscription": "Подписка",
    "dash.subscription.none": "Активной подписки нет",
    "dash.subscription.choose": "Выберите тариф на главной",
    "dash.subscription.active": "Активна до",
    "dash.subscription.expired": "Истекла",
    "dash.subscription.pending": "Ожидает оплаты",
    "dash.key.title": "VPN-ключ",
    "dash.key.none": "Ключ появится после активации подписки",
    "dash.key.copy": "Скопировать",
    "dash.key.copied": "Скопировано",
    "dash.renew": "Продлить"
  },
  en: {
    "nav.pricing": "Pricing",
    "nav.features": "Features",
    "nav.faq": "FAQ",
    "nav.signin": "Sign in",
    "nav.connect": "Get started",
    "nav.dashboard": "Dashboard",
    "nav.signout": "Sign out",
    "auth.title": "Sign in with email and password",
    "auth.subtitle": "Enter your email and password to sign in",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.send": "Sign in",
    "auth.error.generic": "Request failed",
    "dash.title": "Dashboard",
    "dash.overview": "Overview",
    "dash.devices": "Devices",
    "dash.payments": "Payments",
    "dash.settings": "Settings",
    "dash.subscription": "Subscription",
    "dash.subscription.none": "No active subscription",
    "dash.subscription.choose": "Choose a plan on the homepage",
    "dash.subscription.active": "Active until",
    "dash.subscription.expired": "Expired",
    "dash.subscription.pending": "Awaiting payment",
    "dash.key.title": "VPN key",
    "dash.key.none": "The key will appear after activation",
    "dash.key.copy": "Copy",
    "dash.key.copied": "Copied",
    "dash.renew": "Renew"
  }
};
const I18nCtx = createContext({ locale: "ru", setLocale: () => {
}, t: (k) => k });
function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState("ru");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("locale");
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);
  const setLocale = (l) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("locale", l);
  };
  const t = (k) => dict[locale][k] ?? k;
  return /* @__PURE__ */ jsx(I18nCtx.Provider, { value: { locale, setLocale, t }, children });
}
const useI18n = () => useContext(I18nCtx);
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
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
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed47e593-f0f5-491b-9225-c7c7deda113f/id-preview-c899dec9--62923c4d-b6c9-441f-8358-a84b0e339eae.lovable.app-1780599554433.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed47e593-f0f5-491b-9225-c7c7deda113f/id-preview-c899dec9--62923c4d-b6c9-441f-8358-a84b0e339eae.lovable.app-1780599554433.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "ru", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$7 = () => import("./checkout-b-KlRWjq.js");
const search = z.object({
  plan: z.coerce.number().pipe(z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)])).catch(6)
});
const Route$7 = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Оплата — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  validateSearch: search,
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./auth-CABkjQun.js");
const Route$6 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Вход — ClickVPN"
    }, {
      name: "description",
      content: "Вход в кабинет ClickVPN по email и паролю."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
function apiFetch(path, opts = {}) {
  return fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...opts.headers || {}
    },
    ...opts
  }).then(async (res) => {
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) {
      const msg = json?.detail || json?.error || (typeof json === "string" ? json : null) || res.statusText;
      throw new Error(msg || "API error");
    }
    return json;
  });
}
async function login(payload) {
  return apiFetch("/api/login/request", { method: "POST", body: JSON.stringify({ email: payload.data.email }) });
}
async function confirmLogin(payload) {
  return apiFetch("/api/login/confirm", { method: "POST", body: JSON.stringify({ token: payload.data.token }) });
}
async function logout() {
  return apiFetch("/api/logout", { method: "POST" });
}
async function getUserSession() {
  return apiFetch("/api/me", { method: "GET" });
}
async function updateTelegram() {
  return apiFetch("/api/telegram/link/start", { method: "POST" });
}
async function createSubscriptionForUser(payload) {
  const body = { months: payload.data.planMonths, provider: "platega_card" };
  return apiFetch("/api/subscription/buy", { method: "POST", body: JSON.stringify(body) });
}
async function getLatestSubscriptionForUser() {
  const resp = await apiFetch("/api/subscriptions", { method: "GET" });
  const subs = resp.subscriptions || [];
  const first = subs.length ? subs[0] : null;
  if (!first) return { subscription: null };
  return {
    subscription: {
      id: first.uuid ?? null,
      plan_months: first.months ?? first.plan_months ?? null,
      status: (first.status || "").toLowerCase(),
      vpn_key: null,
      expires_at: first.expire_at ?? first.expireAt ?? null
    }
  };
}
async function getPaymentsForUser() {
  return apiFetch("/api/payments", { method: "GET" });
}
async function getDevicesForUser() {
  return apiFetch("/api/devices", { method: "GET" });
}
async function removeDevice(payload) {
  return apiFetch("/api/devices/delete", { method: "POST", body: JSON.stringify({ hwid: payload.data.id }) });
}
const $$splitComponentImporter$5 = () => import("./route-8vP26B1m.js");
const Route$5 = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const result = await getUserSession();
    if (!result || !result.id) throw redirect({
      to: "/auth"
    });
    return {
      user: result
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-Bqxa-DGX.js");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "ClickVPN — Свободный интернет без ограничений"
    }, {
      name: "description",
      content: "Один ключ для всех устройств. Простое подключение, высокая скорость, безлимитный трафик. Подписка от 109 ₽ в месяц."
    }, {
      property: "og:title",
      content: "ClickVPN — Свободный интернет без ограничений"
    }, {
      property: "og:description",
      content: "Один ключ для всех устройств. Подписка от 109 ₽ в месяц."
    }, {
      property: "og:type",
      content: "website"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./settings-rEEkDKu3.js");
const Route$3 = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{
      title: "Настройки — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./payments-D03Rk6xM.js");
const Route$2 = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [{
      title: "Платежи — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./devices-CvlQhlPF.js");
const Route$1 = createFileRoute("/_authenticated/devices")({
  head: () => ({
    meta: [{
      title: "Устройства — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard-CGQhVSW7.js");
const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Кабинет — ClickVPN"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const CheckoutRoute = Route$7.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$8
});
const AuthRoute = Route$6.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$8
});
const AuthenticatedRouteRoute = Route$5.update({
  id: "/_authenticated",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const AuthenticatedSettingsRoute = Route$3.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPaymentsRoute = Route$2.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDevicesRoute = Route$1.update({
  id: "/devices",
  path: "/devices",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedDashboardRoute,
  AuthenticatedDevicesRoute,
  AuthenticatedPaymentsRoute,
  AuthenticatedSettingsRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute,
  CheckoutRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  confirmLogin as a,
  logout as b,
  createSubscriptionForUser as c,
  updateTelegram as d,
  getDevicesForUser as e,
  getLatestSubscriptionForUser as f,
  getPaymentsForUser as g,
  getUserSession as h,
  router as i,
  login as l,
  removeDevice as r,
  useI18n as u
};
