"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { search, geo, availability, providerRates, favorites } from "@/lib/api";
import { searchFiltersSchema } from "@/lib/validators/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty";
import { ErrorState } from "@/components/ui/error";

export default function SearchPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();

  const filters = useMemo(() => {
    const raw = Object.fromEntries(params.entries());
    const parsed = searchFiltersSchema.safeParse(raw);
    return parsed.success ? parsed.data : {};
  }, [params]);

  const serviceTypes = useQuery({ queryKey: ["geo", "service-types"], queryFn: geo.serviceTypes });
  const provinces = useQuery({ queryKey: ["geo", "provinces"], queryFn: () => geo.provinces("IR") });
  const cities = useQuery({
    queryKey: ["geo", "cities", filters.province_id],
    queryFn: () => geo.cities(filters.province_id ?? null),
    enabled: Boolean(filters.province_id)
  });

  const results = useQuery({
    queryKey: ["search", filters],
    queryFn: () => search.providers(filters),
    enabled: Object.keys(filters).length > 0
  });

  const [estimateServiceId, setEstimateServiceId] = useState<number | null>(null);
  const [favoriteUserId, setFavoriteUserId] = useState<number | null>(null);
  const [availabilityResult, setAvailabilityResult] = useState<Record<string, any> | null>(null);

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`/${locale}/search?${next.toString()}`);
  };

  const selectedService = serviceTypes.data?.find((item) => item.service_type_id === filters.service_type_id);
  const serviceCode = selectedService?.code?.toLowerCase() ?? "";
  const showRadius = serviceCode.includes("walk") || serviceCode.includes("drop");
  const showHomeFilters =
    serviceCode.includes("board") || serviceCode.includes("day") || serviceCode.includes("house");

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader className="text-sm font-semibold">{t("search.filters")}</CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">{locale === "fa" ? "شناسه کاربر برای علاقه‌مندی" : "User id for favorites"}</label>
            <Input
              type="number"
              value={favoriteUserId ?? ""}
              onChange={(event) => setFavoriteUserId(event.target.value ? Number(event.target.value) : null)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">{t("search.service")}</label>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"
              value={filters.service_type_id ?? ""}
              onChange={(event) => updateParam("service_type_id", event.target.value || undefined)}
            >
              <option value="">{locale === "fa" ? "همه خدمات" : "All services"}</option>
              {serviceTypes.data?.map((service) => (
                <option key={service.service_type_id} value={service.service_type_id}>
                  {service.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">{t("search.province")}</label>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"
              value={filters.province_id ?? ""}
              onChange={(event) => updateParam("province_id", event.target.value || undefined)}
            >
              <option value="">{locale === "fa" ? "همه استان‌ها" : "All provinces"}</option>
              {provinces.data?.map((province: any) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">{t("search.city")}</label>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"
              value={filters.city_id ?? ""}
              onChange={(event) => updateParam("city_id", event.target.value || undefined)}
            >
              <option value="">{locale === "fa" ? "همه شهرها" : "All cities"}</option>
              {cities.data?.map((city: any) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.name_fa}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">{t("search.dateRange")}</label>
              <Input
                type="date"
                value={filters.start_date ?? ""}
                onChange={(event) => updateParam("start_date", event.target.value || undefined)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">&nbsp;</label>
              <Input
                type="date"
                value={filters.end_date ?? ""}
                onChange={(event) => updateParam("end_date", event.target.value || undefined)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">{t("search.petCount")}</label>
            <Input
              type="number"
              min={1}
              value={filters.pets_count ?? ""}
              onChange={(event) => updateParam("pets_count", event.target.value || undefined)}
            />
          </div>
          {showRadius && (
            <div>
              <label className="text-sm font-medium">{locale === "fa" ? "شعاع (کیلومتر)" : "Radius (km)"}</label>
              <Input
                type="number"
                value={filters.radius_km ?? ""}
                onChange={(event) => updateParam("radius_km", event.target.value || undefined)}
              />
            </div>
          )}
          {showHomeFilters && (
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder={locale === "fa" ? "حیاط؟ true/false" : "Fenced yard true/false"}
                value={filters.has_fenced_yard ?? ""}
                onChange={(event) => updateParam("has_fenced_yard", event.target.value || undefined)}
              />
              <Input
                placeholder={locale === "fa" ? "سیگار؟ true/false" : "Smoking true/false"}
                value={filters.smoking_household ?? ""}
                onChange={(event) => updateParam("smoking_household", event.target.value || undefined)}
              />
              <Input
                placeholder={locale === "fa" ? "کودک؟ true/false" : "Children true/false"}
                value={filters.has_children ?? ""}
                onChange={(event) => updateParam("has_children", event.target.value || undefined)}
              />
              <Input
                placeholder={locale === "fa" ? "حیوان؟ true/false" : "Pets true/false"}
                value={filters.has_pets ?? ""}
                onChange={(event) => updateParam("has_pets", event.target.value || undefined)}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" className="w-full" onClick={() => router.push(`/${locale}/search`)}>
              {t("actions.clear")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="page-title">{t("search.results")}</h2>
        {results.isError && (
          <ErrorState title={locale === "fa" ? "خطا در جستجو" : "Search failed"} description={String(results.error)} />
        )}
        {results.isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}
        {results.data?.length === 0 && (
          <EmptyState
            title={locale === "fa" ? "نتیجه‌ای یافت نشد" : "No providers found"}
            description={locale === "fa" ? "فیلترها را تغییر دهید." : "Try adjusting filters."}
          />
        )}
        {Array.isArray(results.data) && results.data.length > 0 && (
          <div className="grid gap-4">
            {results.data.map((provider: any) => (
              <Card key={provider.provider_id}>
                <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold">{provider.headline ?? "Provider"}</div>
                    <div className="text-sm text-subtle">
                      {provider.bio ?? (locale === "fa" ? "توضیحی ثبت نشده" : "No bio")}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {provider.is_star_sitter && <Badge>{locale === "fa" ? "ویژه" : "Star"}</Badge>}
                      {provider.average_rating && (
                        <Badge className="bg-green-100 text-success">{provider.average_rating}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link href={`/${locale}/providers/${provider.provider_id}`}>
                        {locale === "fa" ? "مشاهده" : "View"}
                      </Link>
                    </Button>
                    <Button>{locale === "fa" ? "درخواست رزرو" : "Request"}</Button>
                    <Button
                      variant="secondary"
                      disabled={!favoriteUserId}
                      onClick={() =>
                        favoriteUserId && favorites.add({ user_id: favoriteUserId, provider_id: provider.provider_id })
                      }
                    >
                      {locale === "fa" ? "علاقه‌مند" : "Favorite"}
                    </Button>
                  </div>
                </CardContent>
                <CardContent className="border-t border-border space-y-3">
                  <div className="grid gap-2 md:grid-cols-3">
                    <Input
                      type="number"
                      placeholder="provider_service_id"
                      value={estimateServiceId ?? ""}
                      onChange={(event) => setEstimateServiceId(event.target.value ? Number(event.target.value) : null)}
                    />
                    <Button
                      variant="secondary"
                      disabled={!estimateServiceId || !filters.pets_count}
                      onClick={async () => {
                        if (!estimateServiceId || !filters.pets_count) return;
                        const estimate = await providerRates.estimate(estimateServiceId, { pets_count: filters.pets_count });
                        setAvailabilityResult({ estimate });
                      }}
                    >
                      {locale === "fa" ? "برآورد قیمت" : "Estimate"}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={!filters.start_date || !filters.end_date}
                      onClick={async () => {
                        const res = await availability.check({
                          provider_id: provider.provider_id,
                          service_type_id: filters.service_type_id,
                          start_datetime: filters.start_date,
                          end_datetime: filters.end_date,
                          requested_units: filters.pets_count ?? 1
                        });
                        setAvailabilityResult({ availability: res });
                      }}
                    >
                      {locale === "fa" ? "بررسی دسترسی" : "Check availability"}
                    </Button>
                  </div>
                  {availabilityResult && (
                    <div className="rounded-xl border border-border bg-white p-3 text-xs">
                      {JSON.stringify(availabilityResult)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
