'use server'

import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { and, eq, gt, isNull, or } from 'drizzle-orm'
import { AuthError } from 'next-auth'
import { Resend } from 'resend'
import { signIn } from '@/auth'
import { db } from '@/db/index'
import { users, orgMembers, passwordResetTokens } from '@/db/schema'

export async function signUpAction(data: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<{ success?: boolean; error?: string }> {
  try {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1)

    if (existing) {
      return { error: 'An account with this email already exists.' }
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    await db.insert(users).values({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email.toLowerCase(),
      passwordHash,
    })

    await signIn('credentials', {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
    })

    return { success: true }
  } catch (err) {
    console.error('signUpAction error:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function signInAction(data: {
  email: string
  password: string
}): Promise<{ redirect?: string; error?: string }> {
  try {
    await signIn('credentials', {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
    })

    const [userRecord] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1)

    if (!userRecord) return { error: 'Account not found.' }

    const [membership] = await db
      .select({ orgId: orgMembers.orgId })
      .from(orgMembers)
      .where(
        or(
          eq(orgMembers.userId, userRecord.id),
          eq(orgMembers.clerkUserId, userRecord.id),
        ),
      )
      .limit(1)

    if (membership) {
      return { redirect: '/dashboard' }
    }

    return { redirect: '/onboarding/business' }
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Incorrect email or password.' }
    }
    console.error('signInAction error:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}

// ── Forgot Password ──────────────────────────────────────
// Generates a reset token and emails the user.
// Always returns success to prevent email enumeration.
export async function forgotPasswordAction(
  email: string
): Promise<{ success: true }> {
  try {
    const [user] = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (!user) return { success: true }

    await db
      .delete(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          isNull(passwordResetTokens.usedAt)
        )
      )

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    })

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('forgotPasswordAction error: RESEND_API_KEY is not configured')
      return { success: true }
    }

    const resend = new Resend(apiKey)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${token}`
    const templateId = process.env.RESEND_TEMPLATE_ID
    const recipientName = user.name ?? 'there'
    const firstName = recipientName.split(' ')[0] ?? recipientName
    const fromEmail = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

    const sendResult = templateId
      ? await resend.emails.send({
          from: fromEmail,
          to: user.email!,
          subject: 'Reset your Grip password',
          template: {
            id: templateId,
            variables: {
              first_name: firstName,
              reset_url: resetUrl,
              app_name: 'Grip',
              email: user.email!,
            },
          },
        })
      : await resend.emails.send({
          from: fromEmail,
          to: user.email!,
          subject: 'Reset your Grip password',
          html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#07070E;color:#F0F0FF;border-radius:12px;">
            <h1 style="font-size:20px;font-weight:800;margin-bottom:8px;color:#F0F0FF;">Reset your password</h1>
            <p style="font-size:14px;color:#9292AA;margin-bottom:24px;">
              Hi ${recipientName}, we received a request to reset your Grip password.
              Click the button below. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;background:#6366F1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
              Reset password
            </a>
            <p style="font-size:12px;color:#4A4A6A;margin-top:24px;">
              If you didn't request this, you can safely ignore this email.
            </p>
            <p style="font-size:12px;color:#4A4A6A;margin-top:8px;">
              Or copy this link: <span style="color:#818CF8;">${resetUrl}</span>
            </p>
          </div>
        `,
        })

    if (sendResult.error) {
      console.error('forgotPasswordAction Resend error:', sendResult.error)
    }
  } catch (err) {
    console.error('forgotPasswordAction error:', err)
  }

  return { success: true }
}

// ── Reset Password ────────────────────────────────────────
// Validates the token and updates the user's password.
export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<{ success?: boolean; error?: string }> {
  if (!token || !newPassword) {
    return { error: 'Invalid request.' }
  }

  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  try {
    const [resetRecord] = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
        usedAt: passwordResetTokens.usedAt,
      })
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!resetRecord) {
      return { error: 'This reset link is invalid or has already been used.' }
    }

    if (resetRecord.usedAt) {
      return { error: 'This reset link has already been used.' }
    }

    if (new Date() > resetRecord.expiresAt) {
      return { error: 'This reset link has expired. Please request a new one.' }
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, resetRecord.userId))

      await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.id, resetRecord.id))
    })

    return { success: true }
  } catch (err) {
    console.error('resetPasswordAction error:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}
