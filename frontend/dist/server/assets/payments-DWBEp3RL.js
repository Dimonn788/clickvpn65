import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Loader2, Receipt } from "lucide-react";
import { u as useI18n, g as getPaymentsForUser } from "./router-D8SmVkh3.js";
import { u as useAuth } from "./use-auth-RGRywj1y.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "zod";
function statusBadge(status) {
  if (status === "succeeded" || status === "paid") return "text-emerald-300 bg-emerald-400/15";
  if (status === "pending") return "text-amber-300 bg-amber-400/15";
  return "text-muted-foreground bg-white/5";
}
function PaymentsPage() {
  const {
    t,
    locale
  } = useI18n();
  const {
    user
  } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) return;
    getPaymentsForUser().then(({
      payments
    }) => {
      setItems(payments);
      setLoading(false);
    });
  }, [user]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: t("dash.payments") }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", children: t("payments.title") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "glass rounded-2xl", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-12 text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) }) : items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-sm text-muted-foreground", children: t("payments.empty") }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-white/5", children: items.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-4 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20", children: /* @__PURE__ */ jsx(Receipt, { className: "size-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
            new Intl.NumberFormat("ru-RU").format(p.amount_rub),
            " ₽"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            new Date(p.created_at).toLocaleString(locale === "en" ? "en-GB" : "ru-RU"),
            " · ",
            p.provider
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(p.status)}`, children: p.status })
    ] }, p.order_id)) }) })
  ] });
}
export {
  PaymentsPage as component
};
