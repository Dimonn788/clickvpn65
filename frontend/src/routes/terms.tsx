import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Условия использования — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsPage,
});

const content = {
  ru: {
    back: "На главную",
    title: "Условия использования",
    updated: "Последнее обновление: июнь 2026",
    sections: [
      {
        heading: "1. Общие положения",
        text: "Используя сервис ClickVPN, вы соглашаетесь с настоящими условиями. Сервис предоставляет доступ к VPN-инфраструктуре для защищённого подключения к интернету. Мы оставляем за собой право изменять условия в любое время с уведомлением пользователей.",
      },
      {
        heading: "2. Использование сервиса",
        text: "Сервис предназначен исключительно для законной деятельности. Запрещается использование ClickVPN для нарушения законодательства, распространения вредоносного программного обеспечения или иных противоправных действий. При нарушении условий аккаунт может быть заблокирован без возврата средств.",
      },
      {
        heading: "3. Оплата и возврат",
        text: "Оплата производится через платёжную платформу Platega. После активации подписки возврат средств не предусмотрен, за исключением случаев технической неисправности сервиса по нашей вине. По всем вопросам оплаты обращайтесь в поддержку.",
      },
      {
        heading: "4. Ответственность",
        text: "Сервис предоставляется «как есть». Мы не несём ответственности за перебои в работе, вызванные обстоятельствами вне нашего контроля. Мы прилагаем все усилия для поддержания стабильной работы инфраструктуры.",
      },
    ],
  },
  en: {
    back: "Back to home",
    title: "Terms of Service",
    updated: "Last updated: June 2026",
    sections: [
      {
        heading: "1. General",
        text: "By using ClickVPN, you agree to these terms. The service provides access to VPN infrastructure for secure internet connectivity. We reserve the right to modify these terms at any time with notice to users.",
      },
      {
        heading: "2. Acceptable use",
        text: "The service is intended solely for lawful activity. Using ClickVPN to violate applicable law, distribute malware, or engage in any other unlawful conduct is prohibited. Violations may result in account termination without a refund.",
      },
      {
        heading: "3. Payment and refunds",
        text: "Payments are processed through the Platega platform. Once a subscription is activated, refunds are not available except in cases of a service failure caused by us. For all payment questions, please contact support.",
      },
      {
        heading: "4. Liability",
        text: "The service is provided \"as is\". We are not liable for outages caused by circumstances beyond our control. We make every effort to maintain stable and reliable infrastructure.",
      },
    ],
  },
};

function TermsPage() {
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
