"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { payments, wallet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLedgerPage() {
  const locale = useLocale();
  const [userId, setUserId] = useState<number | null>(null);
  const [currency, setCurrency] = useState("IRR");

  const walletQuery = useQuery({
    queryKey: ["wallet", userId, currency],
    queryFn: () => wallet.get(userId as number, currency),
    enabled: Boolean(userId)
  });

  const transactions = useQuery({
    queryKey: ["wallet", "tx", walletQuery.data?.wallet_id],
    queryFn: () => wallet.transactions(walletQuery.data.wallet_id),
    enabled: Boolean(walletQuery.data?.wallet_id)
  });

  const refund = useMutation({
    mutationFn: (payload: Record<string, unknown>) => payments.createRefund(payload)
  });

  const payout = useMutation({
    mutationFn: (payload: Record<string, unknown>) => payments.createPayout(payload)
  });

  const adjustment = useMutation({
    mutationFn: (payload: Record<string, unknown>) => payments.createAdjustment(payload)
  });

  const [bookingId, setBookingId] = useState<number | null>(null);
  const bookingPayments = useQuery({
    queryKey: ["payments", "booking", bookingId],
    queryFn: () => payments.listBookingPayments(bookingId as number),
    enabled: Boolean(bookingId)
  });
  const bookingLedger = useQuery({
    queryKey: ["payments", "ledger", bookingId],
    queryFn: () => payments.bookingLedger(bookingId as number),
    enabled: Boolean(bookingId)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "کیف پول" : "Wallet"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              type="number"
              placeholder="user_id"
              value={userId ?? ""}
              onChange={(event) => setUserId(event.target.value ? Number(event.target.value) : null)}
            />
            <Input value={currency} onChange={(event) => setCurrency(event.target.value)} />
          </div>
          <div className="text-sm text-subtle">
            {walletQuery.data ? `${walletQuery.data.balance_minor}` : locale === "fa" ? "موجودی" : "Balance"}
          </div>
          <div className="grid gap-2">
            {transactions.data?.map((tx: any) => (
              <div key={tx.wallet_tx_id} className="rounded-xl border border-border bg-white p-3 text-sm">
                {tx.amount_minor} - {tx.reason ?? ""}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "عملیات مالی" : "Finance ops"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              id="booking_id"
              type="number"
              placeholder="booking_id"
              value={bookingId ?? ""}
              onChange={(event) => setBookingId(event.target.value ? Number(event.target.value) : null)}
            />
            <Input id="amount_minor" type="number" placeholder="amount_minor" />
            <Input id="refund_wallet" type="number" placeholder="credit_wallet_user_id" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                refund.mutate({
                  booking_id: Number((document.getElementById("booking_id") as HTMLInputElement | null)?.value ?? 0),
                  currency_code: currency,
                  amount_minor: Number((document.getElementById("amount_minor") as HTMLInputElement | null)?.value ?? 0),
                  credit_wallet_user_id: Number((document.getElementById("refund_wallet") as HTMLInputElement | null)?.value ?? 0) || null
                })
              }
            >
              {locale === "fa" ? "ثبت بازپرداخت" : "Create refund"}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                payout.mutate({
                  payee_user_id: userId,
                  currency_code: currency,
                  amount_minor: Number((document.getElementById("amount_minor") as HTMLInputElement | null)?.value ?? 0)
                })
              }
            >
              {locale === "fa" ? "ثبت پرداخت" : "Create payout"}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                adjustment.mutate({
                  booking_id: bookingId,
                  currency_code: currency,
                  amount_minor: Number((document.getElementById("amount_minor") as HTMLInputElement | null)?.value ?? 0)
                })
              }
            >
              {locale === "fa" ? "تعدیل" : "Adjustment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پرداخت‌های رزرو" : "Booking payments"}</CardHeader>
        <CardContent className="space-y-2">
          {bookingPayments.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          )}
          {bookingPayments.data?.map((p: any) => (
            <div key={p.payment_id} className="rounded-xl border border-border bg-white p-3 text-sm">
              {p.amount_minor} {p.currency_code} - {p.status}
            </div>
          ))}
          {bookingLedger.data && (
            <div className="space-y-2">
              <div className="rounded-xl border border-border bg-white p-3 text-xs">
                {JSON.stringify(bookingLedger.data.pricing ?? {}, null, 2)}
              </div>
              <pre className="whitespace-pre-wrap text-xs text-subtle">{JSON.stringify(bookingLedger.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
