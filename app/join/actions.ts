'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export type JoinState = { error?: string } | undefined

export async function join(
  _prevState: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '')

  if (!name || !email || !password || !passwordConfirm) {
    return { error: '모든 항목을 입력해주세요.' }
  }
  if (password.length < 4) {
    return { error: '비밀번호는 4자 이상이어야 합니다.' }
  }
  if (password !== passwordConfirm) {
    return { error: '비밀번호가 일치하지 않습니다.' }
  }
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
  if (existing) {
    return { error: '이미 가입된 이메일입니다.' }
  }

  try {
    await db.insert(users).values({
      email,
      name,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'user',
    })
  } catch (error) {
    // 동시 가입 등으로 unique 제약에 걸린 경우
    if ((error as { code?: string }).code === '23505') {
      return { error: '이미 가입된 이메일입니다.' }
    }
    throw error
  }

  try {
    // 가입 직후 자동 로그인
    await signIn('credentials', { email, password, redirectTo: '/' })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: '가입은 완료되었으나 로그인에 실패했습니다. 로그인 페이지를 이용해주세요.' }
    }
    throw error
  }
}
