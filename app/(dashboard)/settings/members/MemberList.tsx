'use client'

import { useCallback, useState, useTransition } from 'react'
import Avatar from '@/components/ui/Avatar'
import type { Member } from '@/lib/types'
import { deleteMember } from './actions'
import MemberDialog from './MemberDialog'

type MemberListProps = {
  members: Member[]
  canEdit: boolean
}

// 'new' = 추가 모달, Member = 수정 모달
type Editing = Member | 'new' | null

export default function MemberList({ members, canEdit }: MemberListProps) {
  const [editing, setEditing] = useState<Editing>(null)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const closeDialog = useCallback(() => setEditing(null), [])

  function handleDelete(member: Member) {
    if (
      !confirm(
        `${member.name} 멤버를 삭제할까요?\n모든 프로젝트와 태스크에서도 함께 제외됩니다.`,
      )
    ) {
      return
    }
    setError(undefined)
    startTransition(async () => {
      const result = await deleteMember(member.id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="max-w-md space-y-3">
      {canEdit && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            멤버 추가
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar name={member.name} color={member.color} size="sm" />
            <span className="flex-1 text-sm font-medium text-zinc-900">
              {member.name}
            </span>
            {canEdit && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(member)}
                  className="text-sm text-zinc-500 transition hover:text-zinc-900"
                >
                  수정
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(member)}
                  className="text-sm text-red-500 transition hover:text-red-700 disabled:opacity-60"
                >
                  삭제
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {editing && (
        <MemberDialog
          key={editing === 'new' ? 'new' : editing.id}
          member={editing === 'new' ? undefined : editing}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}
