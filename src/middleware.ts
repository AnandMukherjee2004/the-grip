import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })
  const pathname = req.nextUrl.pathname
  const hasSession = Boolean(token)
  const hasOrgMembership = Boolean(token?.hasOrgMembership)

  const isDashboard = pathname.startsWith('/dashboard')
  const isOnboardingFlow = ['/onboarding/business', '/onboarding/tools', '/onboarding/connect'].some((p) =>
    pathname.startsWith(p),
  )
  const isAuthPage = pathname === '/onboarding'

  if ((isDashboard || isOnboardingFlow) && !hasSession) {
    return NextResponse.redirect(new URL('/onboarding?mode=signin', req.url))
  }

  if (isDashboard && hasSession && !hasOrgMembership) {
    return NextResponse.redirect(new URL('/onboarding/business', req.url))
  }

  if (isAuthPage && hasSession) {
    const redirectPath = hasOrgMembership ? '/dashboard' : '/onboarding/business'
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}


