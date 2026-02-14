"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { favorites } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);

  const list = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => favorites.list(userId as number),
    enabled: Boolean(userId)
  });

  const addMutation = useMutation({
    mutationFn: () => favorites.add({ user_id: userId as number, provider_id: providerId as number }),
    onMutate: async () => {
      if (!userId || !providerId) return;
      await queryClient.cancelQueries({ queryKey: ["favorites", userId] });
      const previous = queryClient.getQueryData(["favorites", userId]) as any[] | undefined;
      queryClient.setQueryData(["favorites", userId], [...(previous ?? []), { provider_id: providerId }]);
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["favorites", userId], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
  });

  const removeMutation = useMutation({
    mutationFn: () => favorites.remove(userId as number, providerId as number),
    onMutate: async () => {
      if (!userId || !providerId) return;
      await queryClient.cancelQueries({ queryKey: ["favorites", userId] });
      const previous = queryClient.getQueryData(["favorites", userId]) as any[] | undefined;
      queryClient.setQueryData(
        ["favorites", userId],
        (previous ?? []).filter((item) => item.provider_id !== providerId)
      );
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["favorites", userId], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "علاقه‌مندی‌ها" : "Favorites"}</CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              type="number"
              placeholder="user_id"
              value={userId ?? ""}
              onChange={(event) => setUserId(event.target.value ? Number(event.target.value) : null)}
            />
            <Input
              type="number"
              placeholder="provider_id"
              value={providerId ?? ""}
              onChange={(event) => setProviderId(event.target.value ? Number(event.target.value) : null)}
            />
          </div>
          <div className="flex gap-2">
            <Button disabled={!userId || !providerId} onClick={() => addMutation.mutate()}>
              {locale === "fa" ? "افزودن" : "Add"}
            </Button>
            <Button variant="ghost" disabled={!userId || !providerId} onClick={() => removeMutation.mutate()}>
              {locale === "fa" ? "حذف" : "Remove"}
            </Button>
          </div>
          <div className="grid gap-2">
            {list.isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            )}
            {list.data?.map((item: any, index: number) => (
              <div key={`${item.provider_id}-${index}`} className="rounded-xl border border-border bg-white p-3 text-sm">
                Provider #{item.provider_id}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
