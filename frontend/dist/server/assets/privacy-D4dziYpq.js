import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";
import { u as useI18n } from "./router-D8SmVkh3.js";
import "@tanstack/react-query";
import "react";
import "sonner";
import "zod";
const content = {
  ru: {
    back: "На главную",
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: июнь 2026",
    sections: [{
      heading: "1. Какие данные мы собираем",
      text: "Для регистрации и входа мы используем только адрес электронной почты. Никакие личные данные — имя, телефон, адрес — не запрашиваются. Платёжные данные обрабатываются платформой Platega и не хранятся на наших серверах."
    }, {
      heading: "2. Как мы используем данные",
      text: "Email используется исключительно для отправки ссылки для входа и уведомлений о подписке. Мы не передаём контактные данные третьим лицам и не используем их в маркетинговых целях без вашего согласия."
    }, {
      heading: "3. Технические данные",
      text: "В целях обеспечения работы сервиса на серверах могут сохраняться технические логи подключений (время, объём трафика). Эти данные используются исключительно для диагностики неисправностей и не связываются с личностью пользователя."
    }, {
      heading: "4. Удаление данных",
      text: "Вы можете запросить удаление своего аккаунта и связанных данных в любое время через службу поддержки. После удаления восстановление данных невозможно."
    }]
  },
  en: {
    back: "Back to home",
    title: "Privacy Policy",
    updated: "Last updated: June 2026",
    sections: [{
      heading: "1. What data we collect",
      text: "We only require an email address to register and sign in. No personal details — name, phone number, or address — are collected. Payment data is handled by the Platega platform and is never stored on our servers."
    }, {
      heading: "2. How we use your data",
      text: "Your email is used solely to send login links and subscription notifications. We do not share your contact information with third parties or use it for marketing without your consent."
    }, {
      heading: "3. Technical data",
      text: "To keep the service running, servers may store technical connection logs (timestamps, traffic volume). This data is used exclusively for diagnosing issues and is not linked to any individual user's identity."
    }, {
      heading: "4. Data deletion",
      text: "You may request deletion of your account and associated data at any time by contacting support. Once deleted, data cannot be recovered."
    }]
  }
};
function PrivacyPage() {
  const {
    locale
  } = useI18n();
  const c = content[locale];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-0 h-[400px] bg-aurora opacity-40", "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-2xl px-4 py-12", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }),
        " ",
        c.back
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid size-7 place-items-center rounded-lg bg-gradient-to-br from-white to-[oklch(0.78_0_0)] glow-primary", children: /* @__PURE__ */ jsx(Shield, { className: "size-3.5 text-primary-foreground", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "ClickVPN" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mt-8 text-3xl font-black tracking-tight", children: c.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: c.updated }),
      /* @__PURE__ */ jsx("div", { className: "glass mt-8 rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground", children: c.sections.map((s) => /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-foreground mb-2", children: s.heading }),
        /* @__PURE__ */ jsx("p", { children: s.text })
      ] }, s.heading)) })
    ] })
  ] });
}
export {
  PrivacyPage as component
};
