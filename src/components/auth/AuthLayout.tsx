"use client";

import Link from "next/link";

type ContentMaxWidth = "md" | "lg" | "xl";

const maxWidthClasses: Record<ContentMaxWidth, string> = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  leftContent: React.ReactNode;
  children: React.ReactNode;
  contentMaxWidth?: ContentMaxWidth;
  alignTop?: boolean;
  footer?: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  leftContent,
  children,
  contentMaxWidth = "md",
  alignTop = false,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="auth-page min-h-screen bg-white flex font-geist text-gray-900">
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gray-50 border-r border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-50/20 rounded-full blur-[80px] pointer-events-none -z-10" />
        <div className="flex flex-col justify-between p-12 xl:p-16 w-full relative z-10">
          {leftContent}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-5 lg:px-10 shrink-0">
          <Link href="/" className="font-bricolage font-bold text-xl tracking-tight text-gray-900">
            GRIP
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            Back to home
          </Link>
        </header>

        <div
          className={`flex-1 flex justify-center px-6 py-8 lg:py-12 ${
            alignTop ? "items-start" : "items-center"
          } ${footer ? "pb-28" : ""}`}
        >
          <div className={`w-full ${maxWidthClasses[contentMaxWidth]}`}>
            <div className="mb-6 lg:hidden">
              <Link href="/" className="font-bricolage font-bold text-2xl tracking-tight text-gray-900">
                GRIP
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="font-bricolage text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{subtitle}</p>
              )}
            </div>

            {children}
          </div>
        </div>

        {footer}
      </div>
    </div>
  );
}

export function SignUpBrandPanel() {
  const bullets = [
    "Connect CRMs, ad platforms & payment tools",
    "Unified lead tracking with full audit trail",
    "Live revenue analytics in ₹ INR",
  ];

  return (
    <>
      <div className="space-y-6 max-w-lg">
        <div>
          <p className="font-bricolage text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            GRIP
          </p>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Your revenue pipeline, finally in one place.
          </p>
        </div>

        <ul className="space-y-3">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="mt-0.5 text-emerald-600 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <blockquote className="max-w-md border-l-2 border-gray-200 pl-4">
        <p className="text-sm text-gray-600 italic">
          &ldquo;We replaced 5 spreadsheets with Grip in a week.&rdquo;
        </p>
        <footer className="mt-2 text-xs text-gray-400">Sales lead, SaaS startup</footer>
      </blockquote>
    </>
  );
}

export function SignInBrandPanel() {
  return (
    <>
      <div className="space-y-4 max-w-lg">
        <p className="font-bricolage text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
          Welcome back.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          Your pipeline is live. Your data is waiting.
        </p>
      </div>

      <div className="max-w-md">
        <p className="text-sm text-gray-500">
          Sign in to pick up where you left off — leads, payments, and connectors synced in one dashboard.
        </p>
      </div>
    </>
  );
}
