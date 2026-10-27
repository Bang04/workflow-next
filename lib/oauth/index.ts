import { kakao } from './kakao'
import { naver } from './naver'
import type { OAuthProvider, OAuthProviderId } from './types'

export const PROVIDERS: Record<OAuthProviderId, OAuthProvider> = { kakao, naver }

// URL 세그먼트 등 외부 입력이 지원하는 provider인지 확인
export function getProvider(id: string): OAuthProvider | null {
  return Object.hasOwn(PROVIDERS, id) ? PROVIDERS[id as OAuthProviderId] : null
}
