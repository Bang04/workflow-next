import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['admin', 'user'])
export const taskStatusEnum = pgEnum('task_status', ['todo', 'in-progress', 'in-review'])
export const taskTypeEnum = pgEnum('task_type', ['Dashboard', 'Mobile App'])
export const priorityEnum = pgEnum('priority', ['High', 'Medium', 'Low'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  // 카카오 로그인 사용자의 카카오 회원번호 (일반 가입자는 null)
  kakaoId: text('kakao_id').unique(),
  // 네이버 로그인 사용자의 네이버 회원 고유 id (일반 가입자는 null)
  naverId: text('naver_id').unique(),
  name: text('name').notNull(),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DbUser = typeof users.$inferSelect

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  // Tailwind 배경 + 글자색 클래스 (예: "bg-emerald-100 text-emerald-700")
  color: text('color').notNull(),
})

export const projects = pgTable('projects', {
  // URL 세그먼트로 쓰이는 값 (/projects/[projectId])
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  letter: text('letter').notNull(),
  color: text('color').notNull(),
  badge: text('badge'),
  // 사이드바/홈 카드 노출 순서
  position: integer('position').notNull().default(0),
})

export const projectMembers = pgTable(
  'project_members',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    memberId: integer('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    // 아바타 표시 순서
    position: integer('position').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.memberId] })],
)

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  estimation: text('estimation').notNull(),
  type: taskTypeEnum('type').notNull(),
  priority: priorityEnum('priority').notNull(),
  status: taskStatusEnum('status').notNull(),
  position: integer('position').notNull().default(0),
})

export const taskPeople = pgTable(
  'task_people',
  {
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    memberId: integer('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.memberId] })],
)
