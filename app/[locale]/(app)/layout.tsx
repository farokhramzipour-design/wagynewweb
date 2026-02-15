import { RequireAuth } from "@/components/guards";
import { AppShellApp } from "@/components/app-shell-app";

export default function AppLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <RequireAuth>
      <AppShellApp locale={params.locale}>{children}</AppShellApp>
    </RequireAuth>
  );
}
