"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { charity } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty";
import { ErrorState } from "@/components/ui/error";

export default function CharityPage() {
  const locale = useLocale();
  const cases = useQuery({ queryKey: ["charity", "cases", "active"], queryFn: () => charity.listCases("active") });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">{locale === "fa" ? "پرونده‌های حمایتی" : "Charity cases"}</h1>
        <p className="text-sm text-subtle">
          {locale === "fa" ? "کمک به درمان و نجات حیوانات." : "Support rescue and treatment."}
        </p>
      </div>

      {cases.isError && (
        <ErrorState title={locale === "fa" ? "خطا در دریافت" : "Load failed"} />
      )}
      {cases.isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      )}
      {cases.data?.length === 0 && (
        <EmptyState title={locale === "fa" ? "پرونده‌ای نیست" : "No cases"} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {cases.data?.map((item) => {
          const progress = item.target_amount_minor
            ? Math.min(100, Math.round((item.collected_amount_minor / item.target_amount_minor) * 100))
            : 0;
          return (
            <Card key={item.charity_case_id}>
              <CardHeader className="text-sm font-semibold">{item.title}</CardHeader>
              <CardContent className="space-y-3 text-sm text-subtle">
                <div>{item.description ?? (locale === "fa" ? "توضیحات ندارد." : "No description.")}</div>
                <div className="flex items-center gap-2">
                  <Badge>{locale === "fa" ? "فعال" : "Active"}</Badge>
                  <Badge className="bg-green-100 text-success">{progress}%</Badge>
                </div>
                <div className="h-2 rounded-full bg-border">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
                </div>
                <Link className="text-brand-700" href={`/${locale}/owner/charity/${item.charity_case_id}` as any}>
                  {locale === "fa" ? "مشاهده پرونده" : "View case"}
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
