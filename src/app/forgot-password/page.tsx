'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { forgotPasswordAction } from '@/app/actions/auth'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Work email is required')
      return
    }
    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address')
      return
    }

    setLoading(true)
    await forgotPasswordAction(email)
    setLoading(false)
    setSent(true)
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center p-4"
      style={{ background: '#07070E' }}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 35% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl border border-[#1E1E35] bg-[#0F0F1A] p-8"
          style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.05), 0 24px 64px rgba(0,0,0,0.6)' }}
        >
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#26263F] bg-[#07070E]"
              style={{ boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}
            >
              <span
                className="font-display text-lg font-extrabold leading-none tracking-tight text-[#F0F0FF]"
                style={{ textShadow: '0 0 10px rgba(99,102,241,0.75)' }}
              >
                G
              </span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-[#F0F0FF]">Grip</span>
          </div>

          {!sent ? (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold tracking-tight text-[#F0F0FF]">
                  Forgot password?
                </h1>
                <p className="mt-1 text-sm text-[#9292AA]">
                  Enter your work email and we'll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9292AA]">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    autoComplete="email"
                    className={`w-full rounded-lg border bg-[#07070E] px-3 py-2.5 text-sm text-[#F0F0FF] placeholder-[#4A4A6A] outline-none transition-all duration-150 ${
                      emailError
                        ? 'border-[#FB7185]/50 focus:border-[#FB7185] focus:ring-1 focus:ring-[#FB7185]/20'
                        : 'border-[#1E1E35] hover:border-[#3A3A5C] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25'
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-[#FB7185] flex items-center gap-1.5">
                      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-[#818CF8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/50"
                  style={loading ? {} : { boxShadow: '0 0 22px rgba(99,102,241,0.28)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-[#F0F0FF]">Check your inbox</h2>
                <p className="mt-2 text-sm text-[#9292AA]">
                  If <span className="text-[#F0F0FF]">{email}</span> is registered, you'll receive a reset link in the next minute.
                </p>
              </div>
              <p className="text-xs text-[#4A4A6A]">Didn't receive it? Check your spam folder.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/onboarding"
              className="text-xs text-[#9292AA] hover:text-[#818CF8] transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
