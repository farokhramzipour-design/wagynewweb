"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { geo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  const locale = useLocale();
  const router = useRouter();
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [cityId, setCityId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [petsCount, setPetsCount] = useState("1");

  const serviceTypes = useQuery({ queryKey: ["geo", "service-types"], queryFn: geo.serviceTypes });

  const goSearch = () => {
    const params = new URLSearchParams();
    if (serviceTypeId) params.set("service_type_id", serviceTypeId);
    if (cityId) params.set("city_id", cityId);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    if (petsCount) params.set("pets_count", petsCount);
    router.push(`/${locale}/search?${params.toString()}` as any);
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-2xl border border-border bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">{locale === "fa" ? "مراقبت مطمئن از حیوانات" : "Find trusted pet care"}</h1>
        <p className="mt-2 text-subtle">
          {locale === "fa" ? "فقط جستجو کنید و بهترین سیترها را ببینید." : "Search instantly and book a trusted sitter."}
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          <select
            className="h-11 rounded-xl border border-border bg-white px-3 text-sm"
            value={serviceTypeId}
            onChange={(event) => setServiceTypeId(event.target.value)}
          >
            <option value="">{locale === "fa" ? "نوع خدمت" : "Service"}</option>
            {serviceTypes.data?.map((service) => (
              <option key={service.service_type_id} value={service.service_type_id}>
                {service.code}
              </option>
            ))}
          </select>
          <Input placeholder={locale === "fa" ? "شناسه شهر" : "City id"} value={cityId} onChange={(e) => setCityId(e.target.value)} />
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Input type="number" min={1} value={petsCount} onChange={(e) => setPetsCount(e.target.value)} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={goSearch}>{locale === "fa" ? "جستجو" : "Search"}</Button>
          <Button variant="ghost" onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}>
            {locale === "fa" ? "سیتر شوید" : "Become a Sitter"}
          </Button>
        </div>
      </section>

      <Card className="p-6 text-sm text-subtle">
        {locale === "fa" ? "برای رزرو وارد شوید." : "Login required to request bookings."}
      </Card>
    </div>
  );
}
