"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { geo } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { JalaliDateInput } from "@/components/jalali-date-input";
import { AvatarMenu } from "@/components/avatar-menu";

const searchSchema = z.object({
  service_type_id: z.string().min(1),
  province_id: z.string().optional(),
  city_id: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  pets_count: z.string().min(1)
});

type SearchFormValues = z.infer<typeof searchSchema>;

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const icons = {
  search: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L17 17" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l7 3v6c0 4.2-2.5 7.9-7 9-4.5-1.1-7-4.8-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20s-7-4.5-7-9a4 4 0 017-3 4 4 0 017 3c0 4.5-7 9-7 9z" />
    </svg>
  )
};

export default function LandingPage() {
  const locale = useLocale();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [session, setSessionState] = useState(() => getSession());

  const serviceTypes = useQuery({ queryKey: ["geo", "service-types"], queryFn: geo.serviceTypes });
  const provinces = useQuery({ queryKey: ["geo", "provinces"], queryFn: () => geo.provinces("IR") });

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      service_type_id: "",
      province_id: "",
      city_id: "",
      start_date: "",
      end_date: "",
      pets_count: "1"
    }
  });

  const provinceId = form.watch("province_id");
  const cities = useQuery({
    queryKey: ["geo", "cities", provinceId],
    queryFn: () => geo.cities(provinceId ? Number(provinceId) : null),
    enabled: Boolean(provinceId)
  });

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

  const trustItems = useMemo(
    () => [
      locale === "fa" ? "✓ پرستاران تایید شده" : "✓ Verified sitters",
      locale === "fa" ? "✓ پرداخت امن" : "✓ Secure payments",
      locale === "fa" ? "✓ پشتیبانی ۲۴/۷" : "✓ 24/7 support"
    ],
    [locale]
  );

  const testimonials = useMemo<Testimonial[]>(
    () => [
      {
        name: locale === "fa" ? "الهام" : "Elham",
        role: locale === "fa" ? "مالک گربه" : "Cat owner",
        quote:
          locale === "fa"
            ? "برای اولین بار آرامش واقعی داشتم. گزارش‌های دقیق پرستار عالی بود."
            : "For the first time, I felt truly relaxed. The sitter updates were excellent."
      },
      {
        name: locale === "fa" ? "آرمان" : "Arman",
        role: locale === "fa" ? "مالک سگ" : "Dog owner",
        quote:
          locale === "fa"
            ? "رزرو سریع بود و همه چیز شفاف. تجربه‌ای بی‌دردسر."
            : "Booking was fast and everything was transparent. A seamless experience."
      },
      {
        name: locale === "fa" ? "نورا" : "Nora",
        role: locale === "fa" ? "پرستار تایید شده" : "Verified sitter",
        quote:
          locale === "fa"
            ? "فرآیند تایید حرفه‌ای بود و اعتماد ایجاد کرد."
            : "The verification flow was professional and built real trust."
      }
    ],
    [locale]
  );

  const onSubmit = form.handleSubmit((values) => {
    const params = new URLSearchParams();
    params.set("service_type_id", values.service_type_id);
    if (values.province_id) params.set("province_id", values.province_id);
    if (values.city_id) params.set("city_id", values.city_id);
    if (values.start_date) params.set("start_date", values.start_date);
    if (values.end_date) params.set("end_date", values.end_date);
    if (values.pets_count) params.set("pets_count", values.pets_count);
    router.push(`/${locale}/search?${params.toString()}` as any);
  });

  return (
    <div className="min-h-screen bg-[#f6f7f5] text-ink">
      <header className={`sticky top-0 z-30 transition ${scrolled ? "bg-white/95 shadow-soft" : "bg-transparent"}`}>
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-brand-600" />
            <span className="text-lg font-semibold">Wagy</span>
          </div>
          <div className="flex items-center gap-3">
            {session?.user_id ? (
              <AvatarMenu />
            ) : (
              <Button variant="ghost" onClick={() => router.push(`/${locale}/auth` as any)}>
                {locale === "fa" ? "ورود / ثبت‌نام" : "Login / Signup"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f6f7f5] via-[#f2f4f2] to-white">
          <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs text-subtle">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                {locale === "fa" ? "شبکه پرستاران تایید شده" : "Verified sitter network"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {locale === "fa" ? "مراقبت مطمئن برای حیوانات خانگی شما" : "Trusted care for your pets, on your terms"}
              </h1>
              <p className="text-lg text-subtle">
                {locale === "fa"
                  ? "بهترین پرستاران حیوانات را در شهر خود پیدا کنید و با خیال راحت رزرو کنید."
                  : "Find the best pet sitters in your city and book with complete confidence."}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-subtle">
                {trustItems.map((item) => (
                  <div key={item} className="rounded-full border border-border bg-white px-3 py-1">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-none bg-white/90 shadow-soft backdrop-blur">
              <CardHeader className="pb-2 text-base font-semibold">
                {locale === "fa" ? "جستجوی سریع" : "Quick search"}
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">{locale === "fa" ? "نوع خدمت" : "Service type"}</label>
                    <select className="h-11 rounded-2xl border border-border bg-white px-3 text-sm" {...form.register("service_type_id")}>
                      <option value="">{locale === "fa" ? "انتخاب کنید" : "Select"}</option>
                      {serviceTypes.data?.map((service) => (
                        <option key={service.service_type_id} value={service.service_type_id}>
                          {service.code}
                        </option>
                      ))}
                    </select>
                    <FormError message={form.formState.errors.service_type_id?.message as string | undefined} />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">{locale === "fa" ? "استان" : "Province"}</label>
                      <select className="mt-2 h-11 w-full rounded-2xl border border-border bg-white px-3 text-sm" {...form.register("province_id")}>
                        <option value="">{locale === "fa" ? "همه" : "All"}</option>
                        {provinces.data?.map((p: any) => (
                          <option key={p.province_id} value={p.province_id}>
                            {p.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{locale === "fa" ? "شهر" : "City"}</label>
                      <select className="mt-2 h-11 w-full rounded-2xl border border-border bg-white px-3 text-sm" {...form.register("city_id")}>
                        <option value="">{locale === "fa" ? "همه" : "All"}</option>
                        {cities.data?.map((c: any) => (
                          <option key={c.city_id} value={c.city_id}>
                            {c.name_fa}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <JalaliDateInput
                      label={locale === "fa" ? "شروع" : "Start date"}
                      locale={locale as "fa" | "en"}
                      {...form.register("start_date")}
                    />
                    <JalaliDateInput
                      label={locale === "fa" ? "پایان" : "End date"}
                      locale={locale as "fa" | "en"}
                      {...form.register("end_date")}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{locale === "fa" ? "تعداد حیوان" : "Pets count"}</label>
                    <Input type="number" min={1} {...form.register("pets_count")} />
                    <FormError message={form.formState.errors.pets_count?.message as string | undefined} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="w-full" type="submit">
                      {locale === "fa" ? "جستجو" : "Search"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}
                    >
                      {locale === "fa" ? "پرستار شوید" : "Become a Sitter"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white py-6">
          <div className="container-page flex flex-wrap items-center justify-between gap-4">
            <div className="text-lg font-semibold">
              {locale === "fa" ? "عاشق حیوانات هستید؟ پرستار شوید و درآمد کسب کنید." : "Love pets? Become a sitter and earn."}
            </div>
            <Button variant="secondary" onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}>
              {locale === "fa" ? "پرستار شوید" : "Become a Sitter"}
            </Button>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{locale === "fa" ? "چطور کار می‌کند" : "How it works"}</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: locale === "fa" ? "جستجو" : "Search", desc: locale === "fa" ? "خدمت مناسب را بیابید." : "Find the right service.", icon: icons.search },
              { title: locale === "fa" ? "رزرو" : "Book", desc: locale === "fa" ? "جزئیات را تایید کنید." : "Confirm details.", icon: icons.calendar },
              { title: locale === "fa" ? "آرامش" : "Relax", desc: locale === "fa" ? "با خیال راحت پیگیری کنید." : "Enjoy peace of mind.", icon: icons.heart }
            ].map((item) => (
              <Card key={item.title} className="group border-border/60 p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  {item.icon}
                </div>
                <div className="mt-4 text-lg font-semibold">{item.title}</div>
                <div className="mt-2 text-sm text-subtle">{item.desc}</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container-page py-12">
          <h2 className="text-2xl font-semibold">{locale === "fa" ? "خدمات محبوب" : "Popular services"}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: locale === "fa" ? "پانسیون" : "Boarding", caption: locale === "fa" ? "شبانه و امن" : "Overnight care" },
              { title: locale === "fa" ? "پیاده‌روی" : "Dog Walking", caption: locale === "fa" ? "ورزش روزانه" : "Daily walks" },
              { title: locale === "fa" ? "نگهداری در منزل" : "House Sitting", caption: locale === "fa" ? "در خانه خودتان" : "At your home" },
              { title: locale === "fa" ? "مهد روزانه" : "Day Care", caption: locale === "fa" ? "تعامل و بازی" : "Play & socialize" },
              { title: locale === "fa" ? "آرایش" : "Grooming", caption: locale === "fa" ? "تمیز و مرتب" : "Clean & tidy" },
              { title: locale === "fa" ? "آموزش" : "Training", caption: locale === "fa" ? "رفتار حرفه‌ای" : "Professional training" }
            ].map((item) => (
              <Card key={item.title} className="p-5">
                <div className="text-sm text-subtle">{item.caption}</div>
                <div className="mt-2 text-lg font-semibold">{item.title}</div>
                <div className="mt-4 text-sm text-brand-700">{locale === "fa" ? "مشاهده" : "View"}</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-page">
            <h2 className="text-2xl font-semibold">{locale === "fa" ? "امنیت و اعتماد" : "Trust & safety"}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { title: locale === "fa" ? "احراز هویت کامل" : "Full identity checks", icon: icons.shield },
                { title: locale === "fa" ? "پرداخت امن" : "Secure payments", icon: icons.shield },
                { title: locale === "fa" ? "سیستم بازخورد شفاف" : "Transparent reviews", icon: icons.shield },
                { title: locale === "fa" ? "قیمت‌گذاری واضح" : "Clear pricing", icon: icons.shield }
              ].map((item) => (
                <Card key={item.title} className="flex items-center gap-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    {item.icon}
                  </div>
                  <div className="font-semibold">{item.title}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page py-12">
          <h2 className="text-2xl font-semibold">{locale === "fa" ? "نظر کاربران" : "Testimonials"}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="p-5">
                <div className="text-sm text-subtle">{item.quote}</div>
                <div className="mt-4 text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-subtle">{item.role}</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container-page flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">
                {locale === "fa" ? "مراقبت مطمئن نزدیک شما" : "Find trusted care near you"}
              </h3>
              <p className="text-subtle">{locale === "fa" ? "همین حالا جستجو کنید." : "Search now and book with confidence."}</p>
            </div>
            <Button onClick={onSubmit}>{locale === "fa" ? "جستجو" : "Search"}</Button>
          </div>
        </section>

        <footer className="container-page py-10 text-sm text-subtle">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="font-semibold text-ink">{locale === "fa" ? "شرکت" : "Company"}</div>
              <div>{locale === "fa" ? "درباره ما" : "About"}</div>
              <div>{locale === "fa" ? "فرصت‌های شغلی" : "Careers"}</div>
            </div>
            <div>
              <div className="font-semibold text-ink">{locale === "fa" ? "خدمات" : "Services"}</div>
              <div>{locale === "fa" ? "پانسیون" : "Boarding"}</div>
              <div>{locale === "fa" ? "پیاده‌روی" : "Dog Walking"}</div>
            </div>
            <div>
              <div className="font-semibold text-ink">{locale === "fa" ? "راهنما" : "Help"}</div>
              <div>{locale === "fa" ? "پشتیبانی" : "Support"}</div>
              <div>{locale === "fa" ? "امنیت" : "Safety"}</div>
            </div>
            <div>
              <div className="font-semibold text-ink">{locale === "fa" ? "قانونی" : "Legal"}</div>
              <div>{locale === "fa" ? "شرایط استفاده" : "Terms"}</div>
              <div>{locale === "fa" ? "حریم خصوصی" : "Privacy"}</div>
            </div>
          </div>
        </footer>
      </main>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(12,91,92,0.12),transparent_70%)]" />
      <Link href={`/${locale}/search` as any} className="sr-only" aria-label={locale === "fa" ? "جستجو" : "Search"}>
        {locale === "fa" ? "جستجو" : "Search"}
      </Link>
    </div>
  );
}
