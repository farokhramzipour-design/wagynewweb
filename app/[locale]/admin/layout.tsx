import { RequireAdmin } from "@/components/guards";
import Link from "next/link";

export default function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-[#f1f2f6]">
        <header className="border-b border-border bg-[#1f2430] text-white">
          <div className="container-page flex items-center justify-between py-4">
            <div className="text-lg font-semibold">Admin</div>
            <Link href={`/${locale}/owner` as any} className="text-sm">
              Exit
            </Link>
          </div>
        </header>
        <div className="container-page grid gap-6 py-8 md:grid-cols-[220px_1fr]">
          <aside className="rounded-xl border border-border bg-white p-3">
            <nav className="flex flex-col gap-2 text-sm">
              <Link href={`/${locale}/admin` as any}>Overview</Link>
              <Link href={`/${locale}/admin/providers` as any}>Providers</Link>
              <Link href={`/${locale}/admin/provider-services` as any}>Provider Services</Link>
              <Link href={`/${locale}/admin/bookings` as any}>Bookings</Link>
              <Link href={`/${locale}/admin/payments` as any}>Payments</Link>
              <Link href={`/${locale}/admin/moderation` as any}>Moderation</Link>
              <Link href={`/${locale}/admin/charity` as any}>Charity</Link>
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </RequireAdmin>
  );
}
