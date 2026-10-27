'use client'

import { useActionState, useEffect, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import { memberColors } from '@/lib/constants'
import type { Member } from '@/lib/types'
import { createMember, updateMember } from './actions'

const inputClass =
  'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
const labelClass = 'text-sm font-medium text-zinc-700'

type MemberDialogProps = {
  // 없으면 생성, 있으면 수정
  member?: Member
  onClose: () => void
}

export default function MemberDialog({ member, onClose }: MemberDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, action, pending] = useActionState(
    member ? updateMember.bind(null, member.id) : createMember,
    undefined,
  )

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  useEffect(() => {
    if (state?.success) onClose()
  }, [state, onClose])

  const name = member?.name ?? ''

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-sm rounded-xl border border-zinc-200 p-0 shadow-xl backdrop:bg-black/30"
    >
      <form action={action} className="space-y-4 p-5">
        <h2 className="text-base font-semibold text-zinc-900">
          {member ? '멤버 수정' : '멤버 추가'}
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="member-name" className={labelClass}>
            이름
          </label>
          <input
            id="member-name"
            name="name"
            type="text"
            required
            maxLength={30}
            defaultValue={name}
            autoFocus
            className={inputClass}
          />
        </div>

        <fieldset className="space-y-1.5">
          <legend className={labelClass}>색상</legend>
          <div className="flex flex-wrap gap-2">
            {memberColors.map((color, index) => (
              <label key={color} className="cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  defaultChecked={member ? member.color === color : index === 0}
                  className="peer sr-only"
                />
                <span className="inline-flex rounded-full p-0.5 ring-2 ring-transparent peer-checked:ring-zinc-900 peer-focus-visible:ring-zinc-500">
                  <Avatar name={name || '?'} color={color} size="md" />
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {state?.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
