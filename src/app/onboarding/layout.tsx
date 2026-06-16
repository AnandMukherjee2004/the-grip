import { OnboardingProvider } from "@/context/OnboardingContext";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

