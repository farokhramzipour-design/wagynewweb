"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { onboarding } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminFlowsPage() {
  const locale = useLocale();
  const [flowId, setFlowId] = useState<number | null>(null);

  const steps = useQuery({
    queryKey: ["onboarding", "steps", flowId],
    queryFn: () => onboarding.listSteps(flowId as number),
    enabled: Boolean(flowId)
  });

  const createFlow = useMutation({ mutationFn: (payload: Record<string, unknown>) => onboarding.createFlow(payload as any) });
  const createStep = useMutation({
    mutationFn: (payload: Record<string, unknown>) => onboarding.createStep(payload as any),
    onSuccess: () => steps.refetch()
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "ساخت فلو" : "Create flow"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <Input id="flow_service" type="number" placeholder="service_type_id" />
            <Input id="flow_version" type="number" placeholder="version" />
            <Input id="flow_name" placeholder="name" />
          </div>
          <Button
            onClick={() =>
              createFlow.mutate({
                service_type_id: Number((document.getElementById("flow_service") as HTMLInputElement | null)?.value ?? 0),
                version: Number((document.getElementById("flow_version") as HTMLInputElement | null)?.value ?? 1),
                name: (document.getElementById("flow_name") as HTMLInputElement | null)?.value ?? "Flow",
                is_active: true
              })
            }
          >
            {locale === "fa" ? "ثبت" : "Create"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "مراحل فلو" : "Flow steps"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="flow_id"
            value={flowId ?? ""}
            onChange={(event) => setFlowId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-3 md:grid-cols-3">
            <Input id="step_code" placeholder="code" />
            <Input id="step_order" type="number" placeholder="sort_order" />
            <Input id="step_required" placeholder="is_required true/false" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="step_review" placeholder="review_required true/false" />
            <Input id="step_title" placeholder={locale === "fa" ? "عنوان" : "Title"} />
          </div>
          <Textarea id="step_schema" placeholder={locale === "fa" ? "schema_json" : "schema_json"} />
          <Button
            disabled={!flowId}
            onClick={() =>
              createStep.mutate({
                flow_id: flowId,
                code: (document.getElementById("step_code") as HTMLInputElement | null)?.value ?? "step",
                sort_order: Number((document.getElementById("step_order") as HTMLInputElement | null)?.value ?? 0),
                is_required: (document.getElementById("step_required") as HTMLInputElement | null)?.value === "true",
                review_required: (document.getElementById("step_review") as HTMLInputElement | null)?.value === "true",
                title_fa: (document.getElementById("step_title") as HTMLInputElement | null)?.value || null,
                schema_json: (() => {
                  try {
                    return JSON.parse((document.getElementById("step_schema") as HTMLTextAreaElement | null)?.value ?? "{}");
                  } catch {
                    return {};
                  }
                })()
              })
            }
          >
            {locale === "fa" ? "افزودن مرحله" : "Add step"}
          </Button>
          <div className="grid gap-2">
            {steps.data?.map((step: any) => (
              <div key={step.step_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                {step.code} - {step.title_fa ?? step.title_en ?? ""}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
