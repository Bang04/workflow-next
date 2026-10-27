export type OAuthProviderId = 'kakao' | 'naver'

// provider마다 다른 응답을 이 형태로 맞춘다. email은 provider가 검증했다고 보증한 값만 담는다.
export type OAuthProfile = {
  providerId: string
  email: string | null
  name: string | null
}

export type OAuthProvider = {
  id: OAuthProviderId
  // 에러 문구 등에 쓰는 표시 이름
  label: string
  // 이메일이 없을 때 임시 이메일(<id>@<emailDomain>)과 이름 기본값
  emailDomain: string
  fallbackName: string
  // state는 CSRF 방지용 랜덤 값 (/api/oauth/[provider]/start에서 발급)
  authorizeUrl(state: string): string | null
  // 인가 코드 → 토큰 → 사용자 정보. 실패 시 원인을 서버 로그에 남기고 null
  fetchProfile(code: string, state: string): Promise<OAuthProfile | null>
}
