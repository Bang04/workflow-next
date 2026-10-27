import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { getProvider } from '@/lib/oauth'
import { stateCookieName } from '@/lib/oauth/state'

// 소셜 로그인 인가 코드 수신 → auth.ts의 provider(authorize)에서 토큰 교환/계정 연결/로그인 처리
export async function GET(request: NextRequest, ctx: RouteContext<'/api/oauth/[provider]'>) {
  const { provider: providerId } = await ctx.params
  const provider = getProvider(providerId)
  if (!provider) return new Response(null, { status: 404 })

  const { searchParams, origin } = request.nextUrl
  const failure = Response.redirect(new URL(`/login?error=${provider.id}`, origin))

  // start 라우트가 심어 둔 state 쿠키는 일회용이므로 읽자마자 지운다
  const cookieStore = await cookies()
  const name = stateCookieName(provider.id)
  const savedState = cookieStore.get(name)?.value
  cookieStore.delete(name)

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  // TODO: 확인용 임시 로그 (확인 후 삭제)
  console.log(`[oauth:${provider.id}] callback`, {
    code,
    state,
    savedState,
    stateMatch: state === savedState,
    error: searchParams.get('error'),
    error_description: searchParams.get('error_description'),
  })

  // 동의 취소 등: ?error=access_denied (code 없음), state 불일치는 CSRF 의심
  if (!code || !state || !savedState || state !== savedState) return failure

  try {
    // 성공 시 redirectTo로 이동 (내부적으로 redirect 예외를 던짐)
    await signIn(provider.id, { code, state, redirectTo: '/' })
  } catch (error) {
    // 인증 실패(authorize가 null 반환)만 에러 페이지로, 나머지(redirect 포함)는 다시 던짐
    if (error instanceof AuthError) return failure
    throw error
  }
}
