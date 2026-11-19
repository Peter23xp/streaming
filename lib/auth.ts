import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Nodemailer from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const emailSignInEnabled = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_SERVER !== 'REPLACE_ME')

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Required behind Coolify's Traefik proxy, and lets local dev run on any port.
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...(emailSignInEnabled
      ? [Nodemailer({ server: process.env.EMAIL_SERVER, from: 'noreply@streamvf.com' })]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user && user) session.user.id = user.id
      return session
    },
  },
})
