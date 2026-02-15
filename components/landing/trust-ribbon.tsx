"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useReducedMotion } from "framer-motion";

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) return;
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      start = Math.floor(value * progress);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  return (
    <span>
      {new Intl.NumberFormat("fa-IR").format(count)}{suffix ?? ""}
    </span>
  );
}

export function TrustRibbon() {
  const locale = useLocale();
  const stats = [
    { label: locale === "fa" ? "رزرو موفق" : "Successful bookings", value: 3400, suffix: "+" },
    { label: locale === "fa" ? "امتیاز میانگین" : "Avg rating", value: 49, suffix: "" },
    { label: locale === "fa" ? "پرستار فعال" : "Active sitters", value: 780, suffix: "+" },
    { label: locale === "fa" ? "پشتیبانی" : "Support", value: 24, suffix: "/7" }
  ];

  return (
    <section className="bg-white py-6">
      <div className="container-page">
        <FadeIn>
          <Stagger className="grid gap-4 text-sm text-subtle md:grid-cols-4">
            {stats.map((item) => (
              <StaggerItem key={item.label}>
                <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-center">
                  <div className="text-lg font-semibold text-ink">
                    <CountUp value={item.value} suffix={item.suffix} />
                  </div>
                  <div>{item.label}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>
      </div>
    </section>
  );
}
