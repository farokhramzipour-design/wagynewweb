"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { geo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { JalaliDateInput } from "@/components/jalali-date-input";
import { Stagger, StaggerItem } from "@/components/motion";

const searchSchema = z.object({
  service_type_id: z.string().min(1, "required"),
  province_id: z.string().optional(),
  city_id: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  pets_count: z.string().min(1, "required")
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function SearchCard({ selectedServiceId }: { selectedServiceId?: string }) {
  const locale = useLocale();
  const router = useRouter();

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

  useEffect(() => {
    if (selectedServiceId) {
      form.setValue("service_type_id", selectedServiceId);
    }
  }, [selectedServiceId, form]);

  const provinceId = form.watch("province_id");
  const cities = useQuery({
    queryKey: ["geo", "cities", provinceId],
    queryFn: () => geo.cities(provinceId ? Number(provinceId) : null),
    enabled: Boolean(provinceId)
  });

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
    <section id="search" className="container-page -mt-12 pb-12">
      <Stagger>
        <StaggerItem>
          <Card className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 p-1 shadow-soft backdrop-blur">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.2),rgba(250,117,91,0.18),transparent)]" />
            <CardContent className="relative rounded-[28px] bg-white/90 p-6">
              <form className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_0.7fr_0.9fr]" onSubmit={onSubmit}>
                <div className="lg:col-span-1">
                  <label className="text-sm font-medium">{locale === "fa" ? "نوع خدمت" : "Service type"}</label>
                  <select className="mt-2 h-11 w-full rounded-2xl border border-border bg-white px-3 text-sm" {...form.register("service_type_id")}>
                    <option value="">{locale === "fa" ? "انتخاب کنید" : "Select"}</option>
                    {serviceTypes.data?.map((service) => (
                      <option key={service.service_type_id} value={service.service_type_id}>
                        {service.code}
                      </option>
                    ))}
                  </select>
                  <FormError message={form.formState.errors.service_type_id?.message as string | undefined} />
                </div>

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

                <div className="lg:col-span-2 grid gap-3 sm:grid-cols-2">
                  <JalaliDateInput
                    label={locale === "fa" ? "تاریخ شروع" : "Start date"}
                    locale={locale as "fa" | "en"}
                    {...form.register("start_date")}
                  />
                  <JalaliDateInput
                    label={locale === "fa" ? "تاریخ پایان" : "End date"}
                    locale={locale as "fa" | "en"}
                    {...form.register("end_date")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{locale === "fa" ? "تعداد حیوان" : "Pets"}</label>
                  <Input className="mt-2" type="number" min={1} {...form.register("pets_count")} />
                  <FormError message={form.formState.errors.pets_count?.message as string | undefined} />
                </div>

                <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row">
                  <Button className="w-full rounded-2xl" type="submit">
                    {locale === "fa" ? "جستجوی پرستار" : "Search sitters"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full rounded-2xl"
                    onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}
                  >
                    {locale === "fa" ? "درآمد از پرستاری" : "Earn as sitter"}
                  </Button>
                </div>
              </form>
              {form.formState.errors.service_type_id ? (
                <div className="mt-3 text-xs text-danger">
                  {locale === "fa" ? "لطفا نوع خدمت را انتخاب کنید." : "Please select a service type."}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
