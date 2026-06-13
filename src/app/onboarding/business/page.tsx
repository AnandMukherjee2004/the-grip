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
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={onboardingLabelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${onboardingInputClass} appearance-none pr-10 ${error ? onboardingInputErrorClass : ""} ${!value ? "text-white/20" : ""}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0c0f20] text-white">
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <FieldError message={error} />
    </div>
  );
}

export default function OnboardingBusinessPage() {
  const router = useRouter();
  const [values, setValues] = useState<BusinessValues>({
    companyName: "",
    industry: "",
    teamSize: "",
    website: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessValues, string>>
  >({});

  const validate = () => {
    const next: Partial<Record<keyof BusinessValues, string>> = {};
    if (!values.companyName.trim())
      next.companyName = "Company name is required";
    if (!values.industry) next.industry = "Select an industry";
    if (!values.teamSize) next.teamSize = "Select a team size";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) router.push("/onboarding/tools");
  };

  return (
    <OnboardingStepShell
      currentStep={2}
      title="Tell us about your business"
      subtitle="We'll personalise Grip to your team's workflow."
      onBack={() => router.back()}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <label htmlFor="companyName" className={onboardingLabelClass}>
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
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
          <button type="submit" className={onboardingSubmitClass}>
            Continue →
          </button>
        </div>
      </form>
    </OnboardingStepShell>
  );
}
