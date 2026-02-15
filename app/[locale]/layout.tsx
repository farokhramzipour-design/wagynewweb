import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers";
import { defaultLocale, localeDir, locales } from "@/lib/i18n/config";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  const dir = localeDir[locale as keyof typeof localeDir] ?? localeDir[defaultLocale];

  return (
    <div lang={locale} dir={dir} className={dir === "rtl" ? "rtl" : "ltr"}>
      <Providers locale={locale} messages={messages}>{children}</Providers>
    </div>
  );
}
