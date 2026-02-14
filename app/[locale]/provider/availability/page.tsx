"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { availability } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderAvailabilityPage() {
  const locale = useLocale();
  const [providerId, setProviderId] = useState<number | null>(null);

  const rules = useQuery({
    queryKey: ["availability", "rules", providerId],
    queryFn: () => availability.listRules(providerId as number),
    enabled: Boolean(providerId)
  });

  const timeOff = useQuery({
    queryKey: ["availability", "time-off", providerId],
    queryFn: () => availability.listTimeOff(providerId as number),
    enabled: Boolean(providerId)
  });

  const createRule = useMutation({ mutationFn: availability.createRule, onSuccess: () => rules.refetch() });
  const createTimeOff = useMutation({ mutationFn: availability.createTimeOff, onSuccess: () => timeOff.refetch() });
  const overrides = useQuery({
    queryKey: ["availability", "overrides", providerId],
    queryFn: () => availability.listOverrides(providerId as number),
    enabled: Boolean(providerId)
  });
  const createOverride = useMutation({ mutationFn: availability.createOverride, onSuccess: () => overrides.refetch() });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "برنامه هفتگی" : "Weekly rules"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="provider_id"
            value={providerId ?? ""}
            onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-3 md:grid-cols-3">
            <Input id="rule_service_type_id" type="number" placeholder="service_type_id" />
            <Input id="rule_day" type="number" placeholder="day_of_week" />
            <Input id="rule_start" type="time" placeholder="start_time" />
            <Input id="rule_end" type="time" placeholder="end_time" />
            <Input id="rule_capacity" type="number" placeholder="capacity" />
            <Input id="rule_active" placeholder="is_active true/false" />
          </div>
          <Button
            disabled={!providerId}
            onClick={() =>
              createRule.mutate({
                provider_id: providerId,
                service_type_id: Number((document.getElementById("rule_service_type_id") as HTMLInputElement | null)?.value ?? 0) || null,
                day_of_week: Number((document.getElementById("rule_day") as HTMLInputElement | null)?.value ?? 0),
                start_time: (document.getElementById("rule_start") as HTMLInputElement | null)?.value ?? "08:00",
                end_time: (document.getElementById("rule_end") as HTMLInputElement | null)?.value ?? "18:00",
                capacity: Number((document.getElementById("rule_capacity") as HTMLInputElement | null)?.value ?? 1),
                is_active: (document.getElementById("rule_active") as HTMLInputElement | null)?.value === "true"
              })
            }
          >
            {locale === "fa" ? "ثبت برنامه" : "Add rule"}
          </Button>
          <div className="grid gap-2">
            {rules.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {rules.data?.map((rule: any) => (
              <div key={rule.rule_id ?? rule.id ?? Math.random()} className="rounded-xl border border-border bg-white p-3 text-sm">
                {rule.day_of_week} {rule.start_time}-{rule.end_time}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "مرخصی" : "Time off"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="timeoff_start" type="datetime-local" placeholder="start" />
            <Input id="timeoff_end" type="datetime-local" placeholder="end" />
          </div>
          <Input id="timeoff_reason" placeholder={locale === "fa" ? "دلیل" : "Reason"} />
          <Button
            disabled={!providerId}
            onClick={() =>
              createTimeOff.mutate({
                provider_id: providerId,
                start_datetime: (document.getElementById("timeoff_start") as HTMLInputElement | null)?.value ?? "",
                end_datetime: (document.getElementById("timeoff_end") as HTMLInputElement | null)?.value ?? "",
                reason: (document.getElementById("timeoff_reason") as HTMLInputElement | null)?.value || null
              })
            }
          >
            {locale === "fa" ? "ثبت مرخصی" : "Add time off"}
          </Button>
          <div className="grid gap-2">
            {timeOff.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {timeOff.data?.map((item: any) => (
              <div key={item.time_off_id ?? Math.random()} className="rounded-xl border border-border bg-white p-3 text-sm">
                {item.start_datetime} → {item.end_datetime}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "استثناها" : "Overrides"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <Input id="override_date" type="date" />
            <Input id="override_service" type="number" placeholder="service_type_id" />
            <Input id="override_available" placeholder="is_available true/false" />
            <Input id="override_capacity" type="number" placeholder="capacity" />
          </div>
          <Button
            disabled={!providerId}
            onClick={() =>
              createOverride.mutate({
                provider_id: providerId,
                date: (document.getElementById("override_date") as HTMLInputElement | null)?.value ?? "",
                service_type_id: Number((document.getElementById("override_service") as HTMLInputElement | null)?.value ?? 0) || null,
                is_available: (document.getElementById("override_available") as HTMLInputElement | null)?.value === "true",
                capacity: Number((document.getElementById("override_capacity") as HTMLInputElement | null)?.value ?? 0) || null
              })
            }
          >
            {locale === "fa" ? "ثبت استثنا" : "Add override"}
          </Button>
          <div className="grid gap-2">
            {overrides.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {overrides.data?.map((item: any) => (
              <div key={item.override_id ?? Math.random()} className="rounded-xl border border-border bg-white p-3 text-sm">
                {item.date} - {item.is_available ? "on" : "off"}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
