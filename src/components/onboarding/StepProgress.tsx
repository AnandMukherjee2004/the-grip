"use client";

import { OnboardingStep } from "@/types/onboarding";
import { CheckIcon } from "@/components/ui/CheckIcon";

interface StepProgressProps {
  currentStep: number;
  steps: OnboardingStep[];
}

export function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 select-none">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-white/10 text-xs md:text-sm font-light">→</span>
            )}
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-300 ${
                isCurrent
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.08)]"
                  : isCompleted
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-white/[0.02] text-white/30 border-transparent"
              }`}
            >
              {isCompleted ? (
                <CheckIcon className="w-3 h-3 stroke-[3]" />
              ) : (
                <span className={`w-3.5 h-3.5 flex items-center justify-center rounded-md text-[9px] font-bold ${
                  isCurrent ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-white/40"
                }`}>
                  {step.id}
                </span>
              )}
              <span>{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
