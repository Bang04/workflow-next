import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { PROVIDERS } from '@/lib/oauth'
import { findOrCreateUser } from '@/lib/oauth/link-account'

type Role = 'admin' | 'user'

// 세션/토큰에 role, userId를 담기 위한 타입 확장
declare module 'next-auth' {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      id: string
      role: Role
    } & import('next-auth').DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId: string
    role: Role
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 }, // 기존과 동일하게 1시간
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      // 로그인 검증: DB에서 email로 조회 후 bcrypt로 비밀번호 비교. 성공 시 user 객체, 실패 시 null
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        const [user] = await db.select().from(users).where(eq(users.email, email))
        if (!user) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        return { id: String(user.id), name: user.name, email: user.email, role: user.role }
      },
    }),
    // 소셜 로그인(kakao, naver): /api/oauth/[provider] 라우트가 받은 인가 코드를 provider에 직접 검증하므로 위조 불가
    ...Object.values(PROVIDERS).map((provider) =>
      Credentials({
        id: provider.id,
        credentials: { code: { type: 'text' }, state: { type: 'text' } },
        async authorize(credentials) {
          const code = String(credentials?.code ?? '')
          const state = String(credentials?.state ?? '')
          if (!code) return null

          const profile = await provider.fetchProfile(code, state)

          // TODO: 확인용 임시 로그 (확인 후 삭제)
          console.log(`[oauth:${provider.id}] profile`, profile)

          if (!profile) return null

          const user = await findOrCreateUser(provider, profile)
          if (!user) return null

          return { id: String(user.id), name: user.name, email: user.email, role: user.role }
        },
      }),
    ),
  ],
  callbacks: {
    // 로그인 직후에만 user가 넘어옴 → 토큰에 id, role 저장
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id as string
        token.role = user.role
      }
      return token
    },
    // 토큰 값을 session.user에 노출
    session({ session, token }) {
      session.user.id = token.userId
      session.user.role = token.role
      return session
    },
  },
})
