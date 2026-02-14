import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locales.includes(locale as any) ? locale : defaultLocale;
  const messages = (await import(`@/messages/${resolvedLocale}.json`)).default;
  return {
    locale: resolvedLocale,
    messages
  };
});
