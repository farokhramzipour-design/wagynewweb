"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { availability } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty";
import { ErrorState } from "@/components/ui/error";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderCalendarPage() {
  const locale = useLocale();
  const [providerId, setProviderId] = useState<number | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const calendar = useQuery({
    queryKey: ["calendar", providerId, start, end],
    queryFn: () => availability.calendar(providerId as number, start, end),
    enabled: Boolean(providerId && start && end)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "تقویم" : "Calendar"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="provider_id"
            value={providerId ?? ""}
            onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input type="date" value={start} onChange={(event) => setStart(event.target.value)} />
            <Input type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
          </div>
          {calendar.isError && <ErrorState title={locale === "fa" ? "خطا در تقویم" : "Calendar error"} />}
          {calendar.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          )}
          <div className="grid gap-2">
            {calendar.data?.bookings?.map((item: any) => (
              <div key={item.booking_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                #{item.booking_id} {item.start_datetime} → {item.end_datetime}
              </div>
            ))}
            {calendar.data?.bookings?.length === 0 && (
              <EmptyState title={locale === "fa" ? "رویدادی نیست" : "No events"} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
