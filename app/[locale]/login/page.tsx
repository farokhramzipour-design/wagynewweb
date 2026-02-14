"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpRequestSchema, otpVerifySchema } from "@/lib/validators/auth";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";

export default function LoginPage() {
  const t = useTranslations();
  const [step, setStep] = useState<"request" | "verify">("request");
  const requestForm = useForm({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: { phone_e164: "", provider: "sms" }
  });
  const verifyForm = useForm({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { phone_e164: "", provider: "sms", reference_id: "" }
  });

  const requestOtp = useMutation({
    mutationFn: auth.otpRequest,
    onSuccess: () => {
      verifyForm.setValue("phone_e164", requestForm.getValues("phone_e164"));
      setStep("verify");
    }
  });

  const verifyOtp = useMutation({
    mutationFn: auth.otpVerify
  });

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader className="text-lg font-semibold">{t("auth.title")}</CardHeader>
        <CardContent className="space-y-4">
          {step === "request" ? (
            <form
              className="space-y-4"
              onSubmit={requestForm.handleSubmit((values) => requestOtp.mutate(values))}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  {t("auth.phone")}
                </label>
                <Input id="phone" {...requestForm.register("phone_e164")} placeholder="+98 912 000 0000" />
                <FormError message={requestForm.formState.errors.phone_e164?.message as string | undefined} />
              </div>
              <Button type="submit" className="w-full" disabled={requestOtp.isPending}>
                {t("auth.send")}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={verifyForm.handleSubmit((values) => verifyOtp.mutate(values))}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="otp">
                  {t("auth.otp")}
                </label>
                <Input id="otp" {...verifyForm.register("reference_id")} placeholder="123456" />
                <FormError message={verifyForm.formState.errors.reference_id?.message as string | undefined} />
              </div>
              <Button type="submit" className="w-full" disabled={verifyOtp.isPending}>
                {t("auth.verify")}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("request")}
              >
                {t("actions.back")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
