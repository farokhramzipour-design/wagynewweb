"use client";

import { useLocale } from "next-intl";
import { BadgeCheck, ShieldCheck, Star, Headset } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion";

export function Safety() {
  const locale = useLocale();
  const items = [
    { title: locale === "fa" ? "احراز هویت چندمرحله‌ای" : "Multi-step verification", icon: BadgeCheck },
    { title: locale === "fa" ? "پرداخت امن بانکی" : "Secure bank payments", icon: ShieldCheck },
    { title: locale === "fa" ? "سیستم امتیازدهی واقعی" : "Real rating system", icon: Star },
    { title: locale === "fa" ? "پشتیبانی سریع" : "Fast support", icon: Headset }
  ];

  return (
    <section id="safety" className="container-page py-12">
      <h2 className="text-2xl font-semibold">{locale === "fa" ? "ایمنی و اعتماد" : "Safety & trust"}</h2>
      <Stagger className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <StaggerItem key={item.title}>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft">
              <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-subtle">
                  {locale === "fa" ? "فرایند شفاف و قابل پیگیری" : "Transparent and trackable process"}
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
