import { RequireOnboarding } from "@/components/guards-onboarding";

export default function SitterOnboardingLayout({ children }: { children: React.ReactNode }) {
  return <RequireOnboarding>{children}</RequireOnboarding>;
}
