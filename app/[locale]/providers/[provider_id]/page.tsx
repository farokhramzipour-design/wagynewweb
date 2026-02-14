"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { provider, reviews } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderProfileViewPage() {
  const locale = useLocale();
  const params = useParams();
  const providerId = Number(params.provider_id);
  const [serviceTypeId, setServiceTypeId] = useState<number | null>(null);

  const profile = useQuery({
    queryKey: ["provider", "profile", providerId],
    queryFn: () => provider.getProfile(providerId)
  });

  const reviewsList = useQuery({
    queryKey: ["reviews", providerId, serviceTypeId],
    queryFn: () => reviews.list(providerId, serviceTypeId ?? null)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-lg font-semibold">{profile.data?.provider?.headline ?? "Provider"}</CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="text-subtle">{profile.data?.provider?.bio ?? "-"}</div>
          <div className="flex flex-wrap gap-2">
            {profile.data?.provider_verified && <Badge>{locale === "fa" ? "تایید ارائه‌دهنده" : "Provider verified"}</Badge>}
            {profile.data?.identity_verified && <Badge>{locale === "fa" ? "تایید هویت" : "Identity verified"}</Badge>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "خدمات" : "Services"}</CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {profile.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          )}
          {profile.data?.services?.map((service: any) => (
            <div key={service.provider_service_id} className="rounded-xl border border-border bg-white p-3 text-sm">
              <div className="font-semibold">{service.service_code}</div>
              <div className="text-xs text-subtle">{service.status}</div>
              <div className="mt-2 text-xs text-subtle">
                {service.base_amount_minor ? `${service.base_amount_minor} ${service.currency_code ?? ""}` : "-"}
              </div>
              {service.policies_json && (
                <pre className="mt-2 whitespace-pre-wrap text-xs text-subtle">
                  {JSON.stringify(service.policies_json, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "نظرات" : "Reviews"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="service_type_id"
            value={serviceTypeId ?? ""}
            onChange={(event) => setServiceTypeId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-2">
            {reviewsList.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {reviewsList.data?.map((review: any) => (
              <div key={review.review_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="font-semibold">{review.rating}/5</div>
                <div className="text-xs text-subtle">{review.review_text ?? ""}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
