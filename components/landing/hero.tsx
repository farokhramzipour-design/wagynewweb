"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Star } from "lucide-react";
import { FadeIn, FloatBlob } from "@/components/motion";

export function Hero() {
  const locale = useLocale();
  const trust = [
    { label: locale === "fa" ? "احراز هویت" : "Verified", icon: BadgeCheck },
    { label: locale === "fa" ? "پرداخت امن" : "Secure pay", icon: ShieldCheck },
    { label: locale === "fa" ? "امتیاز واقعی" : "Real ratings", icon: Star }
  ];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_60%),radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.12),transparent_55%)]">
      <FloatBlob className="pointer-events-none absolute -top-24 end-[-10%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(250,117,91,0.35),transparent_70%)]" />
      <FloatBlob className="pointer-events-none absolute bottom-[-20%] start-[-5%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_70%)]" duration={14} />
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <FadeIn className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs text-subtle shadow-soft backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {locale === "fa" ? "شبکه پرستاران تاییدشده" : "Verified sitter network"}
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {locale === "fa"
              ? "مراقبت حرفه‌ای و مهربان — برای دوست کوچولوی شما"
              : "Professional, kind care for your little buddy"}
          </h1>
          <p className="text-lg text-subtle">
            {locale === "fa"
              ? "پرستاران تاییدشده، رزرو سریع، پرداخت امن. با خیال راحت انتخاب کن."
              : "Verified sitters, fast booking, secure payment. Choose with confidence."}
          </p>
          <div className="flex flex-wrap gap-3">
            {trust.map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm text-subtle shadow-soft backdrop-blur">
                <item.icon className="h-4 w-4 text-indigo-500" />
                {item.label}
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="relative">
          <motion.div
            className="relative h-full min-h-[280px] rounded-[32px] border border-white/40 bg-white/50 p-6 shadow-soft backdrop-blur"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute end-6 top-6 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/60 via-fuchsia-400/50 to-transparent" />
            <div className="absolute bottom-6 start-6 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-300/70 to-transparent" />
            <div className="absolute bottom-10 end-12 text-indigo-500 opacity-80">
              <svg viewBox="0 0 120 120" className="h-28 w-28" fill="none">
                <path d="M20 60c20-28 60-28 80 0" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <circle cx="40" cy="45" r="6" fill="currentColor" />
                <circle cx="80" cy="45" r="6" fill="currentColor" />
                <circle cx="60" cy="75" r="10" stroke="currentColor" strokeWidth="6" />
              </svg>
            </div>
            <div className="relative z-10 flex h-full items-center justify-center text-center text-sm text-subtle">
              {locale === "fa" ? "اینجا تصویر بامزه اما مینیمال از دوست کوچولو" : "Playful abstract pet motif"}
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
