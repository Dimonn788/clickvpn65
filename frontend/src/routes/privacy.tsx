import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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

        <h1 className="mt-8 text-3xl font-black tracking-tight">Политика конфиденциальности</h1>
        <p className="mt-1 text-sm text-muted-foreground">Последнее обновление: июнь 2026</p>

        <div className="glass mt-8 rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Какие данные мы собираем</h2>
            <p>
              Для регистрации и входа мы используем только адрес электронной почты. Никакие личные данные —
              имя, телефон, адрес — не запрашиваются. Платёжные данные обрабатываются платформой Platega
              и не хранятся на наших серверах.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Как мы используем данные</h2>
            <p>
              Email используется исключительно для отправки ссылки для входа и уведомлений о подписке.
              Мы не передаём контактные данные третьим лицам и не используем их в маркетинговых целях
              без вашего согласия.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Технические данные</h2>
            <p>
              В целях обеспечения работы сервиса на серверах могут сохраняться технические логи подключений
              (время, объём трафика). Эти данные используются исключительно для диагностики неисправностей
              и не связываются с личностью пользователя.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Удаление данных</h2>
            <p>
              Вы можете запросить удаление своего аккаунта и связанных данных в любое время через службу
              поддержки. После удаления восстановление данных невозможно.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
