import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getProvider } from '@/lib/oauth'
import { STATE_MAX_AGE, stateCookieName } from '@/lib/oauth/state'

// 로그인 버튼 진입점: CSRF 방지용 state를 발급해 쿠키에 저장하고 provider 인가 페이지로 이동
export async function GET(request: NextRequest, ctx: RouteContext<'/api/oauth/[provider]/start'>) {
  const { provider: providerId } = await ctx.params
  const provider = getProvider(providerId)
  if (!provider) return new Response(null, { status: 404 })

  const state = randomBytes(16).toString('hex')
  const authorizeUrl = provider.authorizeUrl(state)
  // 환경변수 누락 등 설정 오류
  if (!authorizeUrl) return NextResponse.redirect(new URL(`/login?error=${provider.id}`, request.nextUrl.origin))

  // TODO: 확인용 임시 로그 (확인 후 삭제)
  console.log(`[oauth:${provider.id}] start`, { state, authorizeUrl })

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set(stateCookieName(provider.id), state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/oauth',
    maxAge: STATE_MAX_AGE,
  })
  return response
}
