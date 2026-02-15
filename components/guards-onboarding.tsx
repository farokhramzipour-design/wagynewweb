"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] ?? "";

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace((`/${locale}/auth?redirect=${encodeURIComponent(pathname)}`) as any);
      return;
    }
    if (session.provider_status === "approved") {
      router.replace((`/${locale}/sitter`) as any);
    }
  }, [locale, pathname, router]);

  return <>{children}</>;
}
