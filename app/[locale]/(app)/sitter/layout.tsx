import { RequireProviderApproved } from "@/components/guards";

export default function SitterLayout({ children }: { children: React.ReactNode }) {
  return <RequireProviderApproved>{children}</RequireProviderApproved>;
}
