import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "ru" | "en";

const dict = {
  ru: {
    // Nav
    "nav.pricing": "Тарифы",
    "nav.features": "Возможности",
    "nav.faq": "FAQ",
    "nav.signin": "Войти",
    "nav.connect": "Подключиться",
    "nav.dashboard": "Кабинет",
    "nav.signout": "Выйти",

    // Auth
    "auth.title": "Вход по email",
    "auth.subtitle": "Введите email — мы пришлём ссылку для входа",
    "auth.email": "Email",
    "auth.send": "Войти",
    "auth.error.generic": "Не удалось выполнить запрос",
    "auth.sent": "Ссылка для входа отправлена на почту. Проверьте письмо.",
    "auth.dev.link": "Нажмите здесь для входа",

    // Hero
    "hero.badge": "Новое поколение VPN — без настроек",
    "hero.h1.1": "Свободный интернет",
    "hero.h1.2": "без ограничений",
    "hero.p": "Один ключ для всех устройств. Простое подключение. Высокая скорость. Без лишних настроек.",
    "hero.cta": "Подключиться",
    "hero.signin": "Войти в кабинет",
    "hero.tagline": "Быстрый интернет без ограничений",
    "hero.pill.devices": "До 5 устройств",
    "hero.pill.traffic": "Безлимитный трафик",
    "hero.pill.locations": "7 локаций",
    "hero.pill.support": "Поддержка 24/7",
    "hero.pill.payment": "СБП · карта · криптовалюта",

    "why.title": "Что вы получаете",
    "why.1.title": "Один ключ для всех",
    "why.1.a": "Телефон, ноутбук, планшет, ТВ",
    "why.1.b": "До 5 устройств одновременно",
    "why.1.c": "iOS, Android, Windows, macOS",
    "why.1.d": "Подключение за минуту",
    "why.2.title": "Скорость и надёжность",
    "why.2.a": "Высокая скорость соединения",
    "why.2.b": "Безлимитный трафик без ограничений",
    "why.2.c": "7 серверных локаций на выбор",
    "why.2.d": "Стабильная работа 24/7",
    "why.3.title": "Удобное управление",
    "why.3.a": "Личный кабинет с VPN-ключом",
    "why.3.b": "Управление устройствами онлайн",
    "why.3.c": "Telegram-уведомления о подписке",
    "why.3.d": "Поддержка 24/7",

    // Pricing
    "pricing.title": "Простые тарифы",
    "pricing.subtitle": "Чем длиннее подписка — тем выгоднее. Без скрытых платежей и автопродлений.",
    "pricing.savings": "Экономия",
    "pricing.per_month": "в месяц",
    "pricing.cta": "Оформить",
    "plan.1": "1 месяц",
    "plan.3": "3 месяца",
    "plan.6": "6 месяцев",
    "plan.12": "12 месяцев",
    "plan.badge.deal": "Выгодно",
    "plan.badge.popular": "Популярный выбор",
    "plan.feat.devices": "До 5 устройств",
    "plan.feat.traffic": "Безлимитный трафик",
    "plan.feat.locations": "7 локаций",
    "plan.feat.support": "Поддержка 24/7",

    // Advantages
    "feat.title": "Всё, что нужно",
    "feat.subtitle": "Минимум настроек, максимум пользы. Подключайтесь в один клик и пользуйтесь интернетом без ограничений.",
    "feat.devices.title": "До 5 устройств",
    "feat.devices.text": "Один ключ — телефон, ноутбук, планшет и ТВ одновременно.",
    "feat.speed.title": "Высокая скорость",
    "feat.speed.text": "Стабильное соединение и быстрый доступ к сервисам.",
    "feat.traffic.title": "Безлимитный трафик",
    "feat.traffic.text": "Без ограничений на объём и скорость передачи.",
    "feat.support.title": "Поддержка 24/7",
    "feat.support.text": "Помогаем разобраться в любое время суток.",
    "feat.telegram.title": "Telegram-уведомления",
    "feat.telegram.text": "Статус подписки и продления — прямо в Telegram.",
    "feat.locations.title": "7 серверных локаций",
    "feat.locations.text": "Гибкий выбор страны для надёжной работы.",

    // FAQ
    "faq.title": "Частые вопросы",
    "faq.subtitle": "Коротко и по делу.",
    "faq.1.q": "Как подключиться?",
    "faq.1.a": "После оплаты в личном кабинете появится VPN-ключ. Скопируйте его и вставьте в приложение — подключение займёт меньше минуты.",
    "faq.2.q": "Как продлить подписку?",
    "faq.2.a": "В разделе «Обзор» нажмите «Продлить» и выберите удобный тариф. Срок действия добавится к текущему.",
    "faq.3.q": "Сколько устройств поддерживается?",
    "faq.3.a": "До 5 устройств одновременно по одному ключу. Управлять списком можно в разделе «Устройства».",
    "faq.4.q": "Как отвязать устройство?",
    "faq.4.a": "В разделе «Устройства» нажмите «Отвязать» рядом с нужным устройством. Доступ для него сразу прекращается.",
    "faq.5.q": "Какие способы оплаты доступны?",
    "faq.5.a": "СБП, банковские карты и криптовалюта через защищённую платформу Platega.",

    // Trial banner
    "trial.title": "Попробуйте бесплатно",
    "trial.subtitle": "Все преимущества без ограничений — для новых пользователей",
    "trial.cta": "Попробовать",

    // How to
    "howto.title": "Как пользоваться ClickVPN",
    "howto.1": "Оформите подписку и получите ключ доступа в личном кабинете сразу после оплаты",
    "howto.2": "Установите приложение на телефон, ноутбук или любое другое устройство",
    "howto.3": "Введите ключ — и пользуйтесь быстрым VPN без ограничений",

    // Support section
    "support.title": "Остались вопросы?",
    "support.subtitle": "Напишите нам — поможем от первой настройки до стабильного подключения",
    "support.cta": "Написать в поддержку",
    "support.card.1": "На связи 24/7 — поможем в любое время",
    "support.card.2": "Решим вопросы по подписке и оплате",
    "support.card.3": "Поможем настроить VPN и подобрать локацию",

    // CTA block
    "cta.title": "Готовы начать прямо сейчас?",
    "cta.subtitle": "Оформите подписку за минуту — ключ появится в личном кабинете сразу после оплаты.",
    "cta.btn": "Подключиться",

    // Footer
    "footer.terms": "Условия",
    "footer.privacy": "Политика",
    "footer.support": "Поддержка",

    // Dashboard
    "dash.title": "Личный кабинет",
    "dash.overview": "Обзор",
    "dash.devices": "Устройства",
    "dash.payments": "Платежи",
    "dash.settings": "Настройки",
    "dash.subscription": "Подписка",
    "dash.subscription.none": "Активной подписки нет",
    "dash.subscription.choose": "Выберите тариф на главной",
    "dash.subscription.active": "Активна до",
    "dash.subscription.expired": "Истекла",
    "dash.subscription.pending": "Ожидает оплаты",
    "dash.key.title": "VPN-ключ",
    "dash.key.none": "Ключ появится после активации подписки",
    "dash.key.copy": "Скопировать",
    "dash.key.copied": "Скопировано",
    "dash.key.error": "Не удалось скопировать ключ",
    "dash.renew": "Продлить",
    "dash.subscribe": "Оформить",

    // Devices
    "devices.title": "Ваши устройства",
    "devices.subtitle": "До 5 устройств одновременно по одному ключу.",
    "devices.empty": "У вас ещё нет устройств.",
    "devices.added": "добавлено",
    "devices.remove": "Отвязать",
    "devices.error": "Произошла ошибка — перезагрузите страницу",
    "devices.reload": "Перезагрузить",

    // Payments
    "payments.title": "История платежей",
    "payments.empty": "Платежей пока нет.",

    // Settings
    "settings.title": "Настройки аккаунта",
    "settings.email.hint": "Используется для входа по email.",
    "settings.telegram.hint": "Привяжите username, чтобы получать уведомления о подписке и продлении.",
    "settings.telegram.hint2": "Нажмите «Привязать», чтобы получить ссылку для привязки Telegram.",
    "settings.telegram.hint3": "Если ссылка не открывается — используйте Telegram и откройте deeplink вручную.",
    "settings.telegram.open": "Открыть в Telegram",
    "settings.telegram.saved": "Сохранено",
    "settings.telegram.link": "Привязать",
    "settings.language": "Язык интерфейса",

    // Connect (dashboard)
    "connect.title": "Как подключиться",
    "connect.subtitle": "Отсканируйте QR-код или скопируйте ключ в приложение",
    "connect.no_sub": "Активной подписки нет — оформите тариф, чтобы получить ключ.",
    "connect.qr.title": "QR-код",
    "connect.qr.hint": "Отсканируйте в приложении",
    "connect.key.title": "Ключ подписки",
    "connect.key.copy": "Скопировать",
    "connect.key.copied": "Скопировано",
    "connect.steps.title": "Инструкция",
    "connect.step.ios": "iOS — скачайте Streisand или V2Box из App Store, нажмите «+» и отсканируйте QR",
    "connect.step.android": "Android — скачайте V2RayNG или Hiddify из Google Play, нажмите «+» и вставьте ключ",
    "connect.step.windows": "Windows — скачайте Hiddify или V2RayN, нажмите «+» и вставьте ключ подписки",
    "connect.step.macos": "macOS — скачайте Streisand или V2Box из App Store, нажмите «+» и вставьте ключ",
    "connect.via": "— подключение через",
    "connect.install": "Установи",
    "connect.install.from": "из",
    "connect.copy_link": "Скопируй ссылку подписки:",
    "connect.link_pending": "Ссылка появится после активации подписки",
    "connect.step3": "Открой приложение → нажми «+» в правом верхнем углу → выбери «Добавить из буфера обмена».",
    "connect.step4": "Жми «Подключить».",
    "connect.copy": "Копировать",
    "connect.copied": "Скопировано",
    "connect.copy_key": "Скопировать ключ",
    "connect.qr_hint": "QR-код для сканирования в приложении",
    "connect.store.developer": "сайта разработчика",
    "connect.store.google": "Google Play",
    "connect.store.appstore": "App Store",
    "connect.store.github": "GitHub",
    "dash.connect": "Подключение",

    // Checkout
    "checkout.back": "К тарифам",
    "checkout.title": "Оплата подписки",
    "checkout.subtitle": "Вы будете перенаправлены на защищённую страницу оплаты.",
    "checkout.plan": "Тариф",
    "checkout.total": "К оплате",
    "checkout.error": "Не удалось обработать платёж",
    "checkout.processing": "Обработка…",
    "checkout.pay": "Оплатить",
    "checkout.terms": "Нажимая «Оплатить», вы соглашаетесь с условиями сервиса.",
  },
  en: {
    // Nav
    "nav.pricing": "Pricing",
    "nav.features": "Features",
    "nav.faq": "FAQ",
    "nav.signin": "Sign in",
    "nav.connect": "Get started",
    "nav.dashboard": "Dashboard",
    "nav.signout": "Sign out",

    // Auth
    "auth.title": "Sign in with email",
    "auth.subtitle": "Enter your email — we'll send you a login link",
    "auth.email": "Email",
    "auth.send": "Sign in",
    "auth.error.generic": "Request failed",
    "auth.sent": "Login link sent to your email. Check your inbox.",
    "auth.dev.link": "Click here to sign in",

    // Hero
    "hero.badge": "Next-gen VPN — zero config",
    "hero.h1.1": "Open internet",
    "hero.h1.2": "without limits",
    "hero.p": "One key for all devices. Simple setup. High speed. No extra configuration.",
    "hero.cta": "Get started",
    "hero.signin": "Sign in to dashboard",
    "hero.pill.devices": "Up to 5 devices",
    "hero.tagline": "Fast internet without limits",
    "hero.pill.traffic": "Unlimited traffic",
    "hero.pill.locations": "7 locations",
    "hero.pill.support": "24/7 support",
    "hero.pill.payment": "Card · crypto · bank",

    "why.title": "What you get",
    "why.1.title": "One key for everything",
    "why.1.a": "Phone, laptop, tablet, TV",
    "why.1.b": "Up to 5 devices at once",
    "why.1.c": "iOS, Android, Windows, macOS",
    "why.1.d": "Connect in under a minute",
    "why.2.title": "Speed & reliability",
    "why.2.a": "High connection speed",
    "why.2.b": "Unlimited traffic, no caps",
    "why.2.c": "7 server locations to choose from",
    "why.2.d": "Stable operation 24/7",
    "why.3.title": "Easy management",
    "why.3.a": "Dashboard with your VPN key",
    "why.3.b": "Manage devices online",
    "why.3.c": "Telegram subscription notifications",
    "why.3.d": "24/7 support",

    // Pricing
    "pricing.title": "Simple pricing",
    "pricing.subtitle": "Longer plans save more. No hidden fees, no auto-renewals.",
    "pricing.savings": "Save",
    "pricing.per_month": "/ month",
    "pricing.cta": "Subscribe",
    "plan.1": "1 month",
    "plan.3": "3 months",
    "plan.6": "6 months",
    "plan.12": "12 months",
    "plan.badge.deal": "Great deal",
    "plan.badge.popular": "Most popular",
    "plan.feat.devices": "Up to 5 devices",
    "plan.feat.traffic": "Unlimited traffic",
    "plan.feat.locations": "7 locations",
    "plan.feat.support": "24/7 support",

    // Advantages
    "feat.title": "Everything you need",
    "feat.subtitle": "Minimal setup, maximum benefit. Connect in one click and enjoy the internet without limits.",
    "feat.devices.title": "Up to 5 devices",
    "feat.devices.text": "One key — phone, laptop, tablet and TV at the same time.",
    "feat.speed.title": "High speed",
    "feat.speed.text": "Stable connection and fast access to services.",
    "feat.traffic.title": "Unlimited traffic",
    "feat.traffic.text": "No limits on volume or transfer speed.",
    "feat.support.title": "24/7 support",
    "feat.support.text": "We help you at any time of the day.",
    "feat.telegram.title": "Telegram notifications",
    "feat.telegram.text": "Subscription status and renewals — right in Telegram.",
    "feat.locations.title": "7 server locations",
    "feat.locations.text": "Flexible country selection for reliable performance.",

    // FAQ
    "faq.title": "FAQ",
    "faq.subtitle": "Short and to the point.",
    "faq.1.q": "How do I connect?",
    "faq.1.a": "After payment, a VPN key will appear in your dashboard. Copy it and paste it into the app — connecting takes less than a minute.",
    "faq.2.q": "How do I renew my subscription?",
    "faq.2.a": "In the Overview section, click Renew and choose a plan. The time will be added to your current subscription.",
    "faq.3.q": "How many devices are supported?",
    "faq.3.a": "Up to 5 devices simultaneously with one key. You can manage the list in the Devices section.",
    "faq.4.q": "How do I remove a device?",
    "faq.4.a": "In the Devices section, click Remove next to the device. Access is revoked immediately.",
    "faq.5.q": "What payment methods are available?",
    "faq.5.a": "Bank transfer (SBP), bank cards and cryptocurrency via the secure Platega platform.",

    // Trial banner
    "trial.title": "Try for free",
    "trial.subtitle": "Full access with no restrictions — for new users",
    "trial.cta": "Try free",

    // How to
    "howto.title": "How to use ClickVPN",
    "howto.1": "Subscribe and get your access key in the dashboard right after payment",
    "howto.2": "Install the app on your phone, laptop or any other device",
    "howto.3": "Enter the key — and enjoy fast VPN with no limits",

    // Support section
    "support.title": "Have questions?",
    "support.subtitle": "Write to us — we'll help from first setup to stable connection",
    "support.cta": "Contact support",
    "support.card.1": "Available 24/7 — we'll help anytime",
    "support.card.2": "Handle subscription and payment questions",
    "support.card.3": "Help configure VPN and choose a location",

    // CTA block
    "cta.title": "Ready to start right now?",
    "cta.subtitle": "Subscribe in a minute — the key will appear in your dashboard right after payment.",
    "cta.btn": "Get started",

    // Footer
    "footer.terms": "Terms",
    "footer.privacy": "Privacy",
    "footer.support": "Support",

    // Dashboard
    "dash.title": "Dashboard",
    "dash.overview": "Overview",
    "dash.devices": "Devices",
    "dash.payments": "Payments",
    "dash.settings": "Settings",
    "dash.subscription": "Subscription",
    "dash.subscription.none": "No active subscription",
    "dash.subscription.choose": "Choose a plan on the homepage",
    "dash.subscription.active": "Active until",
    "dash.subscription.expired": "Expired",
    "dash.subscription.pending": "Awaiting payment",
    "dash.key.title": "VPN key",
    "dash.key.none": "The key will appear after activation",
    "dash.key.copy": "Copy",
    "dash.key.copied": "Copied",
    "dash.key.error": "Failed to copy key",
    "dash.renew": "Renew",
    "dash.subscribe": "Subscribe",

    // Devices
    "devices.title": "Your devices",
    "devices.subtitle": "Up to 5 devices simultaneously with one key.",
    "devices.empty": "No devices yet.",
    "devices.added": "added",
    "devices.remove": "Remove",
    "devices.error": "Something went wrong — please reload the page",
    "devices.reload": "Reload",

    // Payments
    "payments.title": "Payment history",
    "payments.empty": "No payments yet.",

    // Settings
    "settings.title": "Account settings",
    "settings.email.hint": "Used for email-based sign in.",
    "settings.telegram.hint": "Link your username to receive subscription and renewal notifications.",
    "settings.telegram.hint2": "Click «Link» to get the Telegram linking link.",
    "settings.telegram.hint3": "If the link doesn't open — use Telegram and open the deeplink manually.",
    "settings.telegram.open": "Open in Telegram",
    "settings.telegram.saved": "Saved",
    "settings.telegram.link": "Link",
    "settings.language": "Interface language",

    // Connect (dashboard)
    "connect.title": "How to connect",
    "connect.subtitle": "Scan the QR code or paste the key into your app",
    "connect.no_sub": "No active subscription — subscribe to get your key.",
    "connect.qr.title": "QR code",
    "connect.qr.hint": "Scan in the app",
    "connect.key.title": "Subscription key",
    "connect.key.copy": "Copy",
    "connect.key.copied": "Copied",
    "connect.steps.title": "Instructions",
    "connect.step.ios": "iOS — download Streisand or V2Box from App Store, tap «+» and scan the QR",
    "connect.step.android": "Android — download V2RayNG or Hiddify from Google Play, tap «+» and paste the key",
    "connect.step.windows": "Windows — download Hiddify or V2RayN, click «+» and paste the subscription key",
    "connect.step.macos": "macOS — download Streisand or V2Box from App Store, tap «+» and paste the key",
    "connect.via": "— connect via",
    "connect.install": "Install",
    "connect.install.from": "from",
    "connect.copy_link": "Copy the subscription link:",
    "connect.link_pending": "Link will appear after subscription activation",
    "connect.step3": "Open the app → tap «+» in the top right → select «Add from clipboard».",
    "connect.step4": "Tap «Connect».",
    "connect.copy": "Copy",
    "connect.copied": "Copied",
    "connect.copy_key": "Copy key",
    "connect.qr_hint": "QR code for scanning in the app",
    "connect.store.developer": "developer website",
    "connect.store.google": "Google Play",
    "connect.store.appstore": "App Store",
    "connect.store.github": "GitHub",
    "dash.connect": "Connect",

    // Checkout
    "checkout.back": "Back to plans",
    "checkout.title": "Subscription payment",
    "checkout.subtitle": "You'll be redirected to a secure payment page.",
    "checkout.plan": "Plan",
    "checkout.total": "Total",
    "checkout.error": "Failed to process payment",
    "checkout.processing": "Processing…",
    "checkout.pay": "Pay",
    "checkout.terms": "By clicking «Pay», you agree to the terms of service.",
  },
} as const;

export type TKey = keyof (typeof dict)["ru"];

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (k: TKey) => string };
const I18nCtx = createContext<Ctx>({ locale: "ru", setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("locale", l);
  };

  const t = (k: TKey) => dict[locale][k] ?? k;
  return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
