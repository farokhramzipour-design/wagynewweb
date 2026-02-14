import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export function formatDate(date?: string, locale: "fa" | "en" = "fa") {
  if (!date) return "";
  const instance = locale === "fa" ? dayjs(date).calendar("jalali") : dayjs(date);
  return instance.format(locale === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD");
}
