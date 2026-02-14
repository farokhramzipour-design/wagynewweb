"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { bookings } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";
import { bookingOps } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function BookingsPage() {
  const locale = useLocale();
  const [bookingId, setBookingId] = useState<number | null>(null);

  const events = useQuery({
    queryKey: ["booking", "events", bookingId],
    queryFn: () => bookings.events(bookingId as number),
    enabled: Boolean(bookingId)
  });

  const cancelMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => bookingOps.cancel(bookingId as number, payload)
  });
  const disputeMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => bookingOps.dispute(bookingId as number, payload)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پیگیری رزرو" : "Booking timeline"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="booking_id"
            value={bookingId ?? ""}
            onChange={(event) => setBookingId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="space-y-3">
            {events.data?.map((event: any) => (
              <div key={event.event_id} className="rounded-xl border border-border bg-white p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{event.event_type}</span>
                  <Badge>{formatDate(event.created_at, locale === "fa" ? "fa" : "en")}</Badge>
                </div>
                <div className="text-xs text-subtle">{event.actor_type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "لغو یا اختلاف" : "Cancel / Dispute"}</CardHeader>
        <CardContent className="space-y-3">
          <Textarea id="policy_snapshot" placeholder={locale === "fa" ? "policy_snapshot_json" : "policy_snapshot_json"} />
          <div className="grid gap-3 md:grid-cols-3">
            <Input id="refund_minor" type="number" placeholder="refund_minor" />
            <Input id="cancel_reason" placeholder={locale === "fa" ? "دلیل لغو" : "Reason"} />
            <Input id="cancelled_by" placeholder="cancelled_by" defaultValue="owner" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!bookingId}
              onClick={() =>
                cancelMutation.mutate({
                  actor_type: "owner",
                  cancelled_by: (document.getElementById("cancelled_by") as HTMLInputElement | null)?.value ?? "owner",
                  reason: (document.getElementById("cancel_reason") as HTMLInputElement | null)?.value || null,
                  policy_snapshot_json: (() => {
                    try {
                      return JSON.parse((document.getElementById("policy_snapshot") as HTMLTextAreaElement | null)?.value ?? "{}");
                    } catch {
                      return {};
                    }
                  })(),
                  refund_minor: Number((document.getElementById("refund_minor") as HTMLInputElement | null)?.value ?? 0) || null
                })
              }
            >
              {locale === "fa" ? "لغو رزرو" : "Cancel booking"}
            </Button>
            <Button
              variant="ghost"
              disabled={!bookingId}
              onClick={() =>
                disputeMutation.mutate({
                  actor_type: "owner",
                  payload_json: { note: "dispute" }
                })
              }
            >
              {locale === "fa" ? "ثبت اختلاف" : "Open dispute"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
