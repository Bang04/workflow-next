'use client'

import { useActionState, useEffect, useRef, useTransition } from 'react'
import Avatar from '@/components/ui/Avatar'
import { priorities, statusGroups, taskTypes } from '@/lib/constants'
import type { Member, Task, TaskStatus } from '@/lib/types'
import {
  createTask,
  deleteTask,
  updateTask,
} from '@/app/(dashboard)/projects/[projectId]/actions'

const inputClass =
  'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
const labelClass = 'text-sm font-medium text-zinc-700'

type TaskDialogProps = {
  projectId: string
  // 프로젝트 멤버 (담당자 선택지)
  members: Member[]
  // 없으면 생성, 있으면 수정
  task?: Task
  // 생성 시 기본 상태 (그룹의 + 버튼에서 진입한 경우)
  defaultStatus?: TaskStatus
  onClose: () => void
  // 삭제 성공 후 추가 동작 (상세 페이지에서 목록으로 이동 등)
  onDeleted?: () => void
}

export default function TaskDialog({
  projectId,
  members,
  task,
  defaultStatus = 'todo',
  onClose,
  onDeleted,
}: TaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, action, pending] = useActionState(
    task ? updateTask.bind(null, projectId, task.id) : createTask.bind(null, projectId),
    undefined,
  )
  const [deleting, startDelete] = useTransition()

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  useEffect(() => {
    if (state?.success) onClose()
  }, [state, onClose])

  function handleDelete() {
    if (!task || !confirm(`"${task.name}" 태스크를 삭제할까요?`)) return
    startDelete(async () => {
      const result = await deleteTask(projectId, task.id)
      if (result?.error) {
        alert(result.error)
        return
      }
      onDeleted?.()
      onClose()
    })
  }

  // 수정 중인 태스크의 담당자가 프로젝트 멤버에서 빠졌어도 선택 상태를 유지한다
  const options = [...members]
  for (const person of task?.people ?? []) {
    if (!options.some((m) => m.id === person.id)) options.push(person)
  }
  const assigned = new Set(task?.people.map((p) => p.id))
  const busy = pending || deleting

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-lg rounded-xl border border-zinc-200 p-0 shadow-xl backdrop:bg-black/30"
    >
      <form action={action} className="space-y-4 p-5">
        <h2 className="text-base font-semibold text-zinc-900">
          {task ? '태스크 수정' : '새 태스크'}
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="task-name" className={labelClass}>
            이름
          </label>
          <input
            id="task-name"
            name="name"
            type="text"
            required
            maxLength={100}
            defaultValue={task?.name}
            autoFocus
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-description" className={labelClass}>
            설명
          </label>
          <textarea
            id="task-description"
            name="description"
            rows={3}
            maxLength={500}
            defaultValue={task?.description}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-estimation" className={labelClass}>
            기간 (Estimation)
          </label>
          <input
            id="task-estimation"
            name="estimation"
            type="text"
            required
            maxLength={50}
            placeholder="Feb 14, 2024 - Feb 28, 2024"
            defaultValue={task?.estimation}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="task-status" className={labelClass}>
              상태
            </label>
            <select
              id="task-status"
              name="status"
              defaultValue={task?.status ?? defaultStatus}
              className={inputClass}
            >
              {statusGroups.map((group) => (
                <option key={group.status} value={group.status}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="task-priority" className={labelClass}>
              우선순위
            </label>
            <select
              id="task-priority"
              name="priority"
              defaultValue={task?.priority ?? 'Medium'}
              className={inputClass}
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="task-type" className={labelClass}>
              타입
            </label>
            <select
              id="task-type"
              name="type"
              defaultValue={task?.type ?? taskTypes[0]}
              className={inputClass}
            >
              {taskTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="space-y-1.5">
          <legend className={labelClass}>담당자</legend>
          <div className="flex flex-wrap gap-2">
            {options.map((member) => (
              <label key={member.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="people"
                  value={member.id}
                  defaultChecked={assigned.has(member.id)}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 py-0.5 pr-3 pl-0.5 text-sm text-zinc-700 peer-checked:border-zinc-900 peer-checked:bg-zinc-50 peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-500">
                  <Avatar name={member.name} color={member.color} size="sm" />
                  {member.name}
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

        <div className="flex items-center gap-2">
          {task && (
            <button
              type="button"
              disabled={busy}
              onClick={handleDelete}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
