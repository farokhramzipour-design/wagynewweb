"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { admin, onboarding } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminServiceReviewPage() {
  const locale = useLocale();
  const params = useParams();
  const providerServiceId = Number(params.provider_service_id);

  const review = useQuery({
    queryKey: ["admin", "service-review", providerServiceId],
    queryFn: () => onboarding.serviceReview(providerServiceId)
  });

  const decision = useMutation({
    mutationFn: (status: string) => admin.serviceDecision(providerServiceId, { status })
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "بررسی سرویس" : "Service review"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-subtle">{review.data?.status ?? "-"}</div>
          <div className="flex gap-2">
            <Button onClick={() => decision.mutate("approved")}>{locale === "fa" ? "تایید" : "Approve"}</Button>
            <Button variant="danger" onClick={() => decision.mutate("rejected")}>{locale === "fa" ? "رد" : "Reject"}</Button>
          </div>
          <div className="grid gap-2">
            {review.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {review.data?.steps?.map((step: any) => (
              <div key={step.step_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="font-semibold">{step.code}</div>
                <div className="text-xs text-subtle">{step.status}</div>
                {step.data_json && (
                  <pre className="mt-2 whitespace-pre-wrap text-xs text-subtle">{JSON.stringify(step.data_json, null, 2)}</pre>
                )}
                {step.review_note && (
                  <div className="mt-2 text-xs text-danger">{step.review_note}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
