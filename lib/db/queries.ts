import { asc } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import type { Member, Project, Task } from '@/lib/types'
import { db } from './index'
import { members, projectMembers, projects, taskPeople, tasks } from './schema'

// 프로젝트/태스크/멤버는 모든 사용자가 같은 데이터를 보므로 'use cache'로 공유한다.
// 데이터를 변경하는 Server Action에서 updateTag('projects' | 'tasks' | 'members')로 갱신한다.

export async function getMembers(): Promise<Member[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('members')

  return db.select().from(members).orderBy(asc(members.id))
}

export async function getProjects(): Promise<Project[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('projects', 'members')

  const [projectRows, memberRows, linkRows] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.position)),
    db.select().from(members),
    db.select().from(projectMembers).orderBy(asc(projectMembers.position)),
  ])
  const memberById = new Map(memberRows.map((m) => [m.id, m]))

  return projectRows.map((p) => ({
    id: p.id,
    name: p.name,
    letter: p.letter,
    color: p.color,
    badge: p.badge ?? undefined,
    members: linkRows
      .filter((l) => l.projectId === p.id)
      .map((l) => memberById.get(l.memberId))
      .filter((m): m is Member => m !== undefined),
  }))
}

export async function getProject(projectId: string) {
  const all = await getProjects()
  return all.find((project) => project.id === projectId)
}

export async function getAllTasks(): Promise<Task[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('tasks', 'members')

  const [taskRows, memberRows, peopleRows] = await Promise.all([
    db.select().from(tasks).orderBy(asc(tasks.position)),
    db.select().from(members),
    db.select().from(taskPeople).orderBy(asc(taskPeople.position)),
  ])
  const memberById = new Map(memberRows.map((m) => [m.id, m]))

  return taskRows.map((t) => ({
    id: t.id,
    projectId: t.projectId,
    name: t.name,
    description: t.description,
    estimation: t.estimation,
    type: t.type,
    priority: t.priority,
    status: t.status,
    people: peopleRows
      .filter((p) => p.taskId === t.id)
      .map((p) => memberById.get(p.memberId))
      .filter((m): m is Member => m !== undefined),
  }))
}

export async function getProjectTasks(projectId: string) {
  const all = await getAllTasks()
  return all.filter((task) => task.projectId === projectId)
}

// 다른 프로젝트의 taskId로 접근하면 undefined → notFound()
export async function getTask(projectId: string, taskId: string) {
  const all = await getAllTasks()
  return all.find((task) => task.id === taskId && task.projectId === projectId)
}
