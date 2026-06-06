import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacyPage,
});

const content = {
  ru: {
    back: "На главную",
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: июнь 2026",
    sections: [
      {
        heading: "1. Какие данные мы собираем",
        text: "Для регистрации и входа мы используем только адрес электронной почты. Никакие личные данные — имя, телефон, адрес — не запрашиваются. Платёжные данные обрабатываются платформой Platega и не хранятся на наших серверах.",
      },
      {
        heading: "2. Как мы используем данные",
        text: "Email используется исключительно для отправки ссылки для входа и уведомлений о подписке. Мы не передаём контактные данные третьим лицам и не используем их в маркетинговых целях без вашего согласия.",
      },
      {
        heading: "3. Технические данные",
        text: "В целях обеспечения работы сервиса на серверах могут сохраняться технические логи подключений (время, объём трафика). Эти данные используются исключительно для диагностики неисправностей и не связываются с личностью пользователя.",
      },
      {
        heading: "4. Удаление данных",
        text: "Вы можете запросить удаление своего аккаунта и связанных данных в любое время через службу поддержки. После удаления восстановление данных невозможно.",
      },
    ],
  },
  en: {
    back: "Back to home",
    title: "Privacy Policy",
    updated: "Last updated: June 2026",
    sections: [
      {
        heading: "1. What data we collect",
        text: "We only require an email address to register and sign in. No personal details — name, phone number, or address — are collected. Payment data is handled by the Platega platform and is never stored on our servers.",
      },
      {
        heading: "2. How we use your data",
        text: "Your email is used solely to send login links and subscription notifications. We do not share your contact information with third parties or use it for marketing without your consent.",
      },
      {
        heading: "3. Technical data",
        text: "To keep the service running, servers may store technical connection logs (timestamps, traffic volume). This data is used exclusively for diagnosing issues and is not linked to any individual user's identity.",
      },
      {
        heading: "4. Data deletion",
        text: "You may request deletion of your account and associated data at any time by contacting support. Once deleted, data cannot be recovered.",
      },
    ],
  },
};

function PrivacyPage() {
  const { locale } = useI18n();
  const c = content[locale];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[400px] bg-aurora opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-3.5" /> {c.back}
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
            <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
        </div>

        <h1 className="mt-8 text-3xl font-black tracking-tight">{c.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.updated}</p>

        <div className="glass mt-8 rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {c.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-base font-semibold text-foreground mb-2">{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
