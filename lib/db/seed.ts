import { config } from 'dotenv'
config({ path: '.env.local' })

import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'

const seedUsers = [
  { email: 'admin@test.com', password: '1234', name: '관리자', role: 'admin' as const },
  { email: 'user@test.com', password: '1234', name: '홍길동', role: 'user' as const },
]

const seedMembers = [
  { id: 1, name: 'Alex Lee', color: 'bg-zinc-100 text-zinc-600' },
  { id: 2, name: 'Jamie Park', color: 'bg-sky-100 text-sky-700' },
  { id: 3, name: 'Dana Tran', color: 'bg-emerald-100 text-emerald-700' },
  { id: 4, name: 'Sam Kim', color: 'bg-amber-100 text-amber-700' },
  { id: 5, name: 'Robin Choi', color: 'bg-violet-100 text-violet-700' },
]
const [alex, jamie, dana, sam, robin] = seedMembers.map((m) => m.id)

const seedProjects = [
  { id: 'crafboard', name: 'Crafboard Project', letter: 'C', color: 'bg-indigo-500', members: [alex, jamie, dana, sam, robin] },
  { id: 'visionary-tasks', name: 'Visionary Tasks', letter: 'V', color: 'bg-zinc-800', members: [jamie, robin] },
  { id: 'demotion', name: 'Demotion Project', letter: 'D', color: 'bg-orange-500', members: [alex, sam] },
  { id: 'angular-studio', name: 'Angular Studio', letter: 'A', color: 'bg-blue-500', badge: '10', members: [dana, sam, robin] },
  { id: 'cudemo', name: 'Cudemo Project', letter: 'C', color: 'bg-violet-600', members: [alex] },
]

const estimation = 'Feb 14, 2024 - Feb 1, 2024'

type SeedTask = {
  id: string
  projectId: string
  name: string
  description: string
  type: 'Dashboard' | 'Mobile App'
  people: number[]
  priority: 'High' | 'Medium' | 'Low'
  status: 'todo' | 'in-progress' | 'in-review'
}

const seedTasks: SeedTask[] = [
  { id: 't1', projectId: 'crafboard', name: 'Employee Details', description: 'Create a page where there is information about employees', type: 'Dashboard', people: [alex, dana, jamie], priority: 'Medium', status: 'todo' },
  { id: 't2', projectId: 'crafboard', name: 'Darkmode version', description: 'Darkmode version for all screens', type: 'Mobile App', people: [alex, dana, jamie], priority: 'Low', status: 'todo' },
  { id: 't3', projectId: 'crafboard', name: 'Super Admin Role', description: '', type: 'Dashboard', people: [alex, dana, jamie], priority: 'Medium', status: 'todo' },
  { id: 't4', projectId: 'crafboard', name: 'Super Admin Role', description: '', type: 'Dashboard', people: [jamie, dana], priority: 'High', status: 'in-progress' },
  { id: 't5', projectId: 'crafboard', name: 'Settings Page', description: '', type: 'Mobile App', people: [jamie, sam, robin], priority: 'Medium', status: 'in-progress' },
  { id: 't6', projectId: 'crafboard', name: 'KPI and Employee Statistics', description: 'Create a design that displays KPIs and employee statistics', type: 'Dashboard', people: [robin, dana], priority: 'Low', status: 'in-progress' },
  { id: 't7', projectId: 'crafboard', name: 'Customer Role', description: '', type: 'Dashboard', people: [alex, robin, dana], priority: 'Medium', status: 'in-review' },
  { id: 't8', projectId: 'crafboard', name: 'Admin Role', description: 'Set up with relevant information such as profile picture, phone number etc', type: 'Mobile App', people: [alex, dana, jamie], priority: 'High', status: 'in-review' },
  { id: 't9', projectId: 'visionary-tasks', name: 'Onboarding Flow', description: 'Design the first-run experience for new users', type: 'Mobile App', people: [jamie, robin], priority: 'High', status: 'todo' },
  { id: 't10', projectId: 'visionary-tasks', name: 'Roadmap Board', description: 'Quarterly roadmap view with milestones', type: 'Dashboard', people: [robin], priority: 'Medium', status: 'in-progress' },
  { id: 't11', projectId: 'angular-studio', name: 'Component Library', description: 'Shared buttons, inputs and modals for all screens', type: 'Dashboard', people: [dana, sam], priority: 'Medium', status: 'in-progress' },
  { id: 't12', projectId: 'angular-studio', name: 'Push Notifications', description: '', type: 'Mobile App', people: [sam, robin], priority: 'Low', status: 'in-review' },
]

async function main() {
  // env 로드 후에 db 모듈을 불러와야 DATABASE_URL이 적용됨
  const { db } = await import('./index')
  const schema = await import('./schema')

  for (const u of seedUsers) {
    await db
      .insert(schema.users)
      .values({
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: await bcrypt.hash(u.password, 10),
      })
      .onConflictDoNothing({ target: schema.users.email })
  }

  await db.insert(schema.members).values(seedMembers).onConflictDoNothing()
  // id를 직접 넣으면 시퀀스가 갱신되지 않으므로 다음 자동 id가 겹치지 않게 맞춘다
  await db.execute(
    sql`select setval(pg_get_serial_sequence('members', 'id'), (select max(id) from members))`,
  )

  await db
    .insert(schema.projects)
    .values(
      seedProjects.map(({ members: _members, ...p }, position) => ({ ...p, position })),
    )
    .onConflictDoNothing()

  await db.insert(schema.projectMembers).values(
    seedProjects.flatMap((p) =>
      p.members.map((memberId, position) => ({ projectId: p.id, memberId, position })),
    ),
  ).onConflictDoNothing()

  await db
    .insert(schema.tasks)
    .values(
      seedTasks.map(({ people: _people, ...t }, position) => ({ ...t, estimation, position })),
    )
    .onConflictDoNothing()

  await db.insert(schema.taskPeople).values(
    seedTasks.flatMap((t) =>
      t.people.map((memberId, position) => ({ taskId: t.id, memberId, position })),
    ),
  ).onConflictDoNothing()

  console.log('seed 완료')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
