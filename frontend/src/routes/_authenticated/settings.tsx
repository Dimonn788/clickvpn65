import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setLocale("ru")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${locale === "ru" ? "btn-primary" : "glass text-muted-foreground hover:text-foreground"}`}
          >
            Русский
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${locale === "en" ? "btn-primary" : "glass text-muted-foreground hover:text-foreground"}`}
          >
            English
          </button>
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
