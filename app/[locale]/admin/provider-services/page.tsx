import Link from "next/link";

export default function AdminProviderServices({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return (
    <div className="space-y-4">
      <h1 className="page-title">Provider Services</h1>
      <p className="text-subtle">Review service-level approvals.</p>
      <Link className="text-brand-700" href={`/${locale}/admin/provider-services/1` as any}>Open sample review</Link>
    </div>
  );
}
