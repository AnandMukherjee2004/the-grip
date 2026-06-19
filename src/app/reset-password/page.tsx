'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPasswordAction } from '@/app/actions/auth'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      router.replace('/forgot-password')
    }
  }, [token, router])

  const validate = () => {
    const next: typeof errors = {}
    if (!password) next.password = 'Password is required'
    else if (password.length < 8) next.password = 'Minimum 8 characters'
    if (!confirm) next.confirm = 'Please confirm your password'
    else if (confirm !== password) next.confirm = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    const result = await resetPasswordAction(token, password)

    if (result.error) {
      setServerError(result.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/onboarding?reset=success'), 2000)
  }

  if (!token) return null

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
              <span className="font-display text-lg font-extrabold leading-none tracking-tight text-[#F0F0FF]"
                style={{ textShadow: '0 0 10px rgba(99,102,241,0.75)' }}>
                G
              </span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-[#F0F0FF]">Grip</span>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-[#F0F0FF]">Password updated</h2>
              <p className="text-sm text-[#9292AA]">Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold tracking-tight text-[#F0F0FF]">
                  Set new password
                </h1>
                <p className="mt-1 text-sm text-[#9292AA]">
                  Choose a strong password for your Grip account.
                </p>
              </div>

              {serverError && (
                <div className="mb-4 rounded-lg border border-[#FB7185]/20 bg-[#FB7185]/[0.08] px-3 py-2">
                  <p className="text-xs text-[#FB7185]">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9292AA]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) setErrors((p) => ({ ...p, password: '' }))
                      }}
                      autoComplete="new-password"
                      className={`w-full rounded-lg border bg-[#07070E] px-3 py-2.5 pr-10 text-sm text-[#F0F0FF] placeholder-[#4A4A6A] outline-none transition-all duration-150 ${
                        errors.password
                          ? 'border-[#FB7185]/50 focus:border-[#FB7185] focus:ring-1 focus:ring-[#FB7185]/20'
                          : 'border-[#1E1E35] hover:border-[#3A3A5C] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A6A] hover:text-[#9292AA] transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-[#FB7185] flex items-center gap-1.5">
                      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#9292AA]">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value)
                      if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' }))
                    }}
                    autoComplete="new-password"
                    className={`w-full rounded-lg border bg-[#07070E] px-3 py-2.5 text-sm text-[#F0F0FF] placeholder-[#4A4A6A] outline-none transition-all duration-150 ${
                      errors.confirm
                        ? 'border-[#FB7185]/50 focus:border-[#FB7185] focus:ring-1 focus:ring-[#FB7185]/20'
                        : 'border-[#1E1E35] hover:border-[#3A3A5C] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25'
                    }`}
                  />
                  {errors.confirm && (
                    <p className="text-xs text-[#FB7185] flex items-center gap-1.5">
                      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {errors.confirm}
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
                      Updating...
                    </span>
                  ) : (
                    'Update password'
                  )}
                </button>
              </form>
            </>
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
