"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_STEP_PATHS } from "@/lib/onboarding-routes";

interface SignUpStepsProps {
  currentStep: number;
  steps?: string[];
}

const DEFAULT_STEPS = ["Account", "Business"];

export function SignUpSteps({
  currentStep,
  steps = DEFAULT_STEPS,
}: SignUpStepsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const canNavigate = stepNumber <= currentStep;
        const path = ONBOARDING_STEP_PATHS[index];

        const stepContent = (
          <>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                stepNumber <= currentStep
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {stepNumber}
            </span>
            <span className="hidden sm:block">{step}</span>
          </>
        );

        return (
          <React.Fragment key={step}>
            {canNavigate ? (
              <button
                type="button"
                onClick={() => {
                  if (path) router.push(path);
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isCurrent ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {stepContent}
              </button>
            ) : (
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold text-gray-300 cursor-default`}
              >
                {stepContent}
              </span>
            )}
            {index < steps.length - 1 && (
              <span className="flex-1 h-px bg-gray-100 min-w-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
