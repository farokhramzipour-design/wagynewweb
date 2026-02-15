"use client";

import { useLocale } from "next-intl";
import { Stagger, StaggerItem } from "@/components/motion";

export function Testimonials() {
  const locale = useLocale();
  const items = [
    {
      name: locale === "fa" ? "الهام" : "Elham",
      city: locale === "fa" ? "تهران" : "Tehran",
      rating: "4.9",
      quote:
        locale === "fa"
          ? "هر روز گزارش گرفتم و خیالم راحت بود."
          : "Daily updates kept me relaxed throughout the stay."
    },
    {
      name: locale === "fa" ? "آرمان" : "Arman",
      city: locale === "fa" ? "اصفهان" : "Isfahan",
      rating: "5.0",
      quote:
        locale === "fa"
          ? "رزرو سریع و همه‌چیز شفاف."
          : "Quick booking and everything was transparent."
    },
    {
      name: locale === "fa" ? "نورا" : "Nora",
      city: locale === "fa" ? "شیراز" : "Shiraz",
      rating: "4.8",
      quote:
        locale === "fa"
          ? "پرستار بسیار مهربان بود و ارتباط عالی داشت."
          : "The sitter was kind and communication was excellent."
    }
  ];

  return (
    <section id="testimonials" className="container-page py-12">
      <h2 className="text-2xl font-semibold">{locale === "fa" ? "نظر کاربران" : "Testimonials"}</h2>
      <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <StaggerItem key={item.name}>
            <div className="rounded-2xl bg-gradient-to-b from-amber-50/60 to-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                    {item.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-subtle">{item.city}</div>
                  </div>
                </div>
                <div className="text-sm text-amber-600">★ {item.rating}</div>
              </div>
              <div className="mt-4 text-sm text-subtle">{item.quote}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
