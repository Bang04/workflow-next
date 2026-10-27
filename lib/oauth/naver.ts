import type { OAuthProfile, OAuthProvider } from './types'

type NaverMe = {
  resultcode?: string
  response?: { id?: string; email?: string; name?: string; nickname?: string }
}

function getConfig() {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) {
    console.error(
      '[naver] NEXT_PUBLIC_NAVER_CLIENT_ID / NAVER_CLIENT_SECRET / NEXT_PUBLIC_NAVER_REDIRECT_URI 환경변수가 비어 있음',
    )
    return null
  }
  return { clientId, clientSecret, redirectUri }
}

async function fetchProfile(code: string, state: string): Promise<OAuthProfile | null> {
  const config = getConfig()
  if (!config) return null

  // 네이버는 토큰 요청에도 인가 요청 때 쓴 state를 요구한다
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    state,
  })
  const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body,
  })
  if (!tokenRes.ok) {
    console.error('[naver] token failed', tokenRes.status, await tokenRes.text())
    return null
  }
  // 실패해도 200으로 { error, error_description }이 올 수 있다
  const token = (await tokenRes.json()) as {
    access_token?: string
    error?: string
    error_description?: string
  }
  if (!token.access_token) {
    console.error('[naver] token error', token.error, token.error_description)
    return null
  }

  const meRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
  if (!meRes.ok) {
    console.error('[naver] me failed', meRes.status, await meRes.text())
    return null
  }
  const me = (await meRes.json()) as NaverMe
  const profile = me.response
  if (me.resultcode !== '00' || !profile?.id) {
    console.error('[naver] me error', me.resultcode)
    return null
  }

  // 네이버는 인증된 이메일만 제공한다
  return {
    providerId: profile.id,
    email: profile.email ?? null,
    name: profile.name ?? profile.nickname ?? null,
  }
}

export const naver: OAuthProvider = {
  id: 'naver',
  label: '네이버',
  emailDomain: 'naver.local',
  fallbackName: '네이버 사용자',
  authorizeUrl(state) {
    const config = getConfig()
    if (!config) return null
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state,
    })
    return `https://nid.naver.com/oauth2.0/authorize?${params}`
  },
  fetchProfile,
}
