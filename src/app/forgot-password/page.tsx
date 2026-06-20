'use client'

import Link from 'next/link'
import { useState } from 'react'
import { forgotPasswordAction } from '@/app/actions/auth'
import {
  AuthLayout,
  SignInBrandPanel,
} from '@/components/auth/AuthLayout'
import { FieldError } from '@/components/auth/FieldError'
import {
  authCardClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authPrimaryButtonClass,
} from '@/components/auth/auth-styles'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ForgotPasswordPage() {
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
    <AuthLayout
      title={sent ? 'Check your inbox' : 'Forgot password?'}
      subtitle={
        sent
          ? `If ${email} is registered, you'll receive a reset link shortly.`
          : "Enter your work email and we'll send a reset link."
      }
      leftContent={<SignInBrandPanel />}
    >
      <div className={authCardClass}>
        {!sent ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className={authLabelClass}>
                Work Email
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                autoComplete="email"
                className={`${authInputClass} ${emailError ? authInputErrorClass : ''}`}
              />
              <FieldError message={emailError} />
            </div>

            <button type="submit" disabled={loading} className={authPrimaryButtonClass}>
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
              <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/sign-in" className="text-gray-900 font-semibold hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
