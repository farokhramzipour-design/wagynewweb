"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { clearSession } from "@/lib/auth/session";

export function AvatarMenu() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="h-7 w-7 rounded-full bg-brand-100 text-center text-xs font-semibold text-brand-700 leading-7">U</span>
        <span className="text-subtle">{locale === "fa" ? "حساب کاربری" : "Account"}</span>
      </button>
      {open ? (
        <div className="absolute end-0 mt-2 w-48 rounded-2xl border border-border bg-white p-2 text-sm shadow-soft">
          <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href={`/${locale}/owner` as any}>
            {locale === "fa" ? "پنل مالک" : "Owner panel"}
          </Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-muted" href={`/${locale}/owner/profile` as any}>
            {locale === "fa" ? "پروفایل" : "Profile"}
          </Link>
          <button
            className="w-full rounded-xl px-3 py-2 text-start text-danger hover:bg-danger/10"
            onClick={() => {
              clearSession();
              window.location.href = `/${locale}/auth`;
            }}
          >
            {locale === "fa" ? "خروج" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
