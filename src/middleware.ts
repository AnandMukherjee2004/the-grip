import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth(function middleware(req) {
  const session = req.auth
  const hasSession = Boolean(session)
  const hasOrgMembership = Boolean(session?.user?.hasOrgMembership)
  const pathname = req.nextUrl.pathname
  const isOnboardingBack = req.nextUrl.searchParams.get('from') === 'onboarding'

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

  if (isAuthPage && hasSession && !isOnboardingBack) {
    const redirectPath = hasOrgMembership ? '/dashboard' : '/onboarding/business'
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api/auth|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}



