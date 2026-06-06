import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Mail, Loader2, Check, Languages } from "lucide-react";
import { updateTelegram } from "@/lib/api/auth.functions";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

const LANGS = [
  { value: "ru" as const, label: "Русский" },
  { value: "en" as const, label: "English" },
];

function LangTabs({ locale, setLocale }: { locale: "ru" | "en"; setLocale: (l: "ru" | "en") => void }) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 4, width: 0 });

  useEffect(() => {
    const idx = LANGS.findIndex(l => l.value === locale);
    const btn = btnRefs.current[idx];
    if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [locale]);

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
      {LANGS.map((lang, i) => (
        <button
          key={lang.value}
          ref={el => { btnRefs.current[i] = el; }}
          onClick={() => setLocale(lang.value)}
          className={[
            "relative z-10 rounded-xl px-5 py-2 text-sm font-semibold transition-colors duration-200",
            locale === lang.value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deeplink, setDeeplink] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const resp = await updateTelegram();
      setDeeplink(resp.deeplink_url || resp.deeplink || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("dash.settings")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t("settings.title")}</h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="size-4" />
          Email
        </div>
        <p className="mt-2 font-medium">{user?.email ?? "—"}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("settings.email.hint")}</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Languages className="size-4" />
          {t("settings.language")}
        </div>
        <div className="mt-3">
          <LangTabs locale={locale} setLocale={setLocale} />
        </div>
      </div>

      <form onSubmit={save} className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Send className="size-4" />
          Telegram
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("settings.telegram.hint")}
        </p>
        <div className="mt-4 flex gap-2">
          <div className="flex-1">
            {deeplink ? (
              <div className="space-y-2">
                <a href={deeplink} target="_blank" rel="noreferrer" className="block truncate text-sm text-primary underline">
                  {t("settings.telegram.open")}
                </a>
                <p className="text-xs text-muted-foreground">{t("settings.telegram.hint3")}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("settings.telegram.hint2")}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : saved ? <Check className="size-3.5" /> : null}
            {saved ? t("settings.telegram.saved") : t("settings.telegram.link")}
          </button>
        </div>
      </form>
    </div>
  );
}
