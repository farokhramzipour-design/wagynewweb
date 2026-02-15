"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

export function AppShellApp({ children, locale }: { children: React.ReactNode; locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = getSession();
  const providerApproved = session?.provider_status === "approved";

  const ownerLinks = useMemo(
    () => [
      { href: `/${locale}/owner`, label: "داشبورد" },
      { href: `/${locale}/owner/profile`, label: "پروفایل" },
      { href: `/${locale}/owner/pets`, label: "حیوانات" },
      { href: `/${locale}/owner/bookings`, label: "رزروها" },
      { href: `/${locale}/owner/messages`, label: "پیام‌ها" },
      { href: `/${locale}/owner/favorites`, label: "علاقه‌مندی" },
      { href: `/${locale}/owner/wallet`, label: "کیف‌پول" },
      { href: `/${locale}/owner/charity`, label: "خیریه" }
    ],
    [locale]
  );

  const sitterLinks = useMemo(
    () => [
      { href: `/${locale}/sitter`, label: "داشبورد سیتر" },
      { href: `/${locale}/sitter/services`, label: "خدمات" },
      { href: `/${locale}/sitter/availability`, label: "دسترسی" },
      { href: `/${locale}/sitter/bookings`, label: "رزروها" },
      { href: `/${locale}/sitter/messages`, label: "پیام‌ها" },
      { href: `/${locale}/sitter/reviews`, label: "نظرات" },
      { href: `/${locale}/sitter/payouts`, label: "پرداخت‌ها" }
    ],
    [locale]
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="text-lg font-semibold">Wagy</div>
          <div className="flex items-center gap-2">
            {providerApproved ? (
              <Button variant="secondary" onClick={() => router.push(`/${locale}/sitter` as any)}>
                Sitter Mode
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}>
                Become a Sitter
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container-page grid gap-6 py-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-3">
            <div className="text-xs text-subtle">Owner</div>
            <nav className="mt-2 flex flex-col gap-2 text-sm">
              {ownerLinks.map((link) => (
                <Link key={link.href} className={pathname === link.href ? "text-brand-700" : ""} href={link.href as any}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          {providerApproved && (
            <div className="rounded-xl border border-border bg-white p-3">
              <div className="text-xs text-subtle">Sitter</div>
              <nav className="mt-2 flex flex-col gap-2 text-sm">
                {sitterLinks.map((link) => (
                  <Link key={link.href} className={pathname === link.href ? "text-brand-700" : ""} href={link.href as any}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
