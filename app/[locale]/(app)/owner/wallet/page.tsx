"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { wallet } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function WalletPage() {
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
            {walletQuery.data
              ? `${locale === "fa" ? "موجودی" : "Balance"}: ${walletQuery.data.balance_minor}`
              : locale === "fa"
                ? "اطلاعات را وارد کنید."
                : "Enter details to view wallet."}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "تراکنش‌ها" : "Transactions"}</CardHeader>
        <CardContent className="space-y-3">
          {transactions.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          )}
          {transactions.data?.map((tx: any) => (
            <div key={tx.wallet_tx_id} className="flex items-center justify-between rounded-xl border border-border bg-white p-3 text-sm">
              <div>
                <div className="font-semibold">{tx.amount_minor}</div>
                <div className="text-xs text-subtle">{tx.reason ?? "-"}</div>
              </div>
              <Badge>{tx.wallet_tx_id}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
