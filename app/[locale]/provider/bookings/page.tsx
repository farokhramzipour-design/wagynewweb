"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { bookingOps } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProviderBookingsPage() {
  const locale = useLocale();
  const [bookingId, setBookingId] = useState<number | null>(null);

  const action = useMutation({ mutationFn: ({ type }: { type: string }) => bookingOps[type as keyof typeof bookingOps](bookingId as number, { actor_type: "provider", actor_user_id: 0 }) });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "مدیریت رزرو" : "Booking ops"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="booking_id"
            value={bookingId ?? ""}
            onChange={(event) => setBookingId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="flex flex-wrap gap-2">
            <Button disabled={!bookingId} onClick={() => action.mutate({ type: "accept" })}>
              {locale === "fa" ? "قبول" : "Accept"}
            </Button>
            <Button variant="ghost" disabled={!bookingId} onClick={() => action.mutate({ type: "decline" })}>
              {locale === "fa" ? "رد" : "Decline"}
            </Button>
            <Button variant="secondary" disabled={!bookingId} onClick={() => action.mutate({ type: "start" })}>
              {locale === "fa" ? "شروع" : "Start"}
            </Button>
            <Button variant="secondary" disabled={!bookingId} onClick={() => action.mutate({ type: "complete" })}>
              {locale === "fa" ? "پایان" : "Complete"}
            </Button>
            <Button variant="danger" disabled={!bookingId} onClick={() => action.mutate({ type: "cancel" })}>
              {locale === "fa" ? "لغو" : "Cancel"}
            </Button>
            <Button variant="ghost" disabled={!bookingId} onClick={() => action.mutate({ type: "dispute" })}>
              {locale === "fa" ? "ثبت اختلاف" : "Dispute"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
