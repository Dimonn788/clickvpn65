import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Shield } from "lucide-react";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Оплата прошла — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[500px] bg-aurora opacity-50" aria-hidden />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">

        <div className="flex items-center gap-2 mb-10">
          <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary">
            <Shield className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">ClickVPN</span>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-12 max-w-md w-full">
          <div className="flex justify-center">
            <div className="grid size-20 place-items-center rounded-full bg-emerald-400/10 ring-4 ring-emerald-400/20">
              <CheckCircle2 className="size-10 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-black tracking-tight sm:text-3xl">
            Оплата прошла успешно
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Ваш VPN-ключ активирован. Откройте раздел «Подключение» — там QR-код и пошаговая инструкция.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/connect"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
            >
              Перейти к подключению
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground"
            >
              В личный кабинет
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
