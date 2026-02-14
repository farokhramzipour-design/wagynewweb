"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { petsApi, media } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function PetsPage() {
  const locale = useLocale();
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [petId, setPetId] = useState<number | null>(null);
  const [vaccineDocUrl, setVaccineDocUrl] = useState("");

  const pets = useQuery({
    queryKey: ["pets", ownerId],
    queryFn: () => petsApi.list(ownerId as number),
    enabled: Boolean(ownerId)
  });

  const vaccinations = useQuery({
    queryKey: ["pets", "vaccinations", petId],
    queryFn: () => petsApi.listVaccinations(petId as number),
    enabled: Boolean(petId)
  });

  const createPet = useMutation({ mutationFn: petsApi.create, onSuccess: () => pets.refetch() });
  const updatePet = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => petsApi.update(id, payload) });
  const createVaccination = useMutation({
    mutationFn: (payload: Record<string, unknown>) => petsApi.createVaccination(petId as number, payload),
    onSuccess: () => vaccinations.refetch()
  });

  const requestVaccineUpload = useMutation({
    mutationFn: () =>
      media.uploadUrl({
        media_type: "vaccination",
        storage_key: `vaccines/${petId}-${Date.now()}`,
        url: vaccineDocUrl
      })
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "حیوانات من" : "My pets"}</CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="owner_user_id"
            value={ownerId ?? ""}
            onChange={(event) => setOwnerId(event.target.value ? Number(event.target.value) : null)}
          />
          <Button
            variant="secondary"
            onClick={() =>
              ownerId &&
              createPet.mutate({
                owner_user_id: ownerId,
                name: locale === "fa" ? "حیوان جدید" : "New pet",
                pet_type: "dog",
                size: "medium",
                gender: "unknown",
                is_active: true
              })
            }
          >
            {locale === "fa" ? "افزودن حیوان" : "Add pet"}
          </Button>
          <div className="grid gap-3 md:grid-cols-2">
            {pets.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            )}
            {pets.data?.map((pet: any) => (
              <div key={pet.pet_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="font-semibold">{pet.name}</div>
                <div className="text-xs text-subtle">#{pet.pet_id}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setPetId(pet.pet_id)}>
                    {locale === "fa" ? "مدارک" : "Vaccines"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updatePet.mutate({ id: pet.pet_id, payload: { is_active: !pet.is_active } })}
                  >
                    {pet.is_active ? (locale === "fa" ? "غیرفعال" : "Deactivate") : locale === "fa" ? "فعال" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "واکسیناسیون" : "Vaccinations"}</CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="pet_id"
            value={petId ?? ""}
            onChange={(event) => setPetId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input id="vaccine_type" placeholder={locale === "fa" ? "نوع واکسن" : "Vaccine type"} />
            <Input id="vaccine_date" type="date" />
            <Input id="vaccine_expiry" type="date" placeholder={locale === "fa" ? "تاریخ انقضا" : "Expiry"} />
            <Input id="vaccine_verified" placeholder={locale === "fa" ? "تایید؟ true/false" : "Verified?"} />
          </div>
          <Textarea
            placeholder={locale === "fa" ? "یادداشت" : "Notes"}
            id="vaccine_notes"
          />
          <div className="space-y-2">
            <Input
              placeholder={locale === "fa" ? "آدرس مدرک" : "Document URL"}
              value={vaccineDocUrl}
              onChange={(event) => setVaccineDocUrl(event.target.value)}
            />
            <Button disabled={!petId || !vaccineDocUrl} onClick={() => requestVaccineUpload.mutate()}>
              {locale === "fa" ? "درخواست آپلود مدرک" : "Request upload"}
            </Button>
          </div>
          <Button
            disabled={!petId}
            onClick={() => {
              const type = (document.getElementById("vaccine_type") as HTMLInputElement | null)?.value ?? "";
              const date = (document.getElementById("vaccine_date") as HTMLInputElement | null)?.value ?? "";
              const expiry = (document.getElementById("vaccine_expiry") as HTMLInputElement | null)?.value ?? "";
              const verified = (document.getElementById("vaccine_verified") as HTMLInputElement | null)?.value === "true";
              createVaccination.mutate({ vaccine_type: type, vaccination_date: date, expiry_date: expiry || null, verified, document_media_id: null });
            }}
          >
            {locale === "fa" ? "ثبت واکسن" : "Add vaccine"}
          </Button>
          <div className="grid gap-2">
            {vaccinations.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {vaccinations.data?.map((item: any) => (
              <div key={item.vaccination_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                <div className="font-semibold">{item.vaccine_type}</div>
                <div className="text-xs text-subtle">{item.vaccination_date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
