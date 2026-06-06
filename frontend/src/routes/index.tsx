import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useMemo, useState, type ReactNode } from "react";
import {
  Shield,
  Zap,
  Smartphone,
  Infinity as InfinityIcon,
  Globe2,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Check,
  CreditCard,
  KeyRound,
  Wifi,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClickVPN — Fast & Unlimited VPN" },
      { name: "description", content: "One key for all devices. Simple setup, high speed, unlimited traffic." },
      { property: "og:title", content: "ClickVPN — Fast & Unlimited VPN" },
      { property: "og:description", content: "One key for all devices. Simple setup, high speed, unlimited traffic." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

const MONTHLY_BASE = 109;

type Plan = {
  months: 1 | 3 | 6 | 12;
  price: number;
  labelKey: "plan.1" | "plan.3" | "plan.6" | "plan.12";
  badgeKey?: "plan.badge.deal" | "plan.badge.popular";
};

const PLANS: Plan[] = [
  { months: 1, price: 109, labelKey: "plan.1" },
  { months: 3, price: 299, labelKey: "plan.3" },
  { months: 6, price: 589, labelKey: "plan.6", badgeKey: "plan.badge.deal" },
  { months: 12, price: 1099, labelKey: "plan.12", badgeKey: "plan.badge.popular" },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function useAnimatedNumber(target: number, duration = 380) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const frame = useRef<number>();

  useEffect(() => {
    const start = prev.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * ease));
      if (p < 1) { frame.current = requestAnimationFrame(tick); }
      else { prev.current = target; }
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [target, duration]);

  return display;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Reveal><Why /></Reveal>
      <Reveal><TrialBanner /></Reveal>
      <Reveal><Pricing /></Reveal>
      <Reveal><HowTo /></Reveal>
      <Reveal><Advantages /></Reveal>
      <Reveal><Faq /></Reveal>
      <Reveal><Support /></Reveal>
      <Reveal><Footer /></Reveal>
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 animate-intro-up" style={{ animationDelay: "0.65s" }}>
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#pricing" className="transition hover:text-foreground">{t("nav.pricing")}</a>
            <a href="#features" className="transition hover:text-foreground">{t("nav.features")}</a>
            <a href="#faq" className="transition hover:text-foreground">{t("nav.faq")}</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium"
              >
                {t("nav.dashboard")}
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="hidden rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
                >
                  {t("nav.signin")}
                </Link>
                <Link
                  to="/auth"
                  className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium"
                >
                  {t("nav.connect")}
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
      <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function FeatureChip({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
      <Icon className="size-3.5 shrink-0 text-primary" strokeWidth={2} />
      {children}
    </span>
  );
}

function Hero() {
  const { t } = useI18n();
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[700px] bg-aurora opacity-60" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">

        {/* Big brand name */}
        <h1
          className="font-black leading-[0.88] tracking-[-0.04em] select-none"
          style={{ fontSize: "clamp(4.5rem, 16vw, 13rem)" }}
          aria-label="ClickVPN"
        >
          {"ClickVPN".split("").map((char, i) => (
            <span
              key={i}
              className="animate-letter"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p
          className="mt-6 text-lg sm:text-2xl font-light tracking-tight text-muted-foreground animate-intro-up"
          style={{ animationDelay: "0.55s" }}
        >
          {t("hero.tagline")}
        </p>

        {/* Feature chips */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 px-2 animate-intro-up"
          style={{ animationDelay: "0.7s" }}
        >
          <FeatureChip icon={Smartphone}>{t("hero.pill.devices")}</FeatureChip>
          <FeatureChip icon={InfinityIcon}>{t("hero.pill.traffic")}</FeatureChip>
          <FeatureChip icon={Globe2}>{t("hero.pill.locations")}</FeatureChip>
          <FeatureChip icon={CreditCard}>{t("hero.pill.payment")}</FeatureChip>
        </div>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-intro-up"
          style={{ animationDelay: "0.85s" }}
        >
          <a
            href="#pricing"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold"
          >
            {t("hero.cta")}
            <ArrowRight className="size-4" />
          </a>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium text-foreground/80 transition hover:text-foreground"
          >
            {t("hero.signin")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Why() {
  const { t } = useI18n();

  const cards = [
    {
      title: t("why.1.title"),
      icon: Smartphone,
      items: [t("why.1.a"), t("why.1.b"), t("why.1.c"), t("why.1.d")],
    },
    {
      title: t("why.2.title"),
      icon: Zap,
      items: [t("why.2.a"), t("why.2.b"), t("why.2.c"), t("why.2.d")],
    },
    {
      title: t("why.3.title"),
      icon: MessageCircle,
      items: [t("why.3.a"), t("why.3.b"), t("why.3.c"), t("why.3.d")],
    },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-center text-4xl font-black tracking-tight sm:text-5xl">
          {t("why.title")}
        </h2>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {cards.map(({ title, icon: Icon, items }) => (
            <div
              key={title}
              className="glass rounded-3xl p-7"
            >
              <div className="mb-5 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Icon className="size-5" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold tracking-tight">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanTabs({ plans, selected, onSelect }: { plans: Plan[]; selected: Plan["months"]; onSelect: (m: Plan["months"]) => void }) {
  const { t } = useI18n();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 4, width: 0 });

  useEffect(() => {
    const idx = plans.findIndex(p => p.months === selected);
    const btn = btnRefs.current[idx];
    if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [selected, plans]);

  return (
    <div className="glass relative inline-flex rounded-2xl p-1">
      <span
        className="pointer-events-none absolute inset-y-1 rounded-xl bg-gradient-to-br from-white to-[oklch(0.78_0_0)] shadow-[0_8px_24px_-8px_oklch(1_0_0/0.3)]"
        style={{
          left: pill.left,
          width: pill.width,
          transition: "left 300ms cubic-bezier(0.34, 1.56, 0.64, 1), width 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
      {plans.map((p, i) => {
        const active = p.months === selected;
        return (
          <button
            key={p.months}
            ref={el => { btnRefs.current[i] = el; }}
            onClick={() => onSelect(p.months)}
            className={[
              "relative z-10 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {t(p.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

function Pricing() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Plan["months"]>(6);
  const selectedPlan = useMemo(() => PLANS.find((p) => p.months === selected)!, [selected]);

  const regular = selectedPlan.months * MONTHLY_BASE;
  const savings = regular - selectedPlan.price;
  const perMonth = Math.round(selectedPlan.price / selectedPlan.months);

  const animPrice = useAnimatedNumber(selectedPlan.price);
  const animRegular = useAnimatedNumber(regular);
  const animSavings = useAnimatedNumber(savings);
  const animPerMonth = useAnimatedNumber(perMonth);

  const planFeatures = [
    t("plan.feat.devices"),
    t("plan.feat.traffic"),
    t("plan.feat.locations"),
    t("plan.feat.support"),
  ];

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">{t("pricing.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
        </div>

        <div className="mt-10 flex justify-center">
          <PlanTabs plans={PLANS} selected={selected} onSelect={setSelected} />
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">

            <div key={selected} className="animate-plan-in relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className={`inline-flex items-center rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary ${selectedPlan.badgeKey ? "visible" : "invisible"}`}>
                  {selectedPlan.badgeKey ? t(selectedPlan.badgeKey) : " "}
                </span>

                <h3 className="mt-4 text-2xl font-bold tracking-tight">{t(selectedPlan.labelKey)}</h3>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tight tabular-nums">{formatPrice(animPrice)}</span>
                  <span className={`text-base text-muted-foreground line-through tabular-nums ${savings > 0 ? "visible" : "invisible"}`}>
                    {formatPrice(animRegular)}
                  </span>
                </div>

                <p className={`mt-1 text-sm text-emerald-300 tabular-nums ${savings > 0 ? "visible" : "invisible"}`}>
                  {t("pricing.savings")} {formatPrice(animSavings)}
                </p>

                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  ≈ {formatPrice(animPerMonth)} {t("pricing.per_month")}
                </p>

                <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {planFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/checkout"
                search={{ plan: selectedPlan.months }}
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold sm:min-w-[180px]"
              >
                {t("pricing.cta")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  const { t } = useI18n();

  const advantages = [
    { icon: Smartphone, title: t("feat.devices.title"), text: t("feat.devices.text") },
    { icon: Zap, title: t("feat.speed.title"), text: t("feat.speed.text") },
    { icon: InfinityIcon, title: t("feat.traffic.title"), text: t("feat.traffic.text") },
    { icon: Shield, title: t("feat.support.title"), text: t("feat.support.text") },
    { icon: MessageCircle, title: t("feat.telegram.title"), text: t("feat.telegram.text") },
    { icon: Globe2, title: t("feat.locations.title"), text: t("feat.locations.text") },
  ];

  return (
    <section id="features" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">{t("feat.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("feat.subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card/40 p-6 transition hover:border-foreground/15 hover:bg-card/70"
            >
              <div className="relative grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <h3 className="relative mt-5 text-base font-bold tracking-tight">{title}</h3>
              <p className="relative mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const faqItems = [
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
    { q: t("faq.5.q"), a: t("faq.5.a") },
  ];

  return (
    <section id="faq" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">{t("faq.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("faq.subtitle")}</p>
        </div>

        <div className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <button
                key={item.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="block w-full px-6 py-5 text-left transition hover:bg-card/70"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180 text-foreground" : ""}`}
                  />
                </div>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-sm text-muted-foreground">{item.a}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-border glass-strong p-8 text-center sm:p-12">
          <h3 className="text-balance text-2xl font-black tracking-tight sm:text-3xl">
            {t("cta.title")}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {t("cta.subtitle")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#pricing"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
            >
              {t("cta.btn")}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrialBanner() {
  const { t } = useI18n();
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-8 sm:px-12">
          <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-primary-foreground sm:text-3xl">
                {t("trial.title")}
              </h2>
              <p className="mt-1 text-sm text-primary-foreground/75">{t("trial.subtitle")}</p>
            </div>
            <Link
              to="/auth"
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-primary-foreground px-7 py-3.5 text-sm font-bold text-primary transition hover:opacity-90"
            >
              {t("trial.cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-default select-none whitespace-nowrap text-xs font-medium text-primary-foreground opacity-0 transition-opacity duration-500 hover:opacity-30">
            сайт сделан Димоном :)
          </span>
        </div>
      </div>
    </section>
  );
}

function HowTo() {
  const { t } = useI18n();
  const steps = [
    { text: t("howto.1"), icon: CreditCard },
    { text: t("howto.2"), icon: Smartphone },
    { text: t("howto.3"), icon: Wifi },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-center text-4xl font-black tracking-tight sm:text-5xl">
          {t("howto.title")}
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {steps.map(({ text, icon: Icon }, i) => (
            <div key={i} className="glass rounded-2xl p-5 flex gap-4 items-start">
              <div className="shrink-0 mt-0.5 grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                <Icon className="size-4" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary/60 mb-1">Шаг {i + 1}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Support() {
  const { t } = useI18n();
  const cards = [
    { icon: MessageCircle, text: t("support.card.1") },
    { icon: CreditCard, text: t("support.card.2") },
    { icon: Globe2, text: t("support.card.3") },
  ];
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="glass-strong rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
            {t("support.title")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">{t("support.subtitle")}</p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {cards.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  <Icon className="size-4" strokeWidth={1.8} />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <a
            href="https://t.me/help_clickbot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
          >
            {t("support.cta")}
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-foreground/80">ClickVPN</span>
          <span className="opacity-60">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/terms" className="transition hover:text-foreground">{t("footer.terms")}</Link>
          <Link to="/privacy" className="transition hover:text-foreground">{t("footer.privacy")}</Link>
          <a href="https://t.me/help_clickbot" target="_blank" rel="noopener noreferrer" className="transition hover:text-foreground">{t("footer.support")}</a>
        </div>
      </div>
    </footer>
  );
}
