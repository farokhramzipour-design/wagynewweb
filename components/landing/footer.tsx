"use client";

import { useLocale } from "next-intl";

export function LandingFooter() {
  const locale = useLocale();

  return (
    <footer className="mt-10 bg-[#f2f4f9] py-10 text-sm text-subtle">
      <div className="container-page grid gap-6 md:grid-cols-5">
        <div>
          <div className="font-semibold text-ink">{locale === "fa" ? "خدمات" : "Services"}</div>
          <div>{locale === "fa" ? "پانسیون" : "Boarding"}</div>
          <div>{locale === "fa" ? "پیاده‌روی" : "Dog Walking"}</div>
        </div>
        <div>
          <div className="font-semibold text-ink">{locale === "fa" ? "نحوه کار" : "How it works"}</div>
          <div>{locale === "fa" ? "رزرو" : "Booking"}</div>
          <div>{locale === "fa" ? "پرداخت" : "Payments"}</div>
        </div>
        <div>
          <div className="font-semibold text-ink">{locale === "fa" ? "ایمنی" : "Safety"}</div>
          <div>{locale === "fa" ? "احراز هویت" : "Verification"}</div>
          <div>{locale === "fa" ? "امتیازها" : "Ratings"}</div>
        </div>
        <div>
          <div className="font-semibold text-ink">{locale === "fa" ? "پشتیبانی" : "Support"}</div>
          <div>{locale === "fa" ? "راهنما" : "Help"}</div>
          <div>{locale === "fa" ? "تماس" : "Contact"}</div>
        </div>
        <div className="text-xs text-subtle md:text-sm">
          {locale === "fa"
            ? "تمام پرداخت‌ها از طریق درگاه امن انجام می‌شود."
            : "All payments are processed through secure gateways."}
        </div>
      </div>
    </footer>
  );
}
