"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { AvatarMenu } from "@/components/avatar-menu";
import { Hero } from "@/components/landing/hero";
import { SearchCard } from "@/components/landing/search-card";
import { TrustRibbon } from "@/components/landing/trust-ribbon";
import { ServiceGrid } from "@/components/landing/service-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Safety } from "@/components/landing/safety";
import { Testimonials } from "@/components/landing/testimonials";
import { SitterCTA } from "@/components/landing/sitter-cta";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  const locale = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [session, setSessionState] = useState(() => getSession());
  const [selectedService, setSelectedService] = useState<string | undefined>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleStorage = () => setSessionState(getSession());
    handleStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    document.getElementById("search")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-[#f7f6fb] text-ink">
      <motion.header
        className={`sticky top-0 z-30 transition ${scrolled ? "bg-white/90 shadow-soft backdrop-blur" : "bg-transparent"}`}
        initial={false}
        animate={scrolled ? { boxShadow: "0 12px 32px rgba(15,23,42,0.08)" } : { boxShadow: "0 0 0 rgba(0,0,0,0)" }}
      >
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-400 text-white">
              <span className="text-sm font-bold">W</span>
            </div>
            <div>
              <div className="text-lg font-semibold">Wagy</div>
              <div className="text-xs text-subtle">{locale === "fa" ? "دوست امن حیوانات" : "Trusted pet care"}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-4 text-sm text-subtle lg:flex">
            <Link href={`/${locale}#services` as any} className="hover:text-ink">{locale === "fa" ? "خدمات" : "Services"}</Link>
            <Link href={`/${locale}#how` as any} className="hover:text-ink">{locale === "fa" ? "نحوه کار" : "How"}</Link>
            <Link href={`/${locale}#safety` as any} className="hover:text-ink">{locale === "fa" ? "ایمنی" : "Safety"}</Link>
            <Link href={`/${locale}#testimonials` as any} className="hover:text-ink">{locale === "fa" ? "نظرات" : "Testimonials"}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="hidden rounded-2xl lg:inline-flex"
              onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}
            >
              {locale === "fa" ? "پرستار شوید" : "Become a Sitter"}
            </Button>
            {session?.user_id ? (
              <AvatarMenu />
            ) : (
              <Button variant="ghost" onClick={() => router.push(`/${locale}/auth` as any)}>
                {locale === "fa" ? "ورود / ثبت‌نام" : "Login / Signup"}
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <main>
        <Hero />
        <SearchCard selectedServiceId={selectedService} />
        <TrustRibbon />
        <ServiceGrid onSelect={handleSelectService} />
        <HowItWorks />
        <Safety />
        <Testimonials />
        <SitterCTA />
        <LandingFooter />
      </main>
    </div>
  );
}
