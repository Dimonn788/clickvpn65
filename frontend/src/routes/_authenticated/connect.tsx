import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Copy, Check, ExternalLink, Smartphone, Apple, Monitor, Terminal, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { getLatestSubscriptionForUser } from "@/lib/api/auth.functions";
import { useI18n } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/connect")({
  head: () => ({
    meta: [
      { title: "Как подключиться — ClickVPN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConnectPage,
});

type Platform = {
  icon: LucideIcon;
  name: string;
  app: string;
  storeKey: TKey;
  storeUrl: string;
};

const PLATFORMS: Platform[] = [
  { icon: Smartphone, name: "Android", app: "Happ", storeKey: "connect.store.google", storeUrl: "https://play.google.com/store/apps/details?id=com.happproxy&hl=ru" },
  { icon: Apple, name: "iPhone", app: "Happ", storeKey: "connect.store.appstore", storeUrl: "https://apps.apple.com/app/happ-proxy-utility/id6504287215" },
  { icon: Monitor, name: "Windows", app: "Happ / Hiddify", storeKey: "connect.store.developer", storeUrl: "https://hiddify.com/download" },
  { icon: Terminal, name: "Linux", app: "Hiddify", storeKey: "connect.store.github", storeUrl: "https://github.com/hiddify/hiddify-app/releases/latest" },
];

function useCopy(text: string | null, successMsg: string) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast.success(successMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return { copied, copy };
}

function PlatformCard({ platform, vpnKey }: { platform: Platform; vpnKey: string | null }) {
  const { t } = useI18n();
  const { copied, copy } = useCopy(vpnKey, t("connect.copied"));

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <platform.icon className="size-4 shrink-0" />
        {platform.name} {t("connect.via")} {platform.app}
      </h2>

      <ol className="space-y-4">
        <li className="flex gap-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5">1</span>
          <span className="text-sm text-muted-foreground">
            {t("connect.install")} <strong className="text-foreground">{platform.app}</strong> {t("connect.install.from")}{" "}
            <a
              href={platform.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-foreground underline underline-offset-2 hover:text-primary transition"
            >
              {t(platform.storeKey)} <ExternalLink className="size-3" />
            </a>
          </span>
        </li>

        <li className="flex gap-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5">2</span>
          <div className="flex-1 space-y-2 text-sm text-muted-foreground">
            <span>{t("connect.copy_link")}</span>
            {vpnKey ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3 py-2">
                <code className="flex items-center gap-1.5 flex-1 truncate font-mono text-xs text-foreground/70"><LinkIcon className="size-3 shrink-0" />{vpnKey}</code>
                <button
                  onClick={copy}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-muted-foreground transition hover:text-foreground"
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copied ? t("connect.copied") : t("connect.copy")}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs text-muted-foreground/60 italic">
                {t("connect.link_pending")}
              </div>
            )}
          </div>
        </li>

        <li className="flex gap-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5">3</span>
          <span className="text-sm text-muted-foreground">{t("connect.step3")}</span>
        </li>

        <li className="flex gap-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5">4</span>
          <span className="text-sm text-muted-foreground">{t("connect.step4")}</span>
        </li>
      </ol>
    </div>
  );
}

function ConnectPage() {
  const { t } = useI18n();
  const [vpnKey, setVpnKey] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { copied: qrCopied, copy: copyKey } = useCopy(vpnKey, t("connect.copied"));

  useEffect(() => {
    getLatestSubscriptionForUser().then(({ subscription }) => {
      if (subscription?.status === "active" && subscription.vpn_key) {
        setVpnKey(subscription.vpn_key);
      }
      setLoaded(true);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("dash.connect")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{t("connect.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("connect.subtitle")}</p>
      </div>

      {loaded && !vpnKey && (
        <div className="glass rounded-2xl p-5 text-sm text-muted-foreground">
          {t("connect.no_sub")}{" "}
          <Link to="/checkout" search={{ plan: 6 }} className="text-foreground underline underline-offset-2">
            {t("dash.subscribe")}
          </Link>
        </div>
      )}

      {vpnKey && (
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="rounded-xl bg-white p-2.5 shrink-0">
            <QRCode value={vpnKey} size={120} />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <p className="text-xs text-muted-foreground">{t("connect.qr_hint")}</p>
            <code className="block break-all rounded-xl border border-white/10 bg-background/40 px-3 py-2 font-mono text-[11px] text-muted-foreground max-h-24 overflow-auto">
              {vpnKey}
            </code>
            <button
              onClick={copyKey}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              {qrCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {qrCopied ? t("connect.copied") : t("connect.copy_key")}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {PLATFORMS.map((p) => (
          <PlatformCard key={p.name} platform={p} vpnKey={vpnKey} />
        ))}
      </div>
    </div>
  );
}
