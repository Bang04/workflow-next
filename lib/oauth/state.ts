import type { OAuthProviderId } from './types'

// 인가 요청 → 콜백까지 state 쿠키 유효 시간(초)
export const STATE_MAX_AGE = 10 * 60

export function stateCookieName(provider: OAuthProviderId) {
  return `oauth_state_${provider}`
}
