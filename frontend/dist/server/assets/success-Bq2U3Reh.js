import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Shield, CheckCircle2, ArrowRight } from "lucide-react";
function SuccessPage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-50", "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen flex-col items-center justify-center px-4 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-10", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-3xl p-8 sm:p-12 max-w-md w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "grid size-20 place-items-center rounded-full bg-emerald-400/10 ring-4 ring-emerald-400/20", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-10 text-emerald-400", strokeWidth: 1.5 }) }) }),
        /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-black tracking-tight sm:text-3xl", children: "Оплата прошла успешно" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: "Ваш VPN-ключ активирован. Откройте раздел «Подключение» — там QR-код и пошаговая инструкция." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/connect", className: "btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold", children: [
            "Перейти к подключению",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground", children: "В личный кабинет" })
        ] })
      ] })
    ] })
  ] });
}
export {
  SuccessPage as component
};
