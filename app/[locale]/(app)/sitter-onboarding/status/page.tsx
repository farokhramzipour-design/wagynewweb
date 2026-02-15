"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { onboarding } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderSummaryPage() {
  const locale = useLocale();
  const [providerId, setProviderId] = useState<number | null>(null);

  const summary = useQuery({
    queryKey: ["provider", "summary", providerId],
    queryFn: () => onboarding.providerSummary(providerId as number),
    enabled: Boolean(providerId)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "خلاصه آنبوردینگ" : "Onboarding summary"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="provider_id"
            value={providerId ?? ""}
            onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="text-sm text-subtle">{summary.data?.provider_status ?? "-"}</div>
          {summary.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          )}
          <div className="grid gap-2">
            {summary.data?.services?.map((service: any) => (
              <div key={service.provider_service_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                #{service.provider_service_id} - {service.status}
                <div className="text-xs text-subtle">{service.missing_steps?.join(", ")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
