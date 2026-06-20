"use client";

import {
  AuthLayout,
  SignUpBrandPanel,
} from "@/components/auth/AuthLayout";
import { SignUpSteps } from "@/components/auth/SignUpSteps";
import {
  authBackLinkClass,
  authCardClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authPrimaryButtonClass,
  authWideCardClass,
} from "@/components/auth/auth-styles";
import { ONBOARDING_TOTAL_STEPS } from "@/lib/onboarding-routes";

type OnboardingStepShellProps = {
  currentStep: number;
  title: string;
  subtitle: string;
  onBack?: () => void;
  wide?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function OnboardingStepShell({
  currentStep,
  title,
  subtitle,
  onBack,
  wide = false,
  footer,
  children,
}: OnboardingStepShellProps) {
  return (
    <AuthLayout
      title={title}
      subtitle={`Step ${currentStep} of ${ONBOARDING_TOTAL_STEPS} — ${subtitle}`}
      leftContent={<SignUpBrandPanel />}
      contentMaxWidth={wide ? "xl" : "md"}
      alignTop={wide}
      footer={footer}
    >
      <div className={wide ? authWideCardClass : authCardClass}>
        <SignUpSteps currentStep={currentStep} />

        {onBack && (
          <button type="button" onClick={onBack} className={authBackLinkClass}>
            ← Back
          </button>
        )}

        {children}
      </div>
    </AuthLayout>
  );
}

export {
  authInputClass as onboardingInputClass,
  authInputErrorClass as onboardingInputErrorClass,
  authLabelClass as onboardingLabelClass,
  authPrimaryButtonClass as onboardingSubmitClass,
};
