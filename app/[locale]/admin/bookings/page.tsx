"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { adminOps } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDisputesPage() {
  const locale = useLocale();
  const [bookingId, setBookingId] = useState<number | null>(null);

  const dispute = useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminOps.disputeBooking(bookingId as number, payload)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "رسیدگی اختلاف" : "Dispute handling"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="booking_id"
            value={bookingId ?? ""}
            onChange={(event) => setBookingId(event.target.value ? Number(event.target.value) : null)}
          />
          <Textarea id="admin_dispute_payload" placeholder={locale === "fa" ? "جزئیات" : "Details"} />
          <Button
            disabled={!bookingId}
            onClick={() =>
              dispute.mutate({
                actor_user_id: 0,
                payload_json: (() => {
                  try {
                    return JSON.parse((document.getElementById("admin_dispute_payload") as HTMLTextAreaElement | null)?.value ?? "{}");
                  } catch {
                    return {};
                  }
                })()
              })
            }
          >
            {locale === "fa" ? "ثبت" : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
