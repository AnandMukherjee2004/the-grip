"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  OnboardingStepShell,
  onboardingInputClass,
  onboardingInputErrorClass,
  onboardingLabelClass,
  onboardingSubmitClass,
} from "@/components/onboarding/OnboardingStepShell";
import CustomSelect from "@/components/ui/CustomSelect";

import { useOnboarding } from "@/context/OnboardingContext";
import { API_URL } from "@/lib/api";
import { onboardingAccountUrl } from "@/lib/onboarding-routes";

type BusinessValues = {
  companyName: string;
  industry: string;
  teamSize: string;
  website: string;
};

const INDUSTRIES = [
  "SaaS",
  "E-Commerce",
  "Fintech",
  "Healthcare",
  "Logistics",
  "Real Estate",
  "Education",
  "Other",
] as const;

const TEAM_SIZES = [
  "Just me",
  "2–10",
  "11–50",
  "51–200",
  "200+",
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-400">{message}</p>;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: string;
}) {
  const selectOptions = options.map((opt) => ({ value: opt, label: opt }));
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={onboardingLabelClass}>
        {label}
      </label>
      <CustomSelect
        id={id}
        value={value}
        onChange={onChange}
        options={selectOptions}
        placeholder={placeholder}
        aria-label={label}
        className={error ? "custom-select--error" : ""}
      />
      <FieldError message={error} />
    </div>
  );
}

export default function OnboardingBusinessPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { setOrgId, setWorkspaceId } = useOnboarding();
  const [values, setValues] = useState<BusinessValues>({
    companyName: "",
    industry: "",
    teamSize: "",
    website: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessValues, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const next: Partial<Record<keyof BusinessValues, string>> = {};
    if (!values.companyName.trim())
      next.companyName = "Company name is required";
    if (!values.industry) next.industry = "Select an industry";
    if (!values.teamSize) next.teamSize = "Select a team size";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const sessionReady = status === "authenticated" && Boolean(session?.user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (status === "loading") return;

    if (!session?.user?.id) {
      router.push("/onboarding?mode=signin");
      return;
    }

    setIsLoading(true);
    setGlobalError("");

    const baseSlug = generateSlug(values.companyName);

    const callApi = async (slugToUse: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/v1/onboarding/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orgName: values.companyName,
            orgSlug: slugToUse,
            workspaceName: values.companyName,
            workspaceSlug: slugToUse,
            clerkOrgId: `na_${slugToUse}`,
            clerkUserId: session.user.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setOrgId(data.orgId);
          setWorkspaceId(data.workspaceId, values.companyName.trim());
          return true;
        }

        if (response.status === 409) {
          return false; // conflict, retry with suffix
        }

        throw new Error("API responded with an error");
      } catch (err) {
        throw err;
      }
    };

    try {
      const success = await callApi(baseSlug);
      if (success) {
        await update();
        router.push("/onboarding/tools");
        return;
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackSlug = `${baseSlug}-${randomSuffix}`;
      const successFallback = await callApi(fallbackSlug);
      if (successFallback) {
        await update();
        router.push("/onboarding/tools");
      } else {
        setGlobalError("Something went wrong, please try again");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Something went wrong, please try again");
      setIsLoading(false);
    }
  };

  return (
    <OnboardingStepShell
      currentStep={2}
      title="Tell us about your business"
      subtitle="We'll personalise Grip to your team's workflow."
      onBack={() => router.push(onboardingAccountUrl)}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {status === "loading" && (
          <p className="text-xs text-white/40">Setting up your session...</p>
        )}
        {!sessionReady && status === "unauthenticated" && (
          <p className="text-xs text-rose-400">Please sign in to continue.</p>
        )}
        {globalError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            ⚠️ {globalError}
          </div>
        )}
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <label htmlFor="companyName" className={onboardingLabelClass}>
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              disabled={isLoading}
              value={values.companyName}
              onChange={(e) =>
                setValues((v) => ({ ...v, companyName: e.target.value }))
              }
              className={`${onboardingInputClass} ${errors.companyName ? onboardingInputErrorClass : ""}`}
              placeholder="Acme Inc."
            />
            <FieldError message={errors.companyName} />
          </div>

          <SelectField
            id="industry"
            label="Industry"
            value={values.industry}
            onChange={(industry) => setValues((v) => ({ ...v, industry }))}
            options={INDUSTRIES}
            placeholder="Select industry"
            error={errors.industry}
          />

          <SelectField
            id="teamSize"
            label="Team Size"
            value={values.teamSize}
            onChange={(teamSize) => setValues((v) => ({ ...v, teamSize }))}
            options={TEAM_SIZES}
            placeholder="Select team size"
            error={errors.teamSize}
          />

          <div className="space-y-2">
            <label htmlFor="website" className={onboardingLabelClass}>
              Company Website
            </label>
            <input
              id="website"
              type="url"
              autoComplete="url"
              disabled={isLoading}
              value={values.website}
              onChange={(e) =>
                setValues((v) => ({ ...v, website: e.target.value }))
              }
              className={onboardingInputClass}
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
          <button
            type="submit"
            disabled={isLoading || status === "loading" || !sessionReady}
            className={`${onboardingSubmitClass} disabled:opacity-50 disabled:pointer-events-none`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Processing...
              </span>
            ) : (
              "Continue →"
            )}
          </button>
        </div>
      </form>
    </OnboardingStepShell>
  );
}
