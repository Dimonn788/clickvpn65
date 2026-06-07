import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Loader2, RefreshCw, Smartphone, Laptop, Tv, Tablet, Trash2 } from "lucide-react";
import { u as useI18n, e as getDevicesForUser, r as removeDevice } from "./router-D8SmVkh3.js";
import { u as useAuth } from "./use-auth-RGRywj1y.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "zod";
const PLATFORMS = [{
  id: "ios",
  label: "iOS",
  icon: Smartphone
}, {
  id: "android",
  label: "Android",
  icon: Smartphone
}, {
  id: "macos",
  label: "macOS",
  icon: Laptop
}, {
  id: "windows",
  label: "Windows",
  icon: Laptop
}, {
  id: "tv",
  label: "TV",
  icon: Tv
}, {
  id: "tablet",
  label: "Tablet",
  icon: Tablet
}];
function platformIcon(p) {
  return PLATFORMS.find((x) => x.id === p)?.icon ?? Smartphone;
}
function DevicesPage() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef(null);
  async function load() {
    if (!user) return;
    setLoading(true);
    setTimedOut(false);
    timeoutRef.current = setTimeout(() => setTimedOut(true), 1e4);
    try {
      const {
        devices: devices2
      } = await getDevicesForUser();
      setDevices(devices2);
    } catch {
      setTimedOut(true);
    } finally {
      clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [user]);
  async function removeDevice$1(id) {
    await removeDevice({
      data: {
        id
      }
    });
    setDevices((d) => d.filter((x) => x.id !== id));
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-end justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: t("dash.devices") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: t("devices.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: t("devices.subtitle") })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "glass rounded-2xl", children: loading && !timedOut ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-12 text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) }) : timedOut ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 p-12 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("devices.error") }),
      /* @__PURE__ */ jsxs("button", { onClick: load, className: "inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5" }),
        t("devices.reload")
      ] })
    ] }) : devices.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-sm text-muted-foreground", children: t("devices.empty") }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-white/5", children: devices.map((d) => {
      const Icon = platformIcon(d.platform);
      return /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-4 p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20", children: /* @__PURE__ */ jsx(Icon, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: d.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              PLATFORMS.find((p) => p.id === d.platform)?.label ?? d.platform,
              " ·",
              " ",
              t("devices.added"),
              " ",
              new Date(d.created_at).toLocaleDateString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => removeDevice$1(d.id), className: "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive", children: [
          /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }),
          t("devices.remove")
        ] })
      ] }, d.id);
    }) }) })
  ] });
}
export {
  DevicesPage as component
};
