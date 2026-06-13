"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingStepShell,
  onboardingInputClass,
  onboardingInputErrorClass,
  onboardingLabelClass,
  onboardingSubmitClass,
} from "@/components/onboarding/OnboardingStepShell";

type Mode = "signup" | "signin";

type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type SignInValues = {
  email: string;
  password: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-400">{message}</p>;
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/80"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 3l18 18M10.5 10.7A3 3 0 0012 15a3 3 0 002.3-1M7.2 7.2C5.4 8.4 4 10 3 12c1.5 3 5 6 9 6 1.6 0 3.1-.4 4.4-1.1M14 5.2C13.4 5.1 12.7 5 12 5 8 5 4.5 8 3 12c.5 1 1.2 1.9 2 2.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M2 12C3.5 9 7 6 12 6s8.5 3 10 6c-1.5 3-5 6-10 6S3.5 15 2 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function OnboardingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [showPassword, setShowPassword] = useState(false);

  const [signUp, setSignUp] = useState<SignUpValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [signUpErrors, setSignUpErrors] = useState<
    Partial<Record<keyof SignUpValues, string>>
  >({});

  const [signIn, setSignIn] = useState<SignInValues>({
    email: "",
    password: "",
  });
  const [signInErrors, setSignInErrors] = useState<
    Partial<Record<keyof SignInValues, string>>
  >({});

  const switchMode = (next: Mode) => {
    setMode(next);
    setShowPassword(false);
    setSignUpErrors({});
    setSignInErrors({});
  };

  const validateSignUp = () => {
    const errors: Partial<Record<keyof SignUpValues, string>> = {};
    if (!signUp.firstName.trim()) errors.firstName = "First name is required";
    if (!signUp.lastName.trim()) errors.lastName = "Last name is required";
    if (!signUp.email.trim()) errors.email = "Work email is required";
    else if (!isValidEmail(signUp.email))
      errors.email = "Enter a valid email address";
    if (!signUp.password) errors.password = "Password is required";
    else if (signUp.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignIn = () => {
    const errors: Partial<Record<keyof SignInValues, string>> = {};
    if (!signIn.email.trim()) errors.email = "Work email is required";
    else if (!isValidEmail(signIn.email))
      errors.email = "Enter a valid email address";
    if (!signIn.password) errors.password = "Password is required";
    setSignInErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignUp()) router.push("/onboarding/business");
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignIn()) router.push("/onboarding/business");
  };

  return (
    <OnboardingStepShell
      currentStep={1}
      title={mode === "signup" ? "Create your account" : "Welcome back"}
    >
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`h-9 px-4 rounded-lg border text-xs font-semibold transition-all ${
            mode === "signup"
              ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
          }`}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`h-9 px-4 rounded-lg border text-xs font-semibold transition-all ${
            mode === "signin"
              ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
          }`}
        >
          Sign in
        </button>
      </div>

      {mode === "signup" ? (
        <form onSubmit={handleSignUpSubmit} className="space-y-5" noValidate>
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="firstName" className={onboardingLabelClass}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={signUp.firstName}
                  onChange={(e) =>
                    setSignUp((v) => ({ ...v, firstName: e.target.value }))
                  }
                  className={`${onboardingInputClass} ${signUpErrors.firstName ? onboardingInputErrorClass : ""}`}
                  placeholder="Jane"
                />
                <FieldError message={signUpErrors.firstName} />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className={onboardingLabelClass}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={signUp.lastName}
                  onChange={(e) =>
                    setSignUp((v) => ({ ...v, lastName: e.target.value }))
                  }
                  className={`${onboardingInputClass} ${signUpErrors.lastName ? onboardingInputErrorClass : ""}`}
                  placeholder="Doe"
                />
                <FieldError message={signUpErrors.lastName} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className={onboardingLabelClass}>
                Work Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={signUp.email}
                onChange={(e) =>
                  setSignUp((v) => ({ ...v, email: e.target.value }))
                }
                className={`${onboardingInputClass} ${signUpErrors.email ? onboardingInputErrorClass : ""}`}
                placeholder="you@company.com"
              />
              <FieldError message={signUpErrors.email} />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className={onboardingLabelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={signUp.password}
                  onChange={(e) =>
                    setSignUp((v) => ({ ...v, password: e.target.value }))
                  }
                  className={`${onboardingInputClass} pr-10 ${signUpErrors.password ? onboardingInputErrorClass : ""}`}
                  placeholder="Min. 8 characters"
                />
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>
              <FieldError message={signUpErrors.password} />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
            <button type="submit" className={onboardingSubmitClass}>
              Continue →
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignInSubmit} className="space-y-5" noValidate>
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2">
              <label htmlFor="signin-email" className={onboardingLabelClass}>
                Work Email
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={signIn.email}
                onChange={(e) =>
                  setSignIn((v) => ({ ...v, email: e.target.value }))
                }
                className={`${onboardingInputClass} ${signInErrors.email ? onboardingInputErrorClass : ""}`}
                placeholder="you@company.com"
              />
              <FieldError message={signInErrors.email} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className={onboardingLabelClass}>
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] text-white/40 transition-colors hover:text-white/70"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={signIn.password}
                  onChange={(e) =>
                    setSignIn((v) => ({ ...v, password: e.target.value }))
                  }
                  className={`${onboardingInputClass} pr-10 ${signInErrors.password ? onboardingInputErrorClass : ""}`}
                  placeholder="Your password"
                />
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>
              <FieldError message={signInErrors.password} />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
            <button type="submit" className={onboardingSubmitClass}>
              Sign in →
            </button>
          </div>
        </form>
      )}
    </OnboardingStepShell>
  );
}
