import Link from "next/link";

export default function PublicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <div className="text-lg font-semibold">Wagy</div>
          <Link href={`/${locale}/auth` as any} className="text-sm text-brand-700">
            ورود
          </Link>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
