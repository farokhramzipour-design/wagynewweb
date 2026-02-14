"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { providerRates } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProviderPricingPage() {
  const locale = useLocale();
  const [providerServiceId, setProviderServiceId] = useState<number | null>(null);

  const addRate = useMutation({
    mutationFn: (payload: Record<string, unknown>) => providerRates.addRate(providerServiceId as number, payload)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "قیمت‌گذاری" : "Pricing"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="provider_service_id"
            value={providerServiceId ?? ""}
            onChange={(event) => setProviderServiceId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="currency_code" placeholder="currency_code" defaultValue="IRR" />
            <Input id="unit" placeholder="unit" defaultValue="night" />
            <Input id="base_amount_minor" type="number" placeholder="base_amount_minor" />
            <Input id="duration_minutes" type="number" placeholder="duration_minutes" />
            <Input id="effective_from" type="datetime-local" placeholder="effective_from" />
            <Input id="effective_to" type="datetime-local" placeholder="effective_to" />
          </div>
          <Button
            disabled={!providerServiceId}
            onClick={() => {
              const payload = {
                currency_code: (document.getElementById("currency_code") as HTMLInputElement | null)?.value ?? "IRR",
                unit: (document.getElementById("unit") as HTMLInputElement | null)?.value ?? "night",
                base_amount_minor: Number((document.getElementById("base_amount_minor") as HTMLInputElement | null)?.value ?? 0),
                duration_minutes: Number((document.getElementById("duration_minutes") as HTMLInputElement | null)?.value ?? 0) || null,
                effective_from: (document.getElementById("effective_from") as HTMLInputElement | null)?.value || null,
                effective_to: (document.getElementById("effective_to") as HTMLInputElement | null)?.value || null
              };
              addRate.mutate(payload);
            }}
          >
            {locale === "fa" ? "ثبت نرخ" : "Add rate"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
