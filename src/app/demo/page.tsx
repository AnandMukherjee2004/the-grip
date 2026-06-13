"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { useRevlineEffects } from "@/hooks/useRevlineEffects";

export default function DemoPage() {
  const router = useRouter();
  useRevlineEffects();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [challenge, setChallenge] = useState("");
  const [timeline, setTimeline] = useState("");

  // Step wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const companySizes = ["1–10", "11–50", "51–200", "200+"];
  const industries = ["SaaS", "E-commerce", "Real Estate", "Finance", "Healthcare", "Other"];
  const challenges = [
    "Siloed tools & fragmented data",
    "Inaccurate revenue forecasting",
    "High customer churn & leakage",
    "Manual data entry & operational overhead",
    "Lack of real-time visibility for executives"
  ];
  const timelines = [
    { value: "Immediately", label: "Immediately" },
    { value: "Within a month", label: "Within a month" },
    { value: "Just exploring", label: "Just exploring" }
  ];

  // Steps configuration
  const steps = [
    { number: 1, title: "Personal Details", description: "Who are we speaking with?" },
    { number: 2, title: "Company Details", description: "Tell us about your business." },
    { number: 3, title: "Demo Context", description: "Customize your walkthrough." }
  ];

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!fullName.trim() || !email.trim()) {
        setErrorMessage("Please enter your name and work email.");
        return false;
      }
      if (!email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return false;
      }
    } else if (step === 2) {
      if (!companyName.trim() || !companySize || !industry) {
        setErrorMessage("Please fill in all company information.");
        return false;
      }
    } else if (step === 3) {
      if (!challenge || !timeline) {
        setErrorMessage("Please select your challenge and timeline.");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsSubmitting(true);

    // Simulate premium submission animation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#040409] text-[#d0d0e8] relative pb-24 overflow-x-hidden font-sans flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Dynamic Ambient Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/[0.03] blur-[160px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-white/[0.03] shrink-0">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] transform group-hover:rotate-6 transition-transform duration-300" />
          <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">GRIP</span>
        </div>

        <button
          onClick={() => router.push("/")}
          className="text-xs font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Back to Home
        </button>
      </header>

      {/* Main Two-Column Layout */}
      <div className="w-full max-w-7xl mx-auto px-6 flex-1 flex flex-col lg:flex-row items-center lg:items-stretch gap-4 lg:gap-6 md:pt-2 relative z-10">

        {/* Left Side Content - Solution Component */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center lg:pr-8 demo-solution-wrapper">
          <SolutionSection />
        </div>

        {/* Right Side Form (Wizard Card) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center mr-5">
          {!submitSuccess ? (
            <div className="w-full max-w-lg lg:ml-auto relative">

              {/* Step indicator header */}
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Step {currentStep} of 3
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {steps[currentStep - 1].title}
                  </h3>
                </div>

                {/* Horizontal Progress bar */}
                <div className="flex gap-1">
                  {steps.map((s) => (
                    <div
                      key={s.number}
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${s.number <= currentStep ? "bg-indigo-500" : "bg-white/10"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* STEP 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Anand Mukherjee"
                        className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">Work Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="anand@company.com"
                        className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Company Details */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">Company Name</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Grip Technologies"
                        className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">Company Size</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {companySizes.map((size) => (
                          <button
                            type="button"
                            key={size}
                            onClick={() => setCompanySize(size)}
                            className={`h-11 rounded-lg border text-xs font-semibold transition-all ${companySize === size
                              ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                              : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">Industry</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {industries.map((ind) => (
                          <button
                            type="button"
                            key={ind}
                            onClick={() => setIndustry(ind)}
                            className={`h-11 rounded-lg border text-xs font-semibold transition-all ${industry === ind
                              ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                              : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                              }`}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Demo Context */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-2 relative">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">Biggest Challenge</label>
                      <div>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full h-11 px-4 rounded-lg bg-black/40 border text-left text-sm flex items-center justify-between transition-all ${isDropdownOpen
                            ? "border-indigo-500 ring-1 ring-indigo-500/20"
                            : "border-white/10 hover:border-white/20"
                            } ${challenge ? "text-white" : "text-white/30"}`}
                        >
                          <span className="truncate pr-4">{challenge || "Select your top challenge"}</span>
                          <span className={`text-[10px] text-white/40 transition-transform duration-200 shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`}>
                            ▼
                          </span>
                        </button>

                        {isDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20 cursor-default"
                              onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="absolute left-0 right-0 mt-1.5 rounded-lg border border-white/[0.08] bg-[#0c0f20]/95 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-30 overflow-hidden divide-y divide-white/[0.04]">
                              {challenges.map((c) => (
                                <button
                                  type="button"
                                  key={c}
                                  onClick={() => {
                                    setChallenge(c);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-xs transition-colors flex items-center justify-between ${challenge === c
                                    ? "bg-indigo-600/20 text-white font-medium"
                                    : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                                >
                                  <span className="truncate pr-2">{c}</span>
                                  {challenge === c && <span className="text-emerald-400 shrink-0">✓</span>}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider">When to start</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {timelines.map((tl) => (
                          <button
                            type="button"
                            key={tl.value}
                            onClick={() => setTimeline(tl.value)}
                            className={`h-11 rounded-lg border text-xs font-semibold transition-all ${timeline === tl.value
                              ? "bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                              : "bg-black/20 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                              }`}
                          >
                            {tl.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-3 border-t border-white/[0.04]">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 h-11 rounded-lg border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-xs font-semibold transition-all"
                    >
                      Back
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          Securing slots...
                        </>
                      ) : (
                        "Submit Request →"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            /* Success confirmation card on the right */
            <div className="w-full max-w-lg lg:ml-auto">
              <div className="text-center mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-md text-indigo-400">📅</span>
                </div>
                <h2 className="font-display text-xl font-bold text-white mb-1 leading-tight">
                  Schedule Your Walkthrough
                </h2>
                <p className="text-white/50 text-[11px] max-w-sm mx-auto">
                  Select a convenient slot below to secure your personalized demo. Your information has been pre-filled.
                </p>
              </div>

              {/* Inline Calendly Widget */}
              <div className="w-full h-[520px] rounded-xl overflow-hidden border border-white/[0.08] bg-black/30 relative">
                <iframe
                  src={`https://calendly.com/anandmukherjee2004/new-meeting?embed_domain=localhost&embed_type=Inline&name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="w-full h-full"
                  title="Calendly Scheduler"
                />
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-[11px] transition-all border border-white/5"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
