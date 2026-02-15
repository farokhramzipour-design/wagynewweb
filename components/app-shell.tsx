"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const nextLocale = locale === "fa" ? "en" : "fa";
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "fa" || segments[0] === "en") {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    router.push(("/" + segments.join("/")) as any);
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="text-xl font-semibold">Wagy</div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={switchLocale}>
              {locale === "fa" ? "EN" : "FA"}
            </Button>
            <Button variant="secondary" onClick={() => router.push((`/${locale}/auth`) as any)}>
              {locale === "fa" ? "ورود" : "Sign in"}
            </Button>
          </div>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
