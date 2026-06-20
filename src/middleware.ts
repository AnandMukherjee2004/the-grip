import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth(function middleware(req) {
  const session = req.auth
  const hasSession = Boolean(session)
  const hasOrgMembership = Boolean(session?.user?.hasOrgMembership)
  const pathname = req.nextUrl.pathname
  const searchParams = req.nextUrl.searchParams

  // Legacy redirect: /onboarding → /sign-up or /sign-in
  if (pathname === '/onboarding') {
    const mode = searchParams.get('mode')
    if (mode === 'signin') return NextResponse.redirect(new URL('/sign-in', req.url))
    return NextResponse.redirect(new URL('/sign-up', req.url))
  }

  // Legacy onboarding tool steps → dashboard connectors
  if (pathname === '/onboarding/tools' || pathname === '/onboarding/connect') {
    return NextResponse.redirect(new URL('/dashboard/connectors', req.url))
  }

  const isDashboard = pathname.startsWith('/dashboard')
  const isOnboardingFlow = pathname.startsWith('/onboarding/business')
  const isSignIn = pathname === '/sign-in'
  const isSignUp = pathname === '/sign-up'

  // Protected routes: require session
  if ((isDashboard || isOnboardingFlow) && !hasSession) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // Dashboard requires org membership
  if (isDashboard && hasSession && !hasOrgMembership) {
    return NextResponse.redirect(new URL('/onboarding/business', req.url))
  }

  // Completed onboarding: keep users out of sign-up
  if (isSignUp && hasSession && hasOrgMembership) {
    return NextResponse.redirect(new URL('/dashboard/connectors', req.url))
  }

  // Mid-onboarding users can revisit step 1 (/sign-up) via back navigation
  if (isSignIn && hasSession) {
    const redirect = hasOrgMembership ? '/dashboard' : '/onboarding/business'
    return NextResponse.redirect(new URL(redirect, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
