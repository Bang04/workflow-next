'use server'

import { eq } from 'drizzle-orm'
import { updateTag } from 'next/cache'
import { auth } from '@/auth'
import { memberColors } from '@/lib/constants'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'

export type MemberState = { error?: string; success?: boolean } | undefined

const NAME_MAX_LENGTH = 30

// Server Action은 누구나 POST로 호출할 수 있으므로 매번 admin 여부를 확인한다
async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'admin'
}

function parseForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const color = String(formData.get('color') ?? '')

  if (!name) return { error: '이름을 입력해주세요.' }
  if (name.length > NAME_MAX_LENGTH) {
    return { error: `이름은 ${NAME_MAX_LENGTH}자 이하여야 합니다.` }
  }
  if (!memberColors.includes(color)) return { error: '색상을 선택해주세요.' }
  return { name, color }
}

export async function createMember(
  _prevState: MemberState,
  formData: FormData,
): Promise<MemberState> {
  if (!(await requireAdmin())) return { error: '권한이 없습니다.' }

  const parsed = parseForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  await db.insert(members).values(parsed)
  updateTag('members')
  return { success: true }
}

export async function updateMember(
  id: number,
  _prevState: MemberState,
  formData: FormData,
): Promise<MemberState> {
  if (!(await requireAdmin())) return { error: '권한이 없습니다.' }

  const parsed = parseForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  await db.update(members).set(parsed).where(eq(members.id, id))
  updateTag('members')
  return { success: true }
}

// project_members, task_people은 onDelete: cascade라 연결 데이터는 자동으로 삭제된다
export async function deleteMember(id: number): Promise<MemberState> {
  if (!(await requireAdmin())) return { error: '권한이 없습니다.' }

  await db.delete(members).where(eq(members.id, id))
  updateTag('members')
  return { success: true }
}
