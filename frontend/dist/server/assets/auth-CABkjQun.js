import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { u as useI18n, a as confirmLogin, l as login } from "./router-CbiRFpVk.js";
import { u as useAuth } from "./use-auth-BN43UvEi.js";
import "@tanstack/react-query";
import "sonner";
import "zod";
function AuthPage() {
  const {
    t
  } = useI18n();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (!loading && user) navigate({
      to: "/dashboard"
    });
  }, [user, loading, navigate]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setBusy(true);
      confirmLogin({
        data: {
          token
        }
      }).then(() => {
        navigate({
          to: "/dashboard"
        });
      }).catch((err) => setError(err instanceof Error ? err.message : String(err))).finally(() => setBusy(false));
    }
  }, [navigate]);
  async function signIn(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login({
        data: {
          email
        }
      });
      setMessage("Ссылка для входа отправлена на почту. Проверьте письмо.");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error.generic"));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "mb-8 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass w-full rounded-2xl p-6 sm:p-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: t("auth.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("auth.subtitle") }),
        /* @__PURE__ */ jsxs("form", { onSubmit: signIn, className: "mt-6 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: t("auth.email") }),
            /* @__PURE__ */ jsx("input", { type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-xl border border-white/10 bg-background/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/60" })
          ] }),
          error && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive", children: error }),
          message && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-xs text-foreground", children: message }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: busy, className: "btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60", children: t("auth.send") })
        ] })
      ] })
    ] })
  ] });
}
export {
  AuthPage as component
};
