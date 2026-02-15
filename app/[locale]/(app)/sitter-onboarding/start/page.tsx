import Link from "next/link";

export default function SitterOnboardingStart({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return (
    <div className="space-y-4">
      <h1 className="page-title">شروع راه‌اندازی</h1>
      <p className="text-subtle">خدماتی که می‌خواهید ارائه دهید را انتخاب کنید.</p>
      <Link className="text-brand-700" href={`/${locale}/sitter-onboarding/services` as any}>ادامه</Link>
    </div>
  );
}
