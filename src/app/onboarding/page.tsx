"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  OnboardingStepShell,
  onboardingInputClass,
  onboardingInputErrorClass,
  onboardingLabelClass,
  onboardingSubmitClass,
} from "@/components/onboarding/OnboardingStepShell";
import { signUpAction, signInAction } from "@/app/actions/auth";
import { persistWorkspaceIds } from "@/lib/workspace-session";

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

function getModeFromSearchParams(searchParams: ReturnType<typeof useSearchParams>): Mode {
  if (searchParams.get("mode") === "signin") return "signin";
  if (searchParams.get("reset") === "success") return "signin";
  return "signup";
}

function OnboardingPageInner() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(() => getModeFromSearchParams(searchParams));
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
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(
    searchParams.get("reset") === "success"
  );

  useEffect(() => {
    setResetSuccess(searchParams.get("reset") === "success");
    setMode(getModeFromSearchParams(searchParams));
  }, [searchParams]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setShowPassword(false);
    setSignUpErrors({});
    setSignInErrors({});
    setServerError("");
    setIsLoading(false);
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

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setIsLoading(true);
    setServerError("");

    const result = await signUpAction({
      firstName: signUp.firstName,
      lastName: signUp.lastName,
      email: signUp.email,
      password: signUp.password,
    });

    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }

    window.location.href = "/onboarding/business";
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsLoading(true);
    setServerError("");

    const result = await signInAction({
      email: signIn.email,
      password: signIn.password,
    });

    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }

    if (result.orgId && result.workspaceId) {
      persistWorkspaceIds(result.orgId, result.workspaceId);
      if (result.workspaceName) {
        localStorage.setItem(
          "grip_workspaces",
          JSON.stringify([{ id: result.workspaceId, name: result.workspaceName }]),
        );
      }
    }

    window.location.href = result.redirect ?? "/dashboard";
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

      {resetSuccess && mode === "signin" && (
        <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-2">
          <p className="text-xs text-emerald-400 font-medium">
            ✓ Password updated. Sign in with your new password.
          </p>
        </div>
      )}

      {mode === "signup" ? (
        <form onSubmit={handleSignUpSubmit} className="space-y-5" noValidate>
          {serverError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {serverError}
            </div>
          )}
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
            <button
              type="submit"
              disabled={isLoading}
              className={`${onboardingSubmitClass} disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  {mode === "signup" ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                mode === "signup" ? "Continue →" : "Sign in →"
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignInSubmit} className="space-y-5" noValidate>
          {serverError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {serverError}
            </div>
          )}
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
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-white/40 transition-colors hover:text-white/70"
                >
                  Forgot password?
                </Link>
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
            <button
              type="submit"
              disabled={isLoading}
              className={`${onboardingSubmitClass} disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </div>
        </form>
      )}
    </OnboardingStepShell>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingPageInner />
    </Suspense>
  );
}
