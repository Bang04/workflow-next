import { Suspense } from 'react'
import Link from 'next/link'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getProvider } from '@/lib/oauth'
import LoginForm from './LoginForm'

// auth()는 prerender 중 호출할 수 없으므로 connection()으로 요청 시점까지 미룬다
async function RedirectIfLoggedIn() {
  await connection()
  if (await auth()) redirect('/')
  return null
}

// ?error=<provider> → "<표시 이름> 로그인에 실패했습니다"
async function SocialError({ searchParams }: { searchParams: PageProps<'/login'>['searchParams'] }) {
  const { error } = await searchParams
  const provider = typeof error === 'string' ? getProvider(error) : null
  if (!provider) return null

  return (
    <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
      {provider.label} 로그인에 실패했습니다. 다시 시도해주세요.
    </p>
  )
}

export default function LoginPage({ searchParams }: PageProps<'/login'>) {
  return (
    <div className="flex h-full items-center justify-center bg-zinc-100 p-4">
      {/* 이미 로그인된 사용자는 대시보드로 이동 */}
      <Suspense>
        <RedirectIfLoggedIn />
      </Suspense>
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">로그인</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">
          계정 정보를 입력해 Crafboard에 접속하세요.
        </p>
        <Suspense>
          <SocialError searchParams={searchParams} />
        </Suspense>
        <LoginForm />
        <Link
          href="/join"
          className="mt-3 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          회원가입
        </Link>
      </div>
    </div>
  )
}
