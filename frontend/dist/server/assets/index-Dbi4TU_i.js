import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowRight, Smartphone, Infinity, Globe2, CreditCard, Zap, MessageCircle, Check, Wifi, Shield, ChevronDown } from "lucide-react";
import { u as useAuth } from "./use-auth-RGRywj1y.js";
import { u as useI18n } from "./router-D8SmVkh3.js";
import "@tanstack/react-query";
import "sonner";
import "zod";
const MONTHLY_BASE = 109;
const PLANS = [{
  months: 1,
  price: 109,
  labelKey: "plan.1"
}, {
  months: 3,
  price: 299,
  labelKey: "plan.3"
}, {
  months: 6,
  price: 589,
  labelKey: "plan.6",
  badgeKey: "plan.badge.deal"
}, {
  months: 12,
  price: 1099,
  labelKey: "plan.12",
  badgeKey: "plan.badge.popular"
}];
function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}
function useAnimatedNumber(target, duration = 380) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const frame = useRef();
  useEffect(() => {
    const start = prev.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * ease));
      if (p < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        prev.current = target;
      }
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);
  return display;
}
function LandingPage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Why, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(TrialBanner, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Pricing, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(HowTo, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Advantages, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Faq, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Support, {}) }),
    /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Footer, {}) })
  ] });
}
function Header() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 animate-intro-up", style: {
    animationDelay: "0.65s"
  }, children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-4 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "glass flex items-center justify-between rounded-2xl px-4 py-2.5", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-7 text-sm text-muted-foreground md:flex", children: [
      /* @__PURE__ */ jsx("a", { href: "#pricing", className: "transition hover:text-foreground", children: t("nav.pricing") }),
      /* @__PURE__ */ jsx("a", { href: "#features", className: "transition hover:text-foreground", children: t("nav.features") }),
      /* @__PURE__ */ jsx("a", { href: "#faq", className: "transition hover:text-foreground", children: t("nav.faq") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: user ? /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium", children: [
      t("nav.dashboard"),
      /* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/auth", className: "hidden rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex", children: t("nav.signin") }),
      /* @__PURE__ */ jsxs(Link, { to: "/auth", className: "btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium", children: [
        t("nav.connect"),
        /* @__PURE__ */ jsx(ArrowRight, { className: "size-3.5" })
      ] })
    ] }) })
  ] }) }) });
}
function Logo() {
  return /* @__PURE__ */ jsx("div", { className: "relative grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) });
}
function Reveal({
  children,
  delay = 0
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("is-visible");
        obs.disconnect();
      }
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return /* @__PURE__ */ jsx("div", { ref, className: "reveal", style: delay ? {
    transitionDelay: `${delay}ms`
  } : void 0, children });
}
function FeatureChip({
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Icon, { className: "size-3.5 shrink-0 text-primary", strokeWidth: 2 }),
    children
  ] });
}
function Hero() {
  const {
    t
  } = useI18n();
  const {
    user
  } = useAuth();
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-grid", "aria-hidden": true }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[700px] bg-aurora opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-black leading-[0.88] tracking-[-0.04em] select-none", style: {
        fontSize: "clamp(4.5rem, 16vw, 13rem)"
      }, "aria-label": "ClickVPN", children: "ClickVPN".split("").map((char, i) => /* @__PURE__ */ jsx("span", { className: "animate-letter", style: {
        animationDelay: `${i * 60}ms`
      }, children: char }, i)) }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg sm:text-2xl font-light tracking-tight text-muted-foreground animate-intro-up", style: {
        animationDelay: "0.55s"
      }, children: t("hero.tagline") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-2 px-2 animate-intro-up", style: {
        animationDelay: "0.7s"
      }, children: [
        /* @__PURE__ */ jsx(FeatureChip, { icon: Smartphone, children: t("hero.pill.devices") }),
        /* @__PURE__ */ jsx(FeatureChip, { icon: Infinity, children: t("hero.pill.traffic") }),
        /* @__PURE__ */ jsx(FeatureChip, { icon: Globe2, children: t("hero.pill.locations") }),
        /* @__PURE__ */ jsx(FeatureChip, { icon: CreditCard, children: t("hero.pill.payment") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3 animate-intro-up", style: {
        animationDelay: "0.85s"
      }, children: [
        /* @__PURE__ */ jsxs("a", { href: "#pricing", className: "btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold", children: [
          t("hero.cta"),
          /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: user ? "/dashboard" : "/auth", className: "glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium text-foreground/80 transition hover:text-foreground", children: t("hero.signin") })
      ] })
    ] })
  ] });
}
function Why() {
  const {
    t
  } = useI18n();
  const cards = [{
    title: t("why.1.title"),
    icon: Smartphone,
    items: [t("why.1.a"), t("why.1.b"), t("why.1.c"), t("why.1.d")]
  }, {
    title: t("why.2.title"),
    icon: Zap,
    items: [t("why.2.a"), t("why.2.b"), t("why.2.c"), t("why.2.d")]
  }, {
    title: t("why.3.title"),
    icon: MessageCircle,
    items: [t("why.3.a"), t("why.3.b"), t("why.3.c"), t("why.3.d")]
  }];
  return /* @__PURE__ */ jsx("section", { className: "relative py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-balance text-center text-4xl font-black tracking-tight sm:text-5xl", children: t("why.title") }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid gap-4 sm:grid-cols-3", children: cards.map(({
      title,
      icon: Icon,
      items
    }) => /* @__PURE__ */ jsxs("div", { className: "glass rounded-3xl p-7", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-5 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20", children: /* @__PURE__ */ jsx(Icon, { className: "size-5", strokeWidth: 1.8 }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold tracking-tight", children: title }),
      /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2.5", children: items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Check, { className: "size-4 shrink-0 text-primary", strokeWidth: 2.5 }),
        item
      ] }, item)) })
    ] }, title)) })
  ] }) });
}
function PlanTabs({
  plans,
  selected,
  onSelect
}) {
  const {
    t
  } = useI18n();
  const btnRefs = useRef([]);
  const [pill, setPill] = useState({
    left: 4,
    width: 0
  });
  useEffect(() => {
    const idx = plans.findIndex((p) => p.months === selected);
    const btn = btnRefs.current[idx];
    if (btn) setPill({
      left: btn.offsetLeft,
      width: btn.offsetWidth
    });
  }, [selected, plans]);
  return /* @__PURE__ */ jsxs("div", { className: "glass relative inline-flex rounded-2xl p-1", children: [
    /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-y-1 rounded-xl bg-gradient-to-br from-white to-[oklch(0.78_0_0)] shadow-[0_8px_24px_-8px_oklch(1_0_0/0.3)]", style: {
      left: pill.left,
      width: pill.width,
      transition: "left 300ms cubic-bezier(0.34, 1.56, 0.64, 1), width 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
    } }),
    plans.map((p, i) => {
      const active = p.months === selected;
      return /* @__PURE__ */ jsx("button", { ref: (el) => {
        btnRefs.current[i] = el;
      }, onClick: () => onSelect(p.months), className: ["relative z-10 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200", active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"].join(" "), children: t(p.labelKey) }, p.months);
    })
  ] });
}
function Pricing() {
  const {
    t
  } = useI18n();
  const [selected, setSelected] = useState(6);
  const selectedPlan = useMemo(() => PLANS.find((p) => p.months === selected), [selected]);
  const regular = selectedPlan.months * MONTHLY_BASE;
  const savings = regular - selectedPlan.price;
  const perMonth = Math.round(selectedPlan.price / selectedPlan.months);
  const animPrice = useAnimatedNumber(selectedPlan.price);
  const animRegular = useAnimatedNumber(regular);
  const animSavings = useAnimatedNumber(savings);
  const animPerMonth = useAnimatedNumber(perMonth);
  const planFeatures = [t("plan.feat.devices"), t("plan.feat.traffic"), t("plan.feat.locations"), t("plan.feat.support")];
  return /* @__PURE__ */ jsx("section", { id: "pricing", className: "relative scroll-mt-24 py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-balance text-4xl font-black tracking-tight sm:text-5xl", children: t("pricing.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: t("pricing.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 flex justify-center", children: /* @__PURE__ */ jsx(PlanTabs, { plans: PLANS, selected, onSelect: setSelected }) }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto mt-10 max-w-3xl", children: /* @__PURE__ */ jsx("div", { className: "glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10", children: /* @__PURE__ */ jsxs("div", { className: "animate-plan-in relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary ${selectedPlan.badgeKey ? "visible" : "invisible"}`, children: selectedPlan.badgeKey ? t(selectedPlan.badgeKey) : " " }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-2xl font-bold tracking-tight", children: t(selectedPlan.labelKey) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xl font-black tracking-tight tabular-nums", children: formatPrice(animPrice) }),
          /* @__PURE__ */ jsx("span", { className: `text-base text-muted-foreground line-through tabular-nums ${savings > 0 ? "visible" : "invisible"}`, children: formatPrice(animRegular) })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: `mt-1 text-sm text-emerald-300 tabular-nums ${savings > 0 ? "visible" : "invisible"}`, children: [
          t("pricing.savings"),
          " ",
          formatPrice(animSavings)
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground tabular-nums", children: [
          "≈ ",
          formatPrice(animPerMonth),
          " ",
          t("pricing.per_month")
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2", children: planFeatures.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Check, { className: "size-4 shrink-0 text-primary", strokeWidth: 2.5 }),
          f
        ] }, f)) })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/checkout", search: {
        plan: selectedPlan.months
      }, className: "btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold sm:min-w-[180px]", children: [
        t("pricing.cta"),
        /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
      ] })
    ] }, selected) }) })
  ] }) });
}
function Advantages() {
  const {
    t
  } = useI18n();
  const advantages = [{
    icon: Smartphone,
    title: t("feat.devices.title"),
    text: t("feat.devices.text")
  }, {
    icon: Zap,
    title: t("feat.speed.title"),
    text: t("feat.speed.text")
  }, {
    icon: Infinity,
    title: t("feat.traffic.title"),
    text: t("feat.traffic.text")
  }, {
    icon: Shield,
    title: t("feat.support.title"),
    text: t("feat.support.text")
  }, {
    icon: MessageCircle,
    title: t("feat.telegram.title"),
    text: t("feat.telegram.text")
  }, {
    icon: Globe2,
    title: t("feat.locations.title"),
    text: t("feat.locations.text")
  }];
  return /* @__PURE__ */ jsx("section", { id: "features", className: "relative scroll-mt-24 py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-balance text-4xl font-black tracking-tight sm:text-5xl", children: t("feat.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: t("feat.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: advantages.map(({
      icon: Icon,
      title,
      text
    }) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card/40 p-6 transition hover:border-foreground/15 hover:bg-card/70", children: [
      /* @__PURE__ */ jsx("div", { className: "relative grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20", children: /* @__PURE__ */ jsx(Icon, { className: "size-5", strokeWidth: 2 }) }),
      /* @__PURE__ */ jsx("h3", { className: "relative mt-5 text-base font-bold tracking-tight", children: title }),
      /* @__PURE__ */ jsx("p", { className: "relative mt-1.5 text-sm text-muted-foreground", children: text })
    ] }, title)) })
  ] }) });
}
function Faq() {
  const {
    t
  } = useI18n();
  const [open, setOpen] = useState(0);
  const faqItems = [{
    q: t("faq.1.q"),
    a: t("faq.1.a")
  }, {
    q: t("faq.2.q"),
    a: t("faq.2.a")
  }, {
    q: t("faq.3.q"),
    a: t("faq.3.a")
  }, {
    q: t("faq.4.q"),
    a: t("faq.4.a")
  }, {
    q: t("faq.5.q"),
    a: t("faq.5.a")
  }];
  return /* @__PURE__ */ jsx("section", { id: "faq", className: "relative scroll-mt-24 py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-balance text-4xl font-black tracking-tight sm:text-5xl", children: t("faq.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: t("faq.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40", children: faqItems.map((item, i) => {
      const isOpen = open === i;
      return /* @__PURE__ */ jsxs("button", { onClick: () => setOpen(isOpen ? null : i), className: "block w-full px-6 py-5 text-left transition hover:bg-card/70", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold sm:text-base", children: item.q }),
          /* @__PURE__ */ jsx(ChevronDown, { className: `size-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180 text-foreground" : ""}` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `grid transition-all duration-300 ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden text-sm text-muted-foreground", children: item.a }) })
      ] }, item.q);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16 overflow-hidden rounded-3xl border border-border glass-strong p-8 text-center sm:p-12", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-balance text-2xl font-black tracking-tight sm:text-3xl", children: t("cta.title") }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground", children: t("cta.subtitle") }),
      /* @__PURE__ */ jsx("div", { className: "mt-7 flex flex-wrap items-center justify-center gap-3", children: /* @__PURE__ */ jsxs("a", { href: "#pricing", className: "btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold", children: [
        t("cta.btn"),
        /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
      ] }) })
    ] })
  ] }) });
}
function TrialBanner() {
  const {
    t
  } = useI18n();
  return /* @__PURE__ */ jsx("section", { className: "py-10", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-4", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-primary px-8 py-8 sm:px-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black tracking-tight text-primary-foreground sm:text-3xl", children: t("trial.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-primary-foreground/75", children: t("trial.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/auth", className: "shrink-0 inline-flex items-center gap-2 rounded-2xl bg-primary-foreground px-7 py-3.5 text-sm font-bold text-primary transition hover:opacity-90", children: [
        t("trial.cta"),
        /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-default select-none whitespace-nowrap text-xs font-medium text-primary-foreground opacity-0 transition-opacity duration-500 hover:opacity-30", children: "сайт сделан Димоном :)" })
  ] }) }) });
}
function HowTo() {
  const {
    t
  } = useI18n();
  const steps = [{
    text: t("howto.1"),
    icon: CreditCard
  }, {
    text: t("howto.2"),
    icon: Smartphone
  }, {
    text: t("howto.3"),
    icon: Wifi
  }];
  return /* @__PURE__ */ jsx("section", { className: "relative py-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-balance text-center text-4xl font-black tracking-tight sm:text-5xl", children: t("howto.title") }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-3 sm:grid-cols-3", children: steps.map(({
      text,
      icon: Icon
    }, i) => /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-5 flex gap-4 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0 mt-0.5 grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15", children: /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 1.8 }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-primary/60 mb-1", children: [
          "Шаг ",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: text })
      ] })
    ] }, i)) })
  ] }) });
}
function Support() {
  const {
    t
  } = useI18n();
  const cards = [{
    icon: MessageCircle,
    text: t("support.card.1")
  }, {
    icon: CreditCard,
    text: t("support.card.2")
  }, {
    icon: Globe2,
    text: t("support.card.3")
  }];
  return /* @__PURE__ */ jsx("section", { className: "relative py-20", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl px-4", children: /* @__PURE__ */ jsxs("div", { className: "glass-strong rounded-3xl p-8 sm:p-12 text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-balance text-3xl font-black tracking-tight sm:text-4xl", children: t("support.title") }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground max-w-md mx-auto", children: t("support.subtitle") }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-3 text-left sm:grid-cols-3", children: cards.map(({
      icon: Icon,
      text
    }) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-white/5 bg-white/3 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20", children: /* @__PURE__ */ jsx(Icon, { className: "size-4", strokeWidth: 1.8 }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: text })
    ] }, text)) }),
    /* @__PURE__ */ jsxs("a", { href: "https://t.me/help_clickbot", target: "_blank", rel: "noopener noreferrer", className: "btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold", children: [
      t("support.cta"),
      /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
    ] })
  ] }) }) });
}
function Footer() {
  const {
    t
  } = useI18n();
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border/70 py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground/80", children: "ClickVPN" }),
      /* @__PURE__ */ jsxs("span", { className: "opacity-60", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear()
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx(Link, { to: "/terms", className: "transition hover:text-foreground", children: t("footer.terms") }),
      /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "transition hover:text-foreground", children: t("footer.privacy") }),
      /* @__PURE__ */ jsx("a", { href: "https://t.me/help_clickbot", target: "_blank", rel: "noopener noreferrer", className: "transition hover:text-foreground", children: t("footer.support") })
    ] })
  ] }) });
}
export {
  LandingPage as component
};
