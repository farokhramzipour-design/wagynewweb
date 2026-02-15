"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { geo, onboarding, provider } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StepFormRenderer, StepSchema } from "@/features/provider/onboarding/StepFormRenderer";

export default function ProviderServicesPage() {
  const locale = useLocale();
  const serviceTypes = useQuery({ queryKey: ["geo", "service-types"], queryFn: geo.serviceTypes });
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(null);
  const [providerServiceId, setProviderServiceId] = useState<number | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);

  const flow = useQuery({
    queryKey: ["onboarding", "flow", selectedServiceType],
    queryFn: () => onboarding.getFlow(selectedServiceType as number),
    enabled: Boolean(selectedServiceType)
  });

  const steps = useQuery({
    queryKey: ["onboarding", "steps", flow.data?.flow_id],
    queryFn: () => onboarding.listSteps(flow.data?.flow_id as number),
    enabled: Boolean(flow.data?.flow_id)
  });

  const progress = useQuery({
    queryKey: ["onboarding", "progress", providerServiceId],
    queryFn: () => onboarding.listProgress(providerServiceId as number),
    enabled: Boolean(providerServiceId)
  });

  const enableService = useMutation({ mutationFn: onboarding.enableService });
  const toggleService = useMutation({
    mutationFn: (payload: { provider_id: number; service_type_id: number; is_active: boolean }) =>
      provider.upsertService(payload.provider_id, payload)
  });
  const saveStep = useMutation({ mutationFn: ({ stepId, data }: { stepId: number; data: Record<string, any> }) => onboarding.saveStep(providerServiceId as number, stepId, { data_json: data }) });
  const completeStep = useMutation({ mutationFn: ({ stepId, data }: { stepId: number; data: Record<string, any> }) => onboarding.completeStep(providerServiceId as number, stepId, { data_json: data }) });
  const submitService = useMutation({ mutationFn: () => onboarding.submitService({ provider_service_id: providerServiceId as number }) });

  const stepStatusMap = useMemo(() => {
    const map = new Map<number, string>();
    progress.data?.forEach((item) => map.set(item.step_id, item.status));
    return map;
  }, [progress.data]);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "خدمات" : "Services"}</CardHeader>
        <CardContent className="space-y-3">
          {serviceTypes.data?.map((service) => (
            <button
              key={service.service_type_id}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                selectedServiceType === service.service_type_id ? "border-brand-500 bg-brand-50" : "border-border"
              }`}
              onClick={() => setSelectedServiceType(service.service_type_id)}
            >
              <span>{service.code}</span>
              <Badge>{service.is_active ? "فعال" : "غیرفعال"}</Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="text-sm font-semibold">شناسه سرویس ارائه‌دهنده</CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-subtle">
              {locale === "fa"
                ? "برای نمایش پیشرفت مراحل، شناسه سرویس ارائه‌دهنده را وارد کنید."
                : "Enter provider_service_id to load onboarding progress."}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                type="number"
                value={providerId ?? ""}
                onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
                placeholder="provider_id"
              />
              <Input
                type="number"
                value={providerServiceId ?? ""}
                onChange={(event) => setProviderServiceId(event.target.value ? Number(event.target.value) : null)}
                placeholder="provider_service_id"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                selectedServiceType &&
                providerId &&
                enableService.mutate({ provider_id: providerId, service_type_id: selectedServiceType })
              }
            >
              {locale === "fa" ? "فعال‌سازی سرویس" : "Enable service"}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                selectedServiceType &&
                providerId &&
                toggleService.mutate({ provider_id: providerId, service_type_id: selectedServiceType, is_active: false })
              }
            >
              {locale === "fa" ? "توقف سرویس" : "Pause service"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm font-semibold">{locale === "fa" ? "مراحل راه‌اندازی" : "Onboarding steps"}</CardHeader>
          <CardContent className="space-y-4">
            {steps.data?.map((step) => {
              const schema = (step.schema_json as StepSchema) ?? { fields: [] };
              const status = stepStatusMap.get(step.step_id) ?? "not_started";
              const progressItem = progress.data?.find((item) => item.step_id === step.step_id);
              const values = (progressItem?.data_json || {}) as Record<string, any>;

              return (
                <div key={step.step_id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{step.title_fa ?? step.title_en ?? step.code}</div>
                      <div className="text-xs text-subtle">{step.code}</div>
                    </div>
                    <Badge className={status === "completed" ? "bg-green-100 text-success" : "bg-brand-50"}>
                      {status}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <StepFormRenderer
                      schema={schema}
                      values={values}
                      onChange={(name, value) => {
                        const next = { ...values, [name]: value };
                        saveStep.mutate({ stepId: step.step_id, data: next });
                      }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => completeStep.mutate({ stepId: step.step_id, data: values })}
                    >
                      {locale === "fa" ? "تکمیل مرحله" : "Complete step"}
                    </Button>
                    {step.is_required && <Badge>{locale === "fa" ? "الزامی" : "Required"}</Badge>}
                    {step.review_required && <Badge>{locale === "fa" ? "نیاز به بررسی" : "Review"}</Badge>}
                  </div>
                  {status === "rejected" && progressItem?.review_note && (
                    <div className="mt-3 rounded-xl border border-danger/30 bg-red-50 p-3 text-xs text-danger">
                      {progressItem.review_note}
                    </div>
                  )}
                </div>
              );
            })}
            <Button disabled={!providerServiceId} onClick={() => submitService.mutate()}>
              {locale === "fa" ? "ارسال برای بررسی" : "Submit for review"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
