"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { admin, adminStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminReviewPage() {
  const locale = useLocale();
  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerServiceId, setProviderServiceId] = useState<number | null>(null);
  const [stepId, setStepId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const decideProvider = useMutation({
    mutationFn: (status: string) =>
      admin.providerDecision(providerId as number, { status, admin_user_id: 0, reason: note || null })
  });

  const decideService = useMutation({
    mutationFn: (status: string) =>
      admin.serviceDecision(providerServiceId as number, { status, review_note: note || null })
  });

  const rejectStep = useMutation({
    mutationFn: () =>
      admin.rejectStep(providerServiceId as number, stepId as number, { status: "rejected", review_note: note || null })
  });

  const suspendProvider = useMutation({
    mutationFn: () => adminStatus.updateProviderStatus(providerId as number, { status: "suspended" })
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "بررسی ارائه‌دهنده" : "Provider approval"}</CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="provider_id"
            value={providerId ?? ""}
            onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
          />
          <Input placeholder={locale === "fa" ? "یادداشت" : "Note"} value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button disabled={!providerId} onClick={() => decideProvider.mutate("approved")}>
              {locale === "fa" ? "تایید" : "Approve"}
            </Button>
            <Button variant="danger" disabled={!providerId} onClick={() => decideProvider.mutate("rejected")}>
              {locale === "fa" ? "رد" : "Reject"}
            </Button>
            <Button variant="ghost" disabled={!providerId} onClick={() => suspendProvider.mutate()}>
              {locale === "fa" ? "تعلیق" : "Suspend"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "بررسی خدمت" : "Service approval"}</CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="provider_service_id"
            value={providerServiceId ?? ""}
            onChange={(event) => setProviderServiceId(event.target.value ? Number(event.target.value) : null)}
          />
          <Input placeholder={locale === "fa" ? "یادداشت" : "Note"} value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button disabled={!providerServiceId} onClick={() => decideService.mutate("approved")}>
              {locale === "fa" ? "تایید" : "Approve"}
            </Button>
            <Button variant="danger" disabled={!providerServiceId} onClick={() => decideService.mutate("rejected")}>
              {locale === "fa" ? "رد" : "Reject"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "رد مرحله" : "Reject step"}</CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              type="number"
              placeholder="provider_service_id"
              value={providerServiceId ?? ""}
              onChange={(event) => setProviderServiceId(event.target.value ? Number(event.target.value) : null)}
            />
            <Input
              type="number"
              placeholder="step_id"
              value={stepId ?? ""}
              onChange={(event) => setStepId(event.target.value ? Number(event.target.value) : null)}
            />
          </div>
          <Input placeholder={locale === "fa" ? "یادداشت رد" : "Rejection note"} value={note} onChange={(event) => setNote(event.target.value)} />
          <Button variant="danger" disabled={!providerServiceId || !stepId} onClick={() => rejectStep.mutate()}>
            {locale === "fa" ? "رد مرحله" : "Reject step"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
