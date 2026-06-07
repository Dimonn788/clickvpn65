import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Mail, Languages, Send, Loader2, Check } from "lucide-react";
import { u as useI18n, d as updateTelegram } from "./router-D8SmVkh3.js";
import { u as useAuth } from "./use-auth-RGRywj1y.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "zod";
const LANGS = [{
  value: "ru",
  label: "Русский"
}, {
  value: "en",
  label: "English"
}];
function LangTabs({
  locale,
  setLocale
}) {
  const btnRefs = useRef([]);
  const [pill, setPill] = useState({
    left: 4,
    width: 0
  });
  useEffect(() => {
    const idx = LANGS.findIndex((l) => l.value === locale);
    const btn = btnRefs.current[idx];
    if (btn) setPill({
      left: btn.offsetLeft,
      width: btn.offsetWidth
    });
  }, [locale]);
  return /* @__PURE__ */ jsxs("div", { className: "glass relative inline-flex rounded-2xl p-1", children: [
    /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-y-1 rounded-xl bg-gradient-to-br from-white to-[oklch(0.78_0_0)] shadow-[0_8px_24px_-8px_oklch(1_0_0/0.3)]", style: {
      left: pill.left,
      width: pill.width,
      transition: "left 300ms cubic-bezier(0.34, 1.56, 0.64, 1), width 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
    } }),
    LANGS.map((lang, i) => /* @__PURE__ */ jsx("button", { ref: (el) => {
      btnRefs.current[i] = el;
    }, onClick: () => setLocale(lang.value), className: ["relative z-10 rounded-xl px-5 py-2 text-sm font-semibold transition-colors duration-200", locale === lang.value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"].join(" "), children: lang.label }, lang.value))
  ] });
}
function SettingsPage() {
  const {
    t,
    locale,
    setLocale
  } = useI18n();
  const {
    user
  } = useAuth();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deeplink, setDeeplink] = useState(null);
  useEffect(() => {
    if (!user) return;
  }, [user]);
  async function save(e) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const resp = await updateTelegram();
      setDeeplink(resp.deeplink_url || resp.deeplink || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: t("dash.settings") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: t("settings.title") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
        "Email"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 font-medium", children: user?.email ?? "—" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: t("settings.email.hint") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Languages, { className: "size-4" }),
        t("settings.language")
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(LangTabs, { locale, setLocale }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Send, { className: "size-4" }),
        "Telegram"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: t("settings.telegram.hint") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: deeplink ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("a", { href: deeplink, target: "_blank", rel: "noreferrer", className: "block truncate text-sm text-primary underline", children: t("settings.telegram.open") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.telegram.hint3") })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.telegram.hint2") }) }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60", children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : saved ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : null,
          saved ? t("settings.telegram.saved") : t("settings.telegram.link")
        ] })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
