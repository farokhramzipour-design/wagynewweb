"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { media, users } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AccountPage() {
  const locale = useLocale();
  const [userId, setUserId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const me = useQuery({
    queryKey: ["user", "me", userId],
    queryFn: () => users.getMe(userId as number),
    enabled: Boolean(userId)
  });

  const profile = useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () => users.getProfile(userId as number),
    enabled: Boolean(userId)
  });

  const updateProfile = useMutation({
    mutationFn: (payload: Record<string, unknown>) => users.updateProfile(userId as number, payload)
  });

  const requestAvatarUpload = useMutation({
    mutationFn: () =>
      media.uploadUrl({
        media_type: "avatar",
        storage_key: `avatars/${userId}-${Date.now()}`,
        url: avatarUrl
      }),
    onSuccess: (data: any) => {
      if (data?.media?.media_id && userId) {
        updateProfile.mutate({ avatar_media_id: data.media.media_id });
      }
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-sm font-semibold">{locale === "fa" ? "پروفایل" : "Profile"}</CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="user_id"
            value={userId ?? ""}
            onChange={(event) => setUserId(event.target.value ? Number(event.target.value) : null)}
          />
          <div className="text-sm text-subtle">
            {me.data ? `#${me.data.user_id} ${me.data.phone_e164}` : locale === "fa" ? "شناسه کاربر را وارد کنید" : "Enter user id"}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder={locale === "fa" ? "نام" : "First name"}
              defaultValue={profile.data?.first_name ?? ""}
              onBlur={(event) => updateProfile.mutate({ first_name: event.target.value })}
            />
            <Input
              placeholder={locale === "fa" ? "نام خانوادگی" : "Last name"}
              defaultValue={profile.data?.last_name ?? ""}
              onBlur={(event) => updateProfile.mutate({ last_name: event.target.value })}
            />
            <Input
              placeholder={locale === "fa" ? "تاریخ تولد" : "Date of birth"}
              defaultValue={profile.data?.date_of_birth ?? ""}
              onBlur={(event) => updateProfile.mutate({ date_of_birth: event.target.value })}
            />
            <Input
              placeholder={locale === "fa" ? "بیو" : "Bio"}
              defaultValue={profile.data?.bio ?? ""}
              onBlur={(event) => updateProfile.mutate({ bio: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder={locale === "fa" ? "آدرس آواتار" : "Avatar URL"}
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
            />
            <Button disabled={!userId || !avatarUrl} onClick={() => requestAvatarUpload.mutate()}>
              {locale === "fa" ? "درخواست آپلود" : "Request upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
