"use client";

import { useRouter } from "next/navigation";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { useGripEffects } from "@/hooks/useGripEffects";

const TOTAL_STEPS = 3;

type OnboardingStepShellProps = {
  currentStep: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightWide?: boolean;
  fullWidthPanel?: boolean;
  bottomPadding?: string;
  children: React.ReactNode;
};

export function OnboardingStepShell({
  currentStep,
  title,
  subtitle,
  onBack,
  rightWide = false,
  fullWidthPanel = false,
  bottomPadding = "pb-24",
  children,
}: OnboardingStepShellProps) {
  const router = useRouter();
  useGripEffects();

  return (
    <main
      className={`min-h-screen bg-[#040409] text-[#d0d0e8] relative ${bottomPadding} overflow-x-hidden font-sans flex flex-col`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/[0.03] blur-[160px] pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-white/[0.03] shrink-0">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] transform group-hover:rotate-6 transition-transform duration-300" />
          <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">
            GRIP
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xs font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to Home
        </button>
      </header>

      <div className="w-full max-w-7xl mx-auto px-6 flex-1 flex flex-col lg:flex-row items-center lg:items-stretch gap-4 lg:gap-6 md:pt-2 relative z-10">
        <div className="w-full lg:w-[60%] flex flex-col justify-center lg:pr-8 demo-solution-wrapper">
          <SolutionSection />
        </div>

        <div
          className={`w-full flex flex-col justify-center mr-5 ${
            rightWide ? "lg:w-[55%]" : "lg:w-[40%]"
          }`}
        >
          <div
            className={`w-full relative ${fullWidthPanel ? "lg:max-w-none" : "max-w-lg lg:ml-auto"}`}
          >
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
                {subtitle && (
                  <p className="mt-1.5 text-xs text-white/45 leading-relaxed">{subtitle}</p>
                )}
              </div>

              <div className="flex gap-1 shrink-0">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      n <= currentStep ? "bg-indigo-500" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-4 text-xs text-white/40 transition-colors hover:text-white/70"
              >
                ← Back
              </button>
            )}

            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export const onboardingInputClass =
  "w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all";

export const onboardingInputErrorClass =
  "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20";

export const onboardingLabelClass =
  "block text-[11px] font-semibold text-white/60 uppercase tracking-wider";

export const onboardingSubmitClass =
  "flex-1 h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.2)]";
