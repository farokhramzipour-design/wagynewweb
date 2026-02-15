"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const locale = pathname.split("/").filter(Boolean)[0] ?? "";

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace((`/${locale}/auth?redirect=${encodeURIComponent(pathname)}`) as any);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}

export function RequireProviderApproved({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const locale = pathname.split("/").filter(Boolean)[0] ?? "";

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace((`/${locale}/auth?redirect=${encodeURIComponent(pathname)}`) as any);
      return;
    }
    if (session.provider_status !== "approved") {
      router.replace((`/${locale}/sitter-onboarding/status`) as any);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const locale = pathname.split("/").filter(Boolean)[0] ?? "";

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace((`/${locale}/auth?redirect=${encodeURIComponent(pathname)}`) as any);
      return;
    }
    if (!session.is_admin) {
      router.replace((`/${locale}/owner`) as any);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
