"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { provider } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProviderProfilePage() {
  const locale = useLocale();
  const [providerId, setProviderId] = useState<number | null>(null);

  const updateProfile = useMutation({
    mutationFn: (payload: Record<string, unknown>) => provider.updateProfile(providerId as number, payload)
  });
  const upsertHome = useMutation({
    mutationFn: (payload: Record<string, unknown>) => provider.upsertHome(providerId as number, payload)
  });
  const addVerification = useMutation({
    mutationFn: (payload: Record<string, unknown>) => provider.addVerification(providerId as number, payload)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پروفایل ارائه‌دهنده" : "Provider profile"}</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="provider_id"
            value={providerId ?? ""}
            onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="headline" placeholder={locale === "fa" ? "عنوان" : "Headline"} />
            <Input id="years" type="number" placeholder={locale === "fa" ? "سابقه" : "Years"} />
            <Input id="radius" type="number" placeholder={locale === "fa" ? "شعاع خدمت" : "Radius km"} />
            <Input id="star" placeholder={locale === "fa" ? "ستاره‌ای؟ true/false" : "Star?"} />
          </div>
          <Textarea id="bio" placeholder={locale === "fa" ? "بیو" : "Bio"} />
          <Button
            disabled={!providerId}
            onClick={() =>
              updateProfile.mutate({
                headline: (document.getElementById("headline") as HTMLInputElement | null)?.value || null,
                years_of_experience: Number((document.getElementById("years") as HTMLInputElement | null)?.value ?? 0) || null,
                service_radius_km: Number((document.getElementById("radius") as HTMLInputElement | null)?.value ?? 0) || null,
                is_star_sitter: (document.getElementById("star") as HTMLInputElement | null)?.value === "true",
                bio: (document.getElementById("bio") as HTMLTextAreaElement | null)?.value || null
              })
            }
          >
            {locale === "fa" ? "ذخیره" : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "اطلاعات خانه" : "Home"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="home_type" placeholder={locale === "fa" ? "نوع خانه" : "Home type"} />
            <Input id="fenced" placeholder={locale === "fa" ? "حیاط؟ true/false" : "Fenced yard"} />
            <Input id="smoking" placeholder={locale === "fa" ? "سیگار؟ true/false" : "Smoking"} />
            <Input id="children" placeholder={locale === "fa" ? "کودک؟ true/false" : "Children"} />
            <Input id="pets" placeholder={locale === "fa" ? "حیوان؟ true/false" : "Pets"} />
            <Input id="wfh" placeholder={locale === "fa" ? "کار از خانه؟" : "WFH"} />
          </div>
          <Button
            disabled={!providerId}
            onClick={() =>
              upsertHome.mutate({
                home_type: (document.getElementById("home_type") as HTMLInputElement | null)?.value || null,
                has_fenced_yard: (document.getElementById("fenced") as HTMLInputElement | null)?.value === "true",
                smoking_household: (document.getElementById("smoking") as HTMLInputElement | null)?.value === "true",
                has_children: (document.getElementById("children") as HTMLInputElement | null)?.value === "true",
                has_pets: (document.getElementById("pets") as HTMLInputElement | null)?.value === "true",
                work_from_home: (document.getElementById("wfh") as HTMLInputElement | null)?.value === "true"
              })
            }
          >
            {locale === "fa" ? "ذخیره خانه" : "Save home"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "تاییدیه" : "Verification"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="verif_type" placeholder={locale === "fa" ? "نوع" : "Type"} />
            <Input id="verif_status" placeholder={locale === "fa" ? "وضعیت" : "Status"} />
          </div>
          <Button
            disabled={!providerId}
            onClick={() =>
              addVerification.mutate({
                type: (document.getElementById("verif_type") as HTMLInputElement | null)?.value ?? "id",
                status: (document.getElementById("verif_status") as HTMLInputElement | null)?.value ?? "submitted"
              })
            }
          >
            {locale === "fa" ? "ثبت تاییدیه" : "Add verification"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
