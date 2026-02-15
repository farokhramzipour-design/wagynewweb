"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { charity, media } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/ui/error";

export default function CharityCasePage() {
  const locale = useLocale();
  const params = useParams();
  const caseId = Number(params.case_id);

  const caseQuery = useQuery({ queryKey: ["charity", "case", caseId], queryFn: () => charity.getCase(caseId) });
  const updates = useQuery({ queryKey: ["charity", "updates", caseId], queryFn: () => charity.listUpdates(caseId) });

  const donateMutation = useMutation({
    mutationFn: (amount_minor: number) =>
      charity.donate({
        charity_case_id: caseId,
        status: "pending",
        currency_code: caseQuery.data?.currency_code ?? "IRR",
        amount_minor,
        donation_reference: `DON-${Date.now()}`
      })
  });

  const addUpdate = useMutation({
    mutationFn: (body: string) => charity.addUpdate({ charity_case_id: caseId, body })
  });

  const proof = useQuery({ queryKey: ["charity", "proof", caseId], queryFn: () => charity.listProof(caseId) });
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaId, setMediaId] = useState<number | null>(null);
  const requestMedia = useMutation({
    mutationFn: () =>
      media.uploadUrl({
        media_type: "charity",
        storage_key: `charity/${caseId}-${Date.now()}`,
        url: mediaUrl
      }),
    onSuccess: (data: any) => {
      if (data?.media?.media_id) setMediaId(data.media.media_id);
    }
  });
  const attachMedia = useMutation({
    mutationFn: (updateId: number) => charity.addUpdateMedia({ charity_update_id: updateId, media_id: mediaId as number })
  });

  return (
    <div className="space-y-6">
      {caseQuery.isError && <ErrorState title={locale === "fa" ? "خطا در پرونده" : "Case load failed"} />}
      <Card>
        <CardHeader className="text-lg font-semibold">{caseQuery.data?.title ?? "-"}</CardHeader>
        <CardContent className="space-y-4 text-sm text-subtle">
          <div>{caseQuery.data?.description ?? (locale === "fa" ? "توضیحات ندارد." : "No description.")}</div>
          <div className="flex flex-wrap gap-3">
            <Input type="number" placeholder={locale === "fa" ? "مبلغ کمک" : "Amount"} id="donate" />
            <Button
              onClick={() => {
                const input = document.getElementById("donate") as HTMLInputElement | null;
                const amount = input?.value ? Number(input.value) : 0;
                if (amount > 0) donateMutation.mutate(amount);
              }}
            >
              {locale === "fa" ? "پرداخت" : "Donate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "به‌روزرسانی‌ها" : "Updates"}</CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea id="update_body" placeholder={locale === "fa" ? "متن به‌روزرسانی" : "Update"} />
            <Button
              variant="secondary"
              onClick={() => {
                const input = document.getElementById("update_body") as HTMLTextAreaElement | null;
                if (input?.value) addUpdate.mutate(input.value);
              }}
            >
              {locale === "fa" ? "ثبت به‌روزرسانی" : "Add update"}
            </Button>
            <div className="grid gap-2 md:grid-cols-3">
              <Input placeholder={locale === "fa" ? "آدرس مدرک" : "Media URL"} value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
              <Button disabled={!mediaUrl} onClick={() => requestMedia.mutate()}>
                {locale === "fa" ? "درخواست آپلود" : "Request upload"}
              </Button>
              <Button
                disabled={!mediaId || !updates.data?.[0]?.charity_update_id}
                onClick={() => attachMedia.mutate(updates.data?.[0]?.charity_update_id)}
              >
                {locale === "fa" ? "اتصال فایل" : "Attach media"}
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {updates.data?.map((item: any) => (
              <div key={item.charity_update_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="text-xs text-subtle">#{item.charity_update_id}</div>
                <div>{item.body}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {proof.data?.map((item: any) => (
              <div key={item.charity_update_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                #{item.charity_update_id} media: {item.media_ids?.join(", ")}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
