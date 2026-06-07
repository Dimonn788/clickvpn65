import { jsxs, jsx } from "react/jsx-runtime";
import { useSearch, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Shield, Check, Loader2, CreditCard } from "lucide-react";
import { u as useI18n, c as createSubscriptionForUser } from "./router-D8SmVkh3.js";
import { u as useAuth } from "./use-auth-RGRywj1y.js";
import "@tanstack/react-query";
import "sonner";
import "zod";
const PLANS = {
  1: {
    months: 1,
    price: 109,
    labelKey: "plan.1"
  },
  3: {
    months: 3,
    price: 299,
    labelKey: "plan.3"
  },
  6: {
    months: 6,
    price: 589,
    labelKey: "plan.6"
  },
  12: {
    months: 12,
    price: 1099,
    labelKey: "plan.12"
  }
};
function CheckoutPage() {
  const {
    t
  } = useI18n();
  const {
    plan
  } = useSearch({
    from: "/checkout"
  });
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const months = plan;
  const p = PLANS[months];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const planFeatures = ["plan.feat.devices", "plan.feat.traffic", "plan.feat.locations", "plan.feat.support"];
  async function pay() {
    if (!user) {
      navigate({
        to: "/auth"
      });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const resp = await createSubscriptionForUser({
        data: {
          planMonths: p.months
        }
      });
      if (resp?.pay_url) {
        window.location.href = resp.pay_url;
        return;
      }
      navigate({
        to: "/success"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkout.error"));
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-50", "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-2xl px-4 py-12", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", hash: "pricing", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
        " ",
        t("checkout.back")
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-3xl font-semibold tracking-tight sm:text-4xl", children: t("checkout.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("checkout.subtitle") }),
      /* @__PURE__ */ jsxs("div", { className: "glass-strong mt-8 rounded-3xl p-6 sm:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: t("checkout.plan") }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t(p.labelKey) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: loading ? "…" : user?.email ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-white/5 pt-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: t("checkout.total") }),
          /* @__PURE__ */ jsxs("span", { className: "text-2xl font-semibold tracking-tight", children: [
            new Intl.NumberFormat("ru-RU").format(p.price),
            " ₽"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-2 text-sm text-muted-foreground", children: planFeatures.map((key) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-4 place-items-center rounded-full bg-primary/15", children: /* @__PURE__ */ jsx(Check, { className: "size-2.5 text-primary", strokeWidth: 3 }) }),
          t(key)
        ] }, key)) }),
        error && /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive", children: error }),
        /* @__PURE__ */ jsxs("button", { onClick: pay, disabled: busy || loading, className: "btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium disabled:opacity-60", children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(CreditCard, { className: "size-4" }),
          busy ? t("checkout.processing") : t("checkout.pay")
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-[11px] text-muted-foreground", children: t("checkout.terms") })
      ] })
    ] })
  ] });
}
export {
  CheckoutPage as component
};
