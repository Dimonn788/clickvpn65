import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Why />
      <TrialBanner />
      <Pricing />
      <HowTo />
      <Advantages />
      <Faq />
      <Support />
      <Footer />
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50">
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

function FeatureChip({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
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
        >
          ClickVPN
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg sm:text-2xl font-light tracking-tight text-muted-foreground">
          {t("hero.tagline")}
        </p>

        {/* Feature chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <FeatureChip icon={Smartphone}>{t("hero.pill.devices")}</FeatureChip>
          <FeatureChip icon={InfinityIcon}>{t("hero.pill.traffic")}</FeatureChip>
          <FeatureChip icon={Globe2}>{t("hero.pill.locations")}</FeatureChip>
          <FeatureChip icon={Shield}>{t("hero.pill.support")}</FeatureChip>
          <FeatureChip icon={CreditCard}>{t("hero.pill.payment")}</FeatureChip>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
      items: [t("why.1.a"), t("why.1.b"), t("why.1.c")],
    },
    {
      title: t("why.2.title"),
      icon: Zap,
      items: [t("why.2.a"), t("why.2.b"), t("why.2.c")],
    },
    {
      title: t("why.3.title"),
      icon: MessageCircle,
      items: [t("why.3.a"), t("why.3.b"), t("why.3.c")],
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

function Pricing() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Plan["months"]>(6);
  const selectedPlan = useMemo(() => PLANS.find((p) => p.months === selected)!, [selected]);

  const regular = selectedPlan.months * MONTHLY_BASE;
  const savings = regular - selectedPlan.price;

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
          <div className="glass relative inline-flex rounded-2xl p-1">
            {/* sliding pill */}
            <span
              className="pointer-events-none absolute inset-y-1 rounded-xl bg-gradient-to-br from-white to-[oklch(0.78_0_0)] shadow-[0_8px_24px_-8px_oklch(1_0_0/0.3)]"
              style={{
                width: `calc((100% - 8px) / ${PLANS.length})`,
                left: "4px",
                transform: `translateX(calc(${PLANS.findIndex(p => p.months === selected)} * 100%))`,
                transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
            {PLANS.map((p) => {
              const active = p.months === selected;
              return (
                <button
                  key={p.months}
                  onClick={() => setSelected(p.months)}
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
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-white/10 blur-3xl" />

            <div key={selected} className="animate-plan-in relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {selectedPlan.badgeKey && (
                  <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary">
                    {t(selectedPlan.badgeKey)}
                  </span>
                )}

                <h3 className="mt-4 text-2xl font-bold tracking-tight">{t(selectedPlan.labelKey)}</h3>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tight">{formatPrice(selectedPlan.price)}</span>
                  {savings > 0 && (
                    <span className="text-base text-muted-foreground line-through">{formatPrice(regular)}</span>
                  )}
                </div>

                {savings > 0 && (
                  <p className="mt-1 text-sm text-emerald-300">
                    {t("pricing.savings")} {formatPrice(savings)}
                  </p>
                )}

                <p className="mt-1 text-sm text-muted-foreground">
                  ≈ {formatPrice(Math.round(selectedPlan.price / selectedPlan.months))} {t("pricing.per_month")}
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
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition hover:border-foreground/15 hover:bg-card/70"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
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
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 size-48 rounded-full bg-white/5 blur-2xl" />
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
        </div>
      </div>
    </section>
  );
}

function HowTo() {
  const { t } = useI18n();
  const steps = [t("howto.1"), t("howto.2"), t("howto.3")];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-center text-4xl font-black tracking-tight sm:text-5xl">
          {t("howto.title")}
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="glass rounded-3xl p-7 flex gap-5 items-start">
              <span className="shrink-0 text-5xl font-black text-primary/25 leading-none select-none">{i + 1}</span>
              <p className="text-sm leading-relaxed text-muted-foreground pt-1">{step}</p>
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
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 items-center">
          <div>
            <h2 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">
              {t("support.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("support.subtitle")}</p>
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
          <div className="grid gap-3">
            {cards.map(({ icon: Icon, text }) => (
              <div key={text} className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 shrink-0">
                  <Icon className="size-5" strokeWidth={1.8} />
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
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
