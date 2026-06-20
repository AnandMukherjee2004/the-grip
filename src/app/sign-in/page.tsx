"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import {
  AuthLayout,
  SignInBrandPanel,
} from "@/components/auth/AuthLayout";
import { FieldError } from "@/components/auth/FieldError";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import {
  authCardClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authPrimaryButtonClass,
  authServerErrorClass,
} from "@/components/auth/auth-styles";
import { persistWorkspaceIds } from "@/lib/workspace-session";

type SignInValues = {
  email: string;
  password: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function SignInPageInner() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [signIn, setSignIn] = useState<SignInValues>({ email: "", password: "" });
  const [signInErrors, setSignInErrors] = useState<
    Partial<Record<keyof SignInValues, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(
    searchParams.get("reset") === "success",
  );

  useEffect(() => {
    setResetSuccess(searchParams.get("reset") === "success");
  }, [searchParams]);

  const validateSignIn = () => {
    const errors: Partial<Record<keyof SignInValues, string>> = {};
    if (!signIn.email.trim()) errors.email = "Work email is required";
    else if (!isValidEmail(signIn.email))
      errors.email = "Enter a valid email address";
    if (!signIn.password) errors.password = "Password is required";
    setSignInErrors(errors);
    return Object.keys(errors).length === 0;
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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Grip dashboard."
      leftContent={<SignInBrandPanel />}
    >
      <div className={authCardClass}>
        {resetSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
            Password updated. Sign in with your new password.
          </div>
        )}

        <form onSubmit={handleSignInSubmit} className="space-y-5" noValidate>
          {serverError && <div className={authServerErrorClass}>{serverError}</div>}

          <div className="space-y-1.5">
            <label htmlFor="signin-email" className={authLabelClass}>
              Work Email
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={signIn.email}
              onChange={(e) => setSignIn((v) => ({ ...v, email: e.target.value }))}
              className={`${authInputClass} ${signInErrors.email ? authInputErrorClass : ""}`}
              placeholder="you@company.com"
            />
            <FieldError message={signInErrors.email} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="signin-password" className={authLabelClass}>
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
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
                className={`${authInputClass} pr-10 ${signInErrors.password ? authInputErrorClass : ""}`}
                placeholder="Your password"
              />
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            </div>
            <FieldError message={signInErrors.password} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={authPrimaryButtonClass}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in →"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New to Grip?{" "}
          <Link href="/sign-up" className="text-gray-900 font-semibold hover:underline">
            Create an account →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInPageInner />
    </Suspense>
  );
}
