import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Mail, Send, Loader2, Check } from "lucide-react";
import { u as useI18n, d as updateTelegram } from "./router-CbiRFpVk.js";
import { u as useAuth } from "./use-auth-BN43UvEi.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "zod";
function SettingsPage() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  const [tg, setTg] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deeplink, setDeeplink] = useState(null);
  useEffect(() => {
    if (!user) return;
    setTg("");
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
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: "Настройки аккаунта" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
        "Email"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 font-medium", children: user?.email ?? "—" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Используется для входа по email и паролю." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Send, { className: "size-4" }),
        "Telegram"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Привяжите username, чтобы получать уведомления о подписке и продлении." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: deeplink ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("a", { href: deeplink, target: "_blank", rel: "noreferrer", className: "block truncate text-sm text-primary underline", children: "Открыть в Telegram" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Если ссылка не открывается — используйте Telegram и откройте deeplink вручную." })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Нажмите «Привязать», чтобы получить ссылку для привязки Telegram." }) }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60", children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : saved ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : null,
          saved ? "Сохранено" : "Привязать"
        ] })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
