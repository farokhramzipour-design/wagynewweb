"use client";

import { useLocale } from "next-intl";
import { Stagger, StaggerItem } from "@/components/motion";

export function HowItWorks() {
  const locale = useLocale();
  const steps = [
    { title: locale === "fa" ? "جستجو" : "Search", desc: locale === "fa" ? "سرویس مناسب رو پیدا کن." : "Find the right service." },
    { title: locale === "fa" ? "رزرو" : "Request", desc: locale === "fa" ? "جزئیات رو تایید کن." : "Confirm details." },
    { title: locale === "fa" ? "آرامش" : "Relax", desc: locale === "fa" ? "خیالت راحت باشه." : "Enjoy peace of mind." }
  ];

  return (
    <section id="how" className="container-page py-12">
      <h2 className="text-2xl font-semibold">{locale === "fa" ? "نحوه کار" : "How it works"}</h2>
      <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((item, index) => (
          <StaggerItem key={item.title}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
              <div className="text-sm text-subtle">{locale === "fa" ? `${index + 1} از ۳` : `Step ${index + 1}`}</div>
              <div className="mt-2 text-lg font-semibold">{item.title}</div>
              <div className="mt-2 text-sm text-subtle">{item.desc}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
