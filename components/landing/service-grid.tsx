"use client";

import { useLocale } from "next-intl";
import { HeartHandshake, Home, Scissors, Shield, Sparkles, Tent, Walk, Zap } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion";

const services = (locale: string) => [
  { id: "boarding", title: locale === "fa" ? "پانسیون" : "Boarding", desc: locale === "fa" ? "شبانه و امن" : "Overnight care", icon: Home },
  { id: "house", title: locale === "fa" ? "نگهداری در منزل" : "House Sitting", desc: locale === "fa" ? "در خانه شما" : "At your home", icon: Tent },
  { id: "dropin", title: locale === "fa" ? "ویزیت" : "Drop-In", desc: locale === "fa" ? "بازدید سریع" : "Quick visits", icon: Zap },
  { id: "walk", title: locale === "fa" ? "پیاده‌روی" : "Dog Walking", desc: locale === "fa" ? "روزانه و نشاط" : "Daily walks", icon: Walk },
  { id: "daycare", title: locale === "fa" ? "مهد روزانه" : "Day Care", desc: locale === "fa" ? "بازی و تعامل" : "Play & socialize", icon: HeartHandshake },
  { id: "grooming", title: locale === "fa" ? "آرایش" : "Grooming", desc: locale === "fa" ? "تمیز و مرتب" : "Clean & tidy", icon: Scissors },
  { id: "training", title: locale === "fa" ? "آموزش" : "Training", desc: locale === "fa" ? "رفتار حرفه‌ای" : "Expert training", icon: Shield }
];

export function ServiceGrid({ onSelect }: { onSelect: (serviceId: string) => void }) {
  const locale = useLocale();
  const items = services(locale);

  return (
    <section id="services" className="container-page py-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{locale === "fa" ? "خدمات محبوب" : "Popular services"}</h2>
      </div>
      <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <button
              className="group w-full rounded-2xl border border-border bg-white p-5 text-start transition duration-200 hover:-translate-y-1 hover:shadow-soft"
              onClick={() => onSelect(item.id)}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 via-fuchsia-400/20 to-amber-300/20 text-indigo-600">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-sm text-subtle">{item.desc}</div>
              <div className="mt-2 text-lg font-semibold">{item.title}</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600">
                <Sparkles className="h-4 w-4" />
                {locale === "fa" ? "انتخاب کن" : "Pick"}
              </div>
            </button>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
