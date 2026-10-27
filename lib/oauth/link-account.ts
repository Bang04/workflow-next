import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import type { OAuthProfile, OAuthProvider, OAuthProviderId } from './types'

// provider별로 users의 어느 컬럼에 소셜 id를 저장하는지 (이 매핑만 provider마다 다르다)
const ID_COLUMNS = {
  kakao: { column: users.kakaoId, values: (id: string) => ({ kakaoId: id }) },
  naver: { column: users.naverId, values: (id: string) => ({ naverId: id }) },
} satisfies Record<OAuthProviderId, unknown>

// 1) 소셜 id로 연결된 계정 → 2) 검증된 이메일이 같은 기존 계정에 연결 → 3) 신규 가입
// 로그인 불가(이메일 충돌)면 null
export async function findOrCreateUser(provider: OAuthProvider, profile: OAuthProfile) {
  const { column, values } = ID_COLUMNS[provider.id]
  const socialId = profile.providerId

  let [user] = await db.select().from(users).where(eq(column, socialId))

  if (!user && profile.email) {
    ;[user] = await db
      .update(users)
      .set(values(socialId))
      .where(and(eq(users.email, profile.email), isNull(column)))
      .returning()
  }

  if (!user) {
    // 비밀번호 로그인 불가능한 랜덤 해시
    const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10)
    ;[user] = await db
      .insert(users)
      .values({
        email: profile.email ?? `${provider.id}_${socialId}@${provider.emailDomain}`,
        name: profile.name ?? provider.fallbackName,
        passwordHash,
        ...values(socialId),
      })
      .onConflictDoNothing()
      .returning()
    // 같은 이메일의 계정이 이미 다른 소셜 id에 연결돼 있으면 충돌 → 로그인 거부
    if (!user) return null
  }

  return user
}
