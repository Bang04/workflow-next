import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import JoinForm from './JoinForm'

export default async function JoinPage() {
  // 이미 로그인된 사용자는 대시보드로 이동
  if (await auth()) redirect('/')

  return (
    <div className="flex h-full items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">회원가입</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">
          정보를 입력해 Crafboard 계정을 만드세요.
        </p>
        <JoinForm />
        <p className="mt-4 text-center text-sm text-zinc-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-zinc-900 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
