'use server'

import { and, eq, max, sql } from 'drizzle-orm'
import { updateTag } from 'next/cache'
import { auth } from '@/auth'
import { priorities, statusGroups, taskTypes } from '@/lib/constants'
import { db } from '@/lib/db'
import { projectMembers, taskPeople, tasks } from '@/lib/db/schema'
import type { Priority, TaskStatus, TaskType } from '@/lib/types'

export type TaskState = { error?: string; success?: boolean } | undefined

const NAME_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500
const ESTIMATION_MAX_LENGTH = 50

// Server Action은 누구나 POST로 호출할 수 있으므로 매번 로그인 여부를 확인한다
async function requireUser() {
  const session = await auth()
  return Boolean(session?.user)
}

function parseForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const estimation = String(formData.get('estimation') ?? '').trim()
  const type = String(formData.get('type') ?? '') as TaskType
  const priority = String(formData.get('priority') ?? '') as Priority
  const status = String(formData.get('status') ?? '') as TaskStatus
  const people = formData
    .getAll('people')
    .map(Number)
    .filter((id) => Number.isInteger(id))

  if (!name) return { error: '태스크 이름을 입력해주세요.' }
  if (name.length > NAME_MAX_LENGTH) {
    return { error: `이름은 ${NAME_MAX_LENGTH}자 이하여야 합니다.` }
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return { error: `설명은 ${DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.` }
  }
  if (!estimation) return { error: '기간(Estimation)을 입력해주세요.' }
  if (estimation.length > ESTIMATION_MAX_LENGTH) {
    return { error: `기간은 ${ESTIMATION_MAX_LENGTH}자 이하여야 합니다.` }
  }
  if (!taskTypes.includes(type)) return { error: '타입을 선택해주세요.' }
  if (!priorities.includes(priority)) return { error: '우선순위를 선택해주세요.' }
  if (!statusGroups.some((group) => group.status === status)) {
    return { error: '상태를 선택해주세요.' }
  }
  return {
    name,
    description,
    estimation,
    type,
    priority,
    status,
    people: [...new Set(people)],
  }
}

// 담당자는 해당 프로젝트 멤버만 지정할 수 있다
async function filterProjectMembers(projectId: string, ids: number[]) {
  if (ids.length === 0) return []
  const rows = await db
    .select({ memberId: projectMembers.memberId })
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId))
  const allowed = new Set(rows.map((row) => row.memberId))
  return ids.filter((id) => allowed.has(id))
}

export async function createTask(
  projectId: string,
  _prevState: TaskState,
  formData: FormData,
): Promise<TaskState> {
  if (!(await requireUser())) return { error: '권한이 없습니다.' }

  const parsed = parseForm(formData)
  if ('error' in parsed) return { error: parsed.error }
  const { people, ...values } = parsed
  const memberIds = await filterProjectMembers(projectId, people)

  await db.transaction(async (tx) => {
    // 기존 id(t1, t2, ... 또는 숫자)에서 숫자 부분의 최댓값 + 1을 새 id로 쓴다
    const [{ last, lastId }] = await tx
      .select({
        last: max(tasks.position),
        lastId: sql<number | null>`max(nullif(regexp_replace(${tasks.id}, '\\D', '', 'g'), '')::int)`,
      })
      .from(tasks)
    const id = String((lastId ?? 0) + 1)

    await tx.insert(tasks).values({ ...values, id, projectId, position: (last ?? -1) + 1 })
    if (memberIds.length > 0) {
      await tx
        .insert(taskPeople)
        .values(memberIds.map((memberId, position) => ({ taskId: id, memberId, position })))
    }
  })
  updateTag('tasks')
  return { success: true }
}

export async function updateTask(
  projectId: string,
  taskId: string,
  _prevState: TaskState,
  formData: FormData,
): Promise<TaskState> {
  if (!(await requireUser())) return { error: '권한이 없습니다.' }

  const parsed = parseForm(formData)
  if ('error' in parsed) return { error: parsed.error }
  const { people, ...values } = parsed
  const memberIds = await filterProjectMembers(projectId, people)

  const updated = await db.transaction(async (tx) => {
    const rows = await tx
      .update(tasks)
      .set(values)
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning({ id: tasks.id })
    if (rows.length === 0) return false

    await tx.delete(taskPeople).where(eq(taskPeople.taskId, taskId))
    if (memberIds.length > 0) {
      await tx
        .insert(taskPeople)
        .values(memberIds.map((memberId, position) => ({ taskId, memberId, position })))
    }
    return true
  })
  if (!updated) return { error: '태스크를 찾을 수 없습니다.' }

  updateTag('tasks')
  return { success: true }
}

// task_people은 onDelete: cascade라 담당자 연결은 자동으로 삭제된다
export async function deleteTask(projectId: string, taskId: string): Promise<TaskState> {
  if (!(await requireUser())) return { error: '권한이 없습니다.' }

  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
  updateTag('tasks')
  return { success: true }
}
