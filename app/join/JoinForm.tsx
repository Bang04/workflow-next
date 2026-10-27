'use client'

import { useActionState } from 'react'
import { join } from './actions'

const inputClass =
  'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
const labelClass = 'text-sm font-medium text-zinc-700'

export default function JoinForm() {
  const [state, action, pending] = useActionState(join, undefined)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className={labelClass}>
          이름
        </label>
        <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className={labelClass}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className={labelClass}>
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={4}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passwordConfirm" className={labelClass}>
          비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}
