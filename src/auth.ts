import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq, or } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '@/db/index'
import { users, accounts, sessions, verificationTokens, orgMembers } from '@/db/schema'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)

        if (!user || !user.passwordHash) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      if (token.id) {
        const [membership] = await db
          .select({ orgId: orgMembers.orgId })
          .from(orgMembers)
          .where(
            or(
              eq(orgMembers.userId, token.id as string),
              eq(orgMembers.clerkUserId, token.id as string),
            ),
          )
          .limit(1)

        token.hasOrgMembership = Boolean(membership)
      }

      return token
    },
  },
})

