import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  const { locale } = params;

  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h1 className="page-title">Pet Care Marketplace</h1>
        <p className="mt-2 text-subtle">
          {locale === "fa"
            ? "بازاری امن برای مراقبت حرفه‌ای از حیوانات خانگی."
            : "A trusted marketplace for premium pet care."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/${locale}/search`}>{t("nav.search")}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/${locale}/provider/services`}>{t("nav.provider")}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/admin/review`}>{t("nav.admin")}</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: t("nav.search"), href: `/${locale}/search`, copy: "Search with trust" },
          { title: t("nav.messages"), href: `/${locale}/messages`, copy: "Secure messaging" },
          { title: t("nav.charity"), href: `/${locale}/charity`, copy: "Rescue support" }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader className="text-sm font-semibold">{item.title}</CardHeader>
            <CardContent className="text-sm text-subtle">
              <p>{locale === "fa" ? "تجربه ممتاز" : item.copy}</p>
              <Link className="mt-3 inline-block text-brand-700" href={item.href as any}>
                {locale === "fa" ? "مشاهده" : "View"}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
