"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signUpAction } from "@/app/actions/auth";
import {
  AuthLayout,
  SignUpBrandPanel,
} from "@/components/auth/AuthLayout";
import { FieldError } from "@/components/auth/FieldError";
import { SignUpSteps } from "@/components/auth/SignUpSteps";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import {
  authCardClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authPrimaryButtonClass,
  authServerErrorClass,
} from "@/components/auth/auth-styles";

type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitName(fullName?: string | null) {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const hasAccount = status === "authenticated" && Boolean(session?.user?.id);

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
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!session?.user) return;

    const { firstName, lastName } = splitName(session.user.name);
    setSignUp({
      firstName,
      lastName,
      email: session.user.email ?? "",
      password: "",
    });
  }, [session]);

  const validateSignUp = () => {
    const errors: Partial<Record<keyof SignUpValues, string>> = {};
    if (!signUp.firstName.trim()) errors.firstName = "First name is required";
    if (!signUp.lastName.trim()) errors.lastName = "Last name is required";
    if (!signUp.email.trim()) errors.email = "Work email is required";
    else if (!isValidEmail(signUp.email))
      errors.email = "Enter a valid email address";
    if (!hasAccount) {
      if (!signUp.password) errors.password = "Password is required";
      else if (signUp.password.length < 8)
        errors.password = "Password must be at least 8 characters";
    }
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    router.push("/onboarding/business");
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasAccount) {
      handleContinue();
      return;
    }

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

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Step 1 of 2 — tell us who you are."
      leftContent={<SignUpBrandPanel />}
    >
      <div className={authCardClass}>
        <SignUpSteps currentStep={1} />

        <form onSubmit={handleSignUpSubmit} className="space-y-5" noValidate>
          {serverError && <div className={authServerErrorClass}>{serverError}</div>}

          {hasAccount && (
            <p className="text-xs text-gray-500">
              Your account is set up. Review your details or continue to the next step.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={authLabelClass}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                readOnly={hasAccount}
                value={signUp.firstName}
                onChange={(e) =>
                  setSignUp((v) => ({ ...v, firstName: e.target.value }))
                }
                className={`${authInputClass} ${signUpErrors.firstName ? authInputErrorClass : ""} ${hasAccount ? "bg-gray-50 text-gray-700" : ""}`}
                placeholder="Jane"
              />
              <FieldError message={signUpErrors.firstName} />
            </div>
            <div>
              <label htmlFor="lastName" className={authLabelClass}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                readOnly={hasAccount}
                value={signUp.lastName}
                onChange={(e) =>
                  setSignUp((v) => ({ ...v, lastName: e.target.value }))
                }
                className={`${authInputClass} ${signUpErrors.lastName ? authInputErrorClass : ""} ${hasAccount ? "bg-gray-50 text-gray-700" : ""}`}
                placeholder="Doe"
              />
              <FieldError message={signUpErrors.lastName} />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className={authLabelClass}>
              Work Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              readOnly={hasAccount}
              value={signUp.email}
              onChange={(e) =>
                setSignUp((v) => ({ ...v, email: e.target.value }))
              }
              className={`${authInputClass} ${signUpErrors.email ? authInputErrorClass : ""} ${hasAccount ? "bg-gray-50 text-gray-700" : ""}`}
              placeholder="you@company.com"
            />
            <FieldError message={signUpErrors.email} />
          </div>

          {!hasAccount && (
            <div>
              <label htmlFor="signup-password" className={authLabelClass}>
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
                  className={`${authInputClass} pr-10 ${signUpErrors.password ? authInputErrorClass : ""}`}
                  placeholder="Min. 8 characters"
                />
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>
              <FieldError message={signUpErrors.password} />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || status === "loading"}
            className={authPrimaryButtonClass}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </>
            ) : (
              "Continue →"
            )}
          </button>
        </form>

        {!hasAccount && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-gray-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
