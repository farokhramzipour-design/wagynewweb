import dayjs from "dayjs";

export function formatDate(date?: string, locale: "fa" | "en" = "fa") {
  if (!date) return "";
  const instance = dayjs(date);
  return instance.format(locale === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD");
}
