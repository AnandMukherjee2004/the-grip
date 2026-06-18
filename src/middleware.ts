import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const pathname = req.nextUrl.pathname

  const protectedPrefixes = [
    '/dashboard',
    '/onboarding/business',
    '/onboarding/tools',
    '/onboarding/connect',
  ]

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  const isAuthPage = pathname === '/onboarding'

  if (isProtected && !token) {
    const url = new URL('/onboarding', req.url)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && token) {
    const url = new URL('/dashboard', req.url)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
