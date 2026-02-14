"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { adminOps, charity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCharityPage() {
  const locale = useLocale();
  const [caseId, setCaseId] = useState<number | null>(null);

  const reviewCase = useMutation({
    mutationFn: (status: string) => adminOps.charityReview(caseId as number, { status, admin_user_id: 0 })
  });
  const activateCase = useMutation({ mutationFn: () => adminOps.charityActivate(caseId as number) });
  const closeCase = useMutation({
    mutationFn: () => adminOps.charityClose(caseId as number, { status: "closed", admin_user_id: 0 })
  });
  const updateCase = useMutation({
    mutationFn: (payload: Record<string, unknown>) => charity.updateCase(caseId as number, payload)
  });

  const donations = useQuery({
    queryKey: ["admin", "charity", "donations", caseId],
    queryFn: () => adminOps.charityDonations(caseId as number),
    enabled: Boolean(caseId)
  });
  const payments = useQuery({
    queryKey: ["admin", "charity", "payments", caseId],
    queryFn: () => adminOps.charityPayments(caseId as number),
    enabled: Boolean(caseId)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "مدیریت پرونده" : "Case moderation"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="case_id"
            value={caseId ?? ""}
            onChange={(event) => setCaseId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="flex flex-wrap gap-2">
            <Button disabled={!caseId} onClick={() => reviewCase.mutate("approved")}>
              {locale === "fa" ? "تایید" : "Approve"}
            </Button>
            <Button variant="danger" disabled={!caseId} onClick={() => reviewCase.mutate("rejected")}>
              {locale === "fa" ? "رد" : "Reject"}
            </Button>
            <Button variant="secondary" disabled={!caseId} onClick={() => activateCase.mutate()}>
              {locale === "fa" ? "فعال" : "Activate"}
            </Button>
            <Button variant="ghost" disabled={!caseId} onClick={() => closeCase.mutate()}>
              {locale === "fa" ? "بستن" : "Close"}
            </Button>
          </div>
          <Textarea id="case_desc" placeholder={locale === "fa" ? "توضیحات" : "Description"} />
          <Button
            disabled={!caseId}
            onClick={() =>
              updateCase.mutate({
                description: (document.getElementById("case_desc") as HTMLTextAreaElement | null)?.value || null
              })
            }
          >
            {locale === "fa" ? "ویرایش" : "Update"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "تراکنش‌ها" : "Donations & payments"}</CardHeader>
        <CardContent className="space-y-2">
          {(donations.isLoading || payments.isLoading) && (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          )}
          {donations.data?.map((d: any) => (
            <div key={d.donation_id} className="rounded-xl border border-border bg-white p-3 text-sm">
              {d.amount_minor} {d.currency_code} - {d.status}
            </div>
          ))}
          {payments.data?.map((p: any) => (
            <div key={p.payment_id} className="rounded-xl border border-border bg-white p-3 text-sm">
              {p.amount_minor} {p.currency_code} - {p.status}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
