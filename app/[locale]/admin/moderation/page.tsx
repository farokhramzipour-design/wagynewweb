"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { adminOps, messaging } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminModerationPage() {
  const locale = useLocale();
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [messageId, setMessageId] = useState<number | null>(null);

  const moderate = useMutation({
    mutationFn: (status: string) => adminOps.reviewModeration(reviewId as number, { status })
  });
  const visibility = useMutation({
    mutationFn: (is_public: boolean) => adminOps.reviewVisibility(reviewId as number, { is_public })
  });

  const flagMessage = useMutation({
    mutationFn: () => messaging.flagMessage(messageId as number, { is_flagged: true, flag_reason: "admin" })
  });

  const flagged = useQuery({
    queryKey: ["admin", "flagged-messages"],
    queryFn: () => adminOps.listFlaggedMessages(200)
  });

  const resolveFlag = useMutation({
    mutationFn: () => adminOps.resolveMessageFlag(messageId as number, { is_flagged: false, flag_reason: null })
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "مدیریت نظرات" : "Review moderation"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="review_id"
            value={reviewId ?? ""}
            onChange={(event) => setReviewId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="flex gap-2">
            <Button disabled={!reviewId} onClick={() => moderate.mutate("approved")}>
              {locale === "fa" ? "تایید" : "Approve"}
            </Button>
            <Button variant="danger" disabled={!reviewId} onClick={() => moderate.mutate("rejected")}>
              {locale === "fa" ? "رد" : "Reject"}
            </Button>
            <Button variant="ghost" disabled={!reviewId} onClick={() => visibility.mutate(true)}>
              {locale === "fa" ? "عمومی" : "Public"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پیام‌های گزارش‌شده" : "Flag message"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="message_id"
            value={messageId ?? ""}
            onChange={(event) => setMessageId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="flex gap-2">
            <Button disabled={!messageId} onClick={() => flagMessage.mutate()}>
              {locale === "fa" ? "گزارش" : "Flag"}
            </Button>
            <Button variant="secondary" disabled={!messageId} onClick={() => resolveFlag.mutate()}>
              {locale === "fa" ? "رفع گزارش" : "Resolve"}
            </Button>
          </div>
          <div className="grid gap-2">
            {flagged.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {flagged.data?.map((msg: any) => (
              <div key={msg.message_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                #{msg.message_id} {msg.flag_reason ?? ""}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
