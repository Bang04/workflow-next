'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'

export type LoginState = { error?: string } | undefined

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' }
  }

  try {
    // 성공 시 redirectTo로 이동 (내부적으로 redirect 예외를 던짐)
    await signIn('credentials', { email, password, redirectTo: '/' })
  } catch (error) {
    // 인증 실패(authorize가 null 반환)만 메시지로 처리, 나머지(redirect 포함)는 다시 던짐
    if (error instanceof AuthError) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' })
}
