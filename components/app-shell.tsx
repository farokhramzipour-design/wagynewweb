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
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold">Wagy</div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-subtle">
              <Link href={`/${locale}/search`}>{t("nav.search")}</Link>
              <Link href={`/${locale}/bookings`}>{t("nav.bookings")}</Link>
              <Link href={`/${locale}/messages`}>{t("nav.messages")}</Link>
              <Link href={`/${locale}/wallet`}>{t("nav.wallet")}</Link>
              <Link href={`/${locale}/favorites`}>{t("nav.favorites")}</Link>
              <Link href={`/${locale}/pets`}>{locale === "fa" ? "حیوانات" : "Pets"}</Link>
              <Link href={`/${locale}/account`}>{locale === "fa" ? "حساب کاربری" : "Account"}</Link>
              <Link href={`/${locale}/reviews`}>{locale === "fa" ? "نظرات" : "Reviews"}</Link>
              <Link href={`/${locale}/charity`}>{t("nav.charity")}</Link>
              <Link href={`/${locale}/provider/profile`}>{locale === "fa" ? "پروفایل ارائه‌دهنده" : "Provider profile"}</Link>
              <Link href={`/${locale}/provider/services`}>{locale === "fa" ? "خدمات" : "Services"}</Link>
              <Link href={`/${locale}/provider/pricing`}>{locale === "fa" ? "قیمت‌گذاری" : "Pricing"}</Link>
              <Link href={`/${locale}/provider/availability`}>{locale === "fa" ? "دسترسی" : "Availability"}</Link>
              <Link href={`/${locale}/provider/bookings`}>{locale === "fa" ? "رزروها" : "Bookings"}</Link>
              <Link href={`/${locale}/provider/calendar`}>{locale === "fa" ? "تقویم" : "Calendar"}</Link>
              <Link href={`/${locale}/provider/summary`}>{locale === "fa" ? "خلاصه" : "Summary"}</Link>
              <Link href={`/${locale}/provider/earnings`}>{locale === "fa" ? "درآمد" : "Earnings"}</Link>
              <Link href={`/${locale}/admin/review`}>{locale === "fa" ? "ادمین" : "Admin"}</Link>
              <Link href={`/${locale}/admin/flows`}>{locale === "fa" ? "فلوها" : "Flows"}</Link>
              <Link href={`/${locale}/admin/moderation`}>{locale === "fa" ? "اعتدال" : "Moderation"}</Link>
              <Link href={`/${locale}/admin/charity`}>{locale === "fa" ? "خیریه" : "Charity"}</Link>
              <Link href={`/${locale}/admin/ledger`}>{locale === "fa" ? "دفتر مالی" : "Ledger"}</Link>
              <Link href={`/${locale}/admin/disputes`}>{locale === "fa" ? "اختلافات" : "Disputes"}</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={switchLocale}>
              {locale === "fa" ? "EN" : "FA"}
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/${locale}/login`)}>
              {locale === "fa" ? "ورود" : "Sign in"}
            </Button>
          </div>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
