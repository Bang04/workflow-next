import type { OAuthProfile, OAuthProvider } from './types'

type KakaoMe = {
  id: number
  properties?: { nickname?: string }
  kakao_account?: {
    profile?: { nickname?: string }
    email?: string
    is_email_valid?: boolean
    is_email_verified?: boolean
  }
}

function getConfig() {
  const clientId = process.env.NEXT_PUBLIC_REST_API_KEY
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI
  if (!clientId || !redirectUri) {
    console.error('[kakao] NEXT_PUBLIC_REST_API_KEY / NEXT_PUBLIC_REDIRECT_URI 환경변수가 비어 있음')
    return null
  }
  return { clientId, redirectUri }
}

async function fetchProfile(code: string): Promise<OAuthProfile | null> {
  const config = getConfig()
  if (!config) return null

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code,
  })
  if (process.env.KAKAO_CLIENT_SECRET) body.set('client_secret', process.env.KAKAO_CLIENT_SECRET)

  const tokenRes = await fetch(
    process.env.NEXT_PUBLIC_TOKEN_URL || 'https://kauth.kakao.com/oauth/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body,
    },
  )
  if (!tokenRes.ok) {
    console.error('[kakao] token failed', tokenRes.status, await tokenRes.text())
    return null
  }
  const { access_token } = (await tokenRes.json()) as { access_token?: string }
  if (!access_token) return null

  const meRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!meRes.ok) {
    console.error('[kakao] me failed', meRes.status, await meRes.text())
    return null
  }
  const me = (await meRes.json()) as KakaoMe
  if (!me.id) return null

  const account = me.kakao_account
  return {
    providerId: String(me.id),
    email:
      account?.email && account.is_email_valid && account.is_email_verified
        ? account.email
        : null,
    name: account?.profile?.nickname ?? me.properties?.nickname ?? null,
  }
}

export const kakao: OAuthProvider = {
  id: 'kakao',
  label: '카카오',
  emailDomain: 'kakao.local',
  fallbackName: '카카오 사용자',
  authorizeUrl(state) {
    const config = getConfig()
    if (!config) return null
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state,
    })
    return `https://kauth.kakao.com/oauth/authorize?${params}`
  },
  fetchProfile,
}
