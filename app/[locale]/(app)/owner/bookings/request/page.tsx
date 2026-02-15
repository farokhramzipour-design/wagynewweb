"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingRequestSchema, BookingRequestInput } from "@/lib/validators/booking";
import { bookings, payments, bookingOps } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";

export default function BookingRequestPage() {
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [pricingSummary, setPricingSummary] = useState<Record<string, number> | null>(null);
  const form = useForm<BookingRequestInput>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      booking_reference: "",
      owner_user_id: 0,
      provider_id: 0,
      service_type_id: 0,
      start_datetime: "",
      end_datetime: "",
      pets: [{ pet_id: 0, per_pet_notes: "" }]
    }
  });
  const petsField = useFieldArray({ control: form.control, name: "pets" });

  const requestBooking = useMutation({
    mutationFn: bookings.request,
    onSuccess: (data: any) => {
      if (data?.booking_id) {
        setBookingId(data.booking_id);
      }
    }
  });

  const capturePayment = useMutation({
    mutationFn: payments.createBookingPayment
  });

  const confirmBooking = useMutation({
    mutationFn: (payload: Record<string, unknown>) => bookingOps.confirm(bookingId as number, payload)
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader className="text-lg font-semibold">درخواست رزرو</CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => requestBooking.mutate(values))}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="کد رزرو" {...form.register("booking_reference")} />
              <FormError message={form.formState.errors.booking_reference?.message as string | undefined} />
              <Input placeholder="شناسه مالک" type="number" {...form.register("owner_user_id")} />
              <FormError message={form.formState.errors.owner_user_id?.message as string | undefined} />
              <Input placeholder="شناسه ارائه‌دهنده" type="number" {...form.register("provider_id")} />
              <FormError message={form.formState.errors.provider_id?.message as string | undefined} />
              <Input placeholder="شناسه سرویس" type="number" {...form.register("service_type_id")} />
              <FormError message={form.formState.errors.service_type_id?.message as string | undefined} />
              <Input type="datetime-local" {...form.register("start_datetime")} />
              <FormError message={form.formState.errors.start_datetime?.message as string | undefined} />
              <Input type="datetime-local" {...form.register("end_datetime")} />
              <FormError message={form.formState.errors.end_datetime?.message as string | undefined} />
            </div>
            <div className="space-y-3">
              <div className="text-sm font-semibold">حیوانات</div>
              {petsField.fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                  <Input type="number" placeholder="شناسه حیوان" {...form.register(`pets.${index}.pet_id` as const)} />
                  <Input placeholder="یادداشت" {...form.register(`pets.${index}.per_pet_notes` as const)} />
                  <Button type="button" variant="ghost" onClick={() => petsField.remove(index)}>
                    حذف
                  </Button>
                </div>
              ))}
              <FormError message={form.formState.errors.pets?.message as string | undefined} />
              <Button type="button" variant="secondary" onClick={() => petsField.append({ pet_id: 0, per_pet_notes: "" })}>
                افزودن حیوان
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={requestBooking.isPending}>
              ثبت درخواست
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-lg font-semibold">پرداخت</CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-subtle">
            {bookingId ? `رزرو شماره ${bookingId} آماده پرداخت است.` : "ابتدا رزرو را ثبت کنید."}
          </div>
          <Button
            disabled={!bookingId || capturePayment.isPending}
            onClick={() =>
              bookingId &&
              capturePayment.mutate({
                booking_id: bookingId,
                kind: "capture",
                gateway_id: null,
                gateway_transaction_id: null,
                raw_response_json: { status: "captured" }
              })
            }
          >
            پرداخت و تایید رزرو
          </Button>
          <div className="grid gap-2 md:grid-cols-2">
            <Input id="subtotal_minor" type="number" placeholder="subtotal_minor" />
            <Input id="owner_fee_minor" type="number" placeholder="owner_fee_minor" />
            <Input id="provider_fee_minor" type="number" placeholder="provider_fee_minor" />
            <Input id="total_charge_minor" type="number" placeholder="total_charge_minor" />
            <Input id="provider_payout_minor" type="number" placeholder="provider_payout_minor" />
          </div>
          <Button
            variant="secondary"
            disabled={!bookingId}
            onClick={() =>
              confirmBooking.mutate({
                actor_type: "owner",
                currency_code: "IRR",
                subtotal_minor: Number((document.getElementById("subtotal_minor") as HTMLInputElement | null)?.value ?? 0),
                owner_fee_minor: Number((document.getElementById("owner_fee_minor") as HTMLInputElement | null)?.value ?? 0),
                provider_fee_minor: Number((document.getElementById("provider_fee_minor") as HTMLInputElement | null)?.value ?? 0),
                total_charge_minor: Number((document.getElementById("total_charge_minor") as HTMLInputElement | null)?.value ?? 0),
                provider_payout_minor: Number((document.getElementById("provider_payout_minor") as HTMLInputElement | null)?.value ?? 0),
                breakdown_json: {}
              })
            }
          >
            تایید رزرو
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              const subtotal = Number((document.getElementById("subtotal_minor") as HTMLInputElement | null)?.value ?? 0);
              const ownerFee = Number((document.getElementById("owner_fee_minor") as HTMLInputElement | null)?.value ?? 0);
              const providerFee = Number((document.getElementById("provider_fee_minor") as HTMLInputElement | null)?.value ?? 0);
              const total = Number((document.getElementById("total_charge_minor") as HTMLInputElement | null)?.value ?? 0);
              const payout = Number((document.getElementById("provider_payout_minor") as HTMLInputElement | null)?.value ?? 0);
              setPricingSummary({ subtotal, ownerFee, providerFee, total, payout });
            }}
          >
            خلاصه پرداخت
          </Button>
          {pricingSummary && (
            <div className="rounded-xl border border-border bg-white p-3 text-xs">
              {JSON.stringify(pricingSummary, null, 2)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
