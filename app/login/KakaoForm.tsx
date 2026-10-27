import Image from "next/image";

// 외부 인가 페이지로 리다이렉트하는 route handler라 클라이언트 라우팅(Link)이 아닌 일반 <a>로 이동한다
export default function KakaoForm() {
    return (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href="/api/oauth/kakao/start">
            <Image src="/kakao_login_light.svg" alt="카카오 로그인" width={30} height={30} />
        </a>
    )
}
