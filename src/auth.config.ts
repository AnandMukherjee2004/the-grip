import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [] as any[],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string
        session.user.hasOrgMembership = Boolean(token.hasOrgMembership)
      }
      return session
    },
  },
} satisfies NextAuthConfig
