import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Check, Copy, Smartphone, Apple, Monitor, Terminal, ExternalLink, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { u as useI18n, f as getLatestSubscriptionForUser } from "./router-D8SmVkh3.js";
import "@tanstack/react-query";
import "zod";
const PLATFORMS = [{
  icon: Smartphone,
  name: "Android",
  app: "Happ",
  storeKey: "connect.store.google",
  storeUrl: "https://play.google.com/store/apps/details?id=com.happproxy&hl=ru"
}, {
  icon: Apple,
  name: "iPhone",
  app: "Happ",
  storeKey: "connect.store.appstore",
  storeUrl: "https://apps.apple.com/app/happ-proxy-utility/id6504287215"
}, {
  icon: Monitor,
  name: "Windows",
  app: "Happ / Hiddify",
  storeKey: "connect.store.developer",
  storeUrl: "https://hiddify.com/download"
}, {
  icon: Terminal,
  name: "Linux",
  app: "Hiddify",
  storeKey: "connect.store.github",
  storeUrl: "https://github.com/hiddify/hiddify-app/releases/latest"
}];
function useCopy(text, successMsg) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast.success(successMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return {
    copied,
    copy
  };
}
function PlatformCard({
  platform,
  vpnKey
}) {
  const {
    t
  } = useI18n();
  const {
    copied,
    copy
  } = useCopy(vpnKey, t("connect.copied"));
  return /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6 space-y-4", children: [
    /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-base font-semibold", children: [
      /* @__PURE__ */ jsx(platform.icon, { className: "size-4 shrink-0" }),
      platform.name,
      " ",
      t("connect.via"),
      " ",
      platform.app
    ] }),
    /* @__PURE__ */ jsxs("ol", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5", children: "1" }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          t("connect.install"),
          " ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: platform.app }),
          " ",
          t("connect.install.from"),
          " ",
          /* @__PURE__ */ jsxs("a", { href: platform.storeUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-0.5 text-foreground underline underline-offset-2 hover:text-primary transition", children: [
            t(platform.storeKey),
            " ",
            /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5", children: "2" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: t("connect.copy_link") }),
          vpnKey ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3 py-2", children: [
            /* @__PURE__ */ jsxs("code", { className: "flex items-center gap-1.5 flex-1 truncate font-mono text-xs text-foreground/70", children: [
              /* @__PURE__ */ jsx(LinkIcon, { className: "size-3 shrink-0" }),
              vpnKey
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: copy, className: "shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-muted-foreground transition hover:text-foreground", children: [
              copied ? /* @__PURE__ */ jsx(Check, { className: "size-3" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3" }),
              copied ? t("connect.copied") : t("connect.copy")
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs text-muted-foreground/60 italic", children: t("connect.link_pending") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5", children: "3" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: t("connect.step3") })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5", children: "4" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: t("connect.step4") })
      ] })
    ] })
  ] });
}
function ConnectPage() {
  const {
    t
  } = useI18n();
  const [vpnKey, setVpnKey] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const {
    copied: qrCopied,
    copy: copyKey
  } = useCopy(vpnKey, t("connect.copied"));
  useEffect(() => {
    getLatestSubscriptionForUser().then(({
      subscription
    }) => {
      if (subscription?.status === "active" && subscription.vpn_key) {
        setVpnKey(subscription.vpn_key);
      }
      setLoaded(true);
    });
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: t("dash.connect") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: t("connect.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("connect.subtitle") })
    ] }),
    loaded && !vpnKey && /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-5 text-sm text-muted-foreground", children: [
      t("connect.no_sub"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/checkout", search: {
        plan: 6
      }, className: "text-foreground underline underline-offset-2", children: t("dash.subscribe") })
    ] }),
    vpnKey && /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-white p-2.5 shrink-0", children: /* @__PURE__ */ jsx(QRCode, { value: vpnKey, size: 120 }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2 w-full", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("connect.qr_hint") }),
        /* @__PURE__ */ jsx("code", { className: "block break-all rounded-xl border border-white/10 bg-background/40 px-3 py-2 font-mono text-[11px] text-muted-foreground max-h-24 overflow-auto", children: vpnKey }),
        /* @__PURE__ */ jsxs("button", { onClick: copyKey, className: "inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground", children: [
          qrCopied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
          qrCopied ? t("connect.copied") : t("connect.copy_key")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: PLATFORMS.map((p) => /* @__PURE__ */ jsx(PlatformCard, { platform: p, vpnKey }, p.name)) })
  ] });
}
export {
  ConnectPage as component
};
