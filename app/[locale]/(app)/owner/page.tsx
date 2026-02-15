import Link from "next/link";

export default function OwnerDashboard({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return (
    <div className="space-y-4">
      <h1 className="page-title">داشبورد مالک</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <Link className="card p-4" href={`/${locale}/owner/bookings` as any}>رزروها</Link>
        <Link className="card p-4" href={`/${locale}/owner/messages` as any}>پیام‌ها</Link>
        <Link className="card p-4" href={`/${locale}/owner/pets` as any}>حیوانات</Link>
      </div>
    </div>
  );
}
