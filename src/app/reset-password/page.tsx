'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPasswordAction } from '@/app/actions/auth'
import {
  AuthLayout,
  SignInBrandPanel,
} from '@/components/auth/AuthLayout'
import { FieldError } from '@/components/auth/FieldError'
import { PasswordToggle } from '@/components/auth/PasswordToggle'
import {
  authCardClass,
  authInputClass,
  authInputErrorClass,
  authLabelClass,
  authPrimaryButtonClass,
  authServerErrorClass,
} from '@/components/auth/auth-styles'

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
    setTimeout(() => router.push('/sign-in?reset=success'), 2000)
  }

  if (!token) return null

  return (
    <AuthLayout
      title={success ? 'Password updated' : 'Set new password'}
      subtitle={
        success
          ? 'Redirecting you to sign in...'
          : 'Choose a strong password for your Grip account.'
      }
      leftContent={<SignInBrandPanel />}
    >
      <div className={authCardClass}>
        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
              <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {serverError && <div className={authServerErrorClass}>{serverError}</div>}

            <div>
              <label htmlFor="new-password" className={authLabelClass}>
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }))
                  }}
                  autoComplete="new-password"
                  className={`${authInputClass} pr-10 ${errors.password ? authInputErrorClass : ''}`}
                />
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>
              <FieldError message={errors.password} />
            </div>

            <div>
              <label htmlFor="confirm-password" className={authLabelClass}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' }))
                }}
                autoComplete="new-password"
                className={`${authInputClass} ${errors.confirm ? authInputErrorClass : ''}`}
              />
              <FieldError message={errors.confirm} />
            </div>

            <button type="submit" disabled={loading} className={authPrimaryButtonClass}>
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Updating...
                </>
              ) : (
                'Update password'
              )}
            </button>
          </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
