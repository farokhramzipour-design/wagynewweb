"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function SitterCTA() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="container-page py-12">
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/40 bg-gradient-to-r from-indigo-500/10 via-fuchsia-400/10 to-amber-300/10 p-6 shadow-soft">
          <div>
            <h3 className="text-2xl font-semibold">
              {locale === "fa" ? "پرستار شوید و درآمد ثابت بسازید" : "Become a sitter and build steady income"}
            </h3>
            <p className="text-subtle">
              {locale === "fa" ? "پس از تایید، به پنل پرستار دسترسی دارید." : "After approval, you get sitter panel access."}
            </p>
          </div>
          <Button className="rounded-2xl" onClick={() => router.push(`/${locale}/sitter-onboarding/start` as any)}>
            {locale === "fa" ? "شروع درخواست" : "Start application"}
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
