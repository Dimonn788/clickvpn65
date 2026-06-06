import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Условия использования — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[400px] bg-aurora opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-3.5" /> На главную
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
            <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
        </div>

        <h1 className="mt-8 text-3xl font-black tracking-tight">Условия использования</h1>
        <p className="mt-1 text-sm text-muted-foreground">Последнее обновление: июнь 2026</p>

        <div className="glass mt-8 rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Общие положения</h2>
            <p>
              Используя сервис ClickVPN, вы соглашаетесь с настоящими условиями. Сервис предоставляет доступ к
              VPN-инфраструктуре для защищённого подключения к интернету. Мы оставляем за собой право изменять
              условия в любое время с уведомлением пользователей.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Использование сервиса</h2>
            <p>
              Сервис предназначен исключительно для законной деятельности. Запрещается использование ClickVPN
              для нарушения законодательства, распространения вредоносного программного обеспечения или иных
              противоправных действий. При нарушении условий аккаунт может быть заблокирован без возврата средств.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Оплата и возврат</h2>
            <p>
              Оплата производится через платёжную платформу Platega. После активации подписки возврат средств
              не предусмотрен, за исключением случаев технической неисправности сервиса по нашей вине. По всем
              вопросам оплаты обращайтесь в поддержку.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Ответственность</h2>
            <p>
              Сервис предоставляется «как есть». Мы не несём ответственности за перебои в работе,
              вызванные обстоятельствами вне нашего контроля. Мы прилагаем все усилия для поддержания
              стабильной работы инфраструктуры.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
