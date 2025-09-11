import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '../generated/prisma/client.js'
import Google from '@auth/core/providers/google'
import GitHub from '@auth/core/providers/github'
import {
  AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} from '../config/env.js'
import Credentials from '@auth/core/providers/credentials'
import { compare } from 'bcrypt'

const prisma = new PrismaClient()

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    }),
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.password) {
          return null
        }
        const passwordMatch = await compare(credentials.password, user.password)
        if (!passwordMatch) {
          return null
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session ({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  secret: AUTH_SECRET,
  trustHost: true
}
