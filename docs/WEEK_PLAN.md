# 1주 기본기 다지기 계획 (workflow-next 기준 재정리)

> 목표: 이미 있는 프로젝트(업무/프로젝트 관리 앱)를 소재로 Next + React 기본기를 한 주 동안 탄탄하게 만든다.
> 원안(관제 UI, Prisma+SQLite 등)에서 **현재 프로젝트와 다른 부분은 아래 "원안 대비 조정"** 대로 바꿨다.

## 현재 구현 상태 (출발점)

| 영역 | 상태 |
|---|---|
| 스택 | Next 16 (App Router, `use cache`/`updateTag`), React 19, Tailwind 4, lucide-react |
| 인증 | next-auth v5 **Credentials만** (JWT 1시간, role: admin/user), `/login`, `/join`(가입 후 자동 로그인), `AuthGuard`로 대시보드 보호 |
| DB | **PostgreSQL + Drizzle** (docker-compose, 마이그레이션 3개, seed) |
| 데이터 | users / members / projects / tasks + 연결 테이블. 조회는 `lib/db/queries.ts`에서 `use cache` + tag |
| CRUD | **멤버만 완성** (Server Action + admin 검증 + 다이얼로그). 프로젝트·태스크는 **읽기 전용** |
| UI | Board/List(타임라인 탭은 껍데기) 뷰 전환, 검색(클라 필터), 태스크 상세 페이지, `loading`/`error` 일부 있음 |
| 미완 | `New Task`/`Filter` 버튼 동작 없음, 폼 검증 라이브러리 없음(수동 `String(formData.get())`), 테스트·토스트·metadata·배포 설정 없음, `api/hello`는 샘플 |

## 원안 대비 조정

| 원안 | 조정 | 이유 |
|---|---|---|
| Prisma + SQLite | **Drizzle + Postgres 유지** | 이미 스키마·마이그레이션·seed 완료. ORM 교체는 기본기 학습이 아니라 재작업 |
| CRUD 게시판 | **태스크 CRUD** (생성/수정/삭제/상태 이동) | 게시판 대신 이 앱의 실제 도메인으로 같은 학습 효과 |
| 소셜 로그인 | **GitHub OAuth 1개 추가** (Credentials 유지) | 이미 next-auth라 provider 추가가 곧 학습. 계정 연동 정책이 포인트 |
| 관제 UI·지도(Leaflet/카카오맵) | **프로젝트 현황 대시보드** (차트·테이블·실시간 갱신). **지도는 제외** | 위치 데이터가 없는 업무관리 앱이라 지도는 억지. 필요하면 주말 선택 과제 |
| shadcn/ui 전면 도입 | **필요한 컴포넌트만** (Dialog, Select, Form, Sonner) | 기존 Tailwind 커스텀 UI와 공존. 전면 교체 금지 |
| Vercel 배포 | 유지 + **Postgres는 Neon/Supabase 등 호스팅 DB** 필요 | docker DB는 Vercel에서 못 씀 |

---

## 월 — 인증 완성

**개발**
- [ ] GitHub OAuth provider 추가 (`auth.ts`), `/login`에 버튼
- [ ] 소셜 로그인 사용자의 `users` 행 생성/연동 (`signIn` 콜백 또는 Drizzle adapter 선택 → 트레이드오프 기록). 현재 `passwordHash`가 `notNull`이라 **스키마 수정(nullable) + 마이그레이션** 필요
- [ ] 보호 라우트 정리: 지금은 `AuthGuard` 컴포넌트 방식 → `proxy.ts`(Next 16 middleware 후속)로 1차 차단 + 서버에서 2차 검증(`auth()`)을 병행. **먼저 `node_modules/next/dist/docs/`에서 proxy 문서 확인** (AGENTS.md 지침)
- [ ] 세션 만료 처리, 로그인 후 원래 가려던 페이지로 복귀(`callbackUrl`)
- [ ] 권한 체크 함수 `requireAdmin` → 공용 모듈로 추출 (members actions에 지역 정의되어 있음)

**React 기본기 (1h): state 스냅샷, 렌더링 원리**
- [ ] `LoginForm`/`JoinForm`/`MemberDialog`에서 `useActionState` + pending 상태를 보며 "렌더 = 스냅샷" 실험 (setState 직후 값 로그, 함수형 업데이트 비교)
- [ ] 메모: 왜 `setState(count+1)` 3번이 +1인지 직접 재현

**완료 기준**: 로그아웃 상태로 `/`, `/settings` 접근 시 `/login`, 비admin이 멤버 Action 호출 시 거부, 소셜/이메일 로그인 모두 성공

---

## 화 — 태스크 CRUD, Server Actions vs Route Handler

**개발**
- [ ] `tasks` 생성/수정/삭제 Server Action (`New Task` 버튼 연결, 멤버 다이얼로그 패턴 재사용)
- [ ] 변경 후 `updateTag('tasks')`로 캐시 갱신 (기존 패턴 유지)
- [ ] 같은 기능을 Route Handler(`app/api/tasks`)로 한 번 더 구현해 비교 → 비교표를 이 문서 하단에 기록
  - 기준: 폼 제출 vs 외부/클라이언트 fetch, 캐시 무효화, 에러 처리, 타입 공유, 인증 처리
  - `api/hello`는 학습 후 삭제
- [ ] 서버 검증: 입력은 반드시 서버에서 zod로 재검증

**라이브러리: react-hook-form + zod** (Prisma는 제외, Drizzle 유지)
- [ ] `lib/validation/task.ts`에 zod 스키마 1개 → **클라(RHF resolver)와 서버 Action이 공유**
- [ ] 기존 `members/actions.ts`의 수동 `parseForm`을 zod로 교체

**React 기본기 (1h): 폼 — 제어/비제어 컴포넌트**
- [ ] 현재 폼은 대부분 비제어(FormData). 검색창 `ViewController`는 제어. 둘의 차이를 정리
- [ ] RHF는 비제어 기반이라는 점 확인 (`register` vs `Controller`)

**완료 기준**: 태스크 생성→목록 반영, 잘못된 입력은 클라/서버 양쪽에서 막힘

---

## 수 — 서버 상태 vs 클라이언트 상태

**개발**
- [ ] 현재 구조 정리: 서버 상태 = DB 데이터(`use cache` + tag), 클라 상태 = 뷰 모드·검색어·모달 열림. 어떤 것을 TanStack Query로 옮길지 **먼저 결정** (전부 옮기지 말 것 — RSC 캐시와 이중화 주의)
- [ ] 태스크 보드에 **상태 이동(todo→in-progress→in-review) 낙관적 업데이트** (`useOptimistic` vs TanStack Query `onMutate` 비교)
- [ ] 무한스크롤: 태스크 List 뷰 또는 활동 로그를 `useInfiniteQuery` + Route Handler 페이지네이션(cursor)으로
- [ ] `ViewController`의 `view`/`query`를 **Zustand 스토어 또는 URL searchParams**로 이동해 비교 (공유 가능한 상태는 URL이 정답일 수 있음)

**라이브러리: TanStack Query, Zustand**
- [ ] `QueryClientProvider`는 `app/(dashboard)/layout.tsx` 하위 클라이언트 컴포넌트로 분리

**React 기본기 (1h): useEffect 정확히 쓰기, 커스텀 훅**
- [ ] 코드에서 `useEffect`로 파생 값을 계산하는 곳이 있는지 점검 (없애는 연습)
- [ ] 커스텀 훅 2개 작성: `useDebouncedValue`(검색), `useTaskFilters`

**완료 기준**: 드래그/버튼으로 상태 변경 시 즉시 반영되고 실패 시 롤백, 무한스크롤 동작

---

## 목 — 프로젝트 현황 대시보드 (원안의 "관제 UI")

**개발**
- [ ] 프로젝트별 **상태 분포 차트(도넛), 우선순위/타입별 막대 차트** — 데이터는 기존 tasks 집계 쿼리
- [ ] **TanStack Table**로 태스크 테이블 교체 (정렬·필터·컬럼 토글) — 현재 `TaskTable.tsx` 대체
- [ ] 실시간 갱신: 먼저 **polling**(TanStack Query `refetchInterval`) → 가능하면 **SSE** Route Handler 1개로 비교
- [ ] 비어 있던 **Timeline 탭** 구현 여부는 선택 (시간 남으면)
- [ ] ~~지도~~ 제외 (선택 과제: 멤버 근무지 같은 위치 데이터를 만들 경우에만)

**라이브러리: Recharts, TanStack Table**

**React 기본기 (1h): 성능 — memo, 리렌더 줄이기**
- [ ] React DevTools Profiler로 `TaskRow` 리렌더 횟수 측정 → `memo` 적용 전/후 비교
- [ ] 측정 없이 `memo` 남발하지 않기. 결과를 숫자로 기록

**완료 기준**: 대시보드에서 차트·테이블 동작, 데이터 변경이 수 초 내 반영

---

## 금 — 마무리

**개발**
- [ ] `error.tsx`/`loading.tsx`/`not-found.tsx`를 라우트 단위로 점검 (현재 루트와 일부만 존재)
- [ ] `metadata` / `generateMetadata` (프로젝트·태스크 상세 제목)
- [ ] **sonner 토스트**로 Action 결과 알림 통일 (지금은 폼 내부 `error` 문자열)
- [ ] shadcn/ui: 이번 주 만든 Dialog/Select 등 **필요한 것만** 도입, 기존 UI와 스타일 충돌 확인
- [ ] 배포: 호스팅 Postgres 준비 → 환경변수(`DATABASE_URL`, `AUTH_SECRET`, OAuth 키) → 마이그레이션 → Vercel
- [ ] `README.md`를 create-next-app 기본 문구에서 프로젝트 설명으로 교체
- [ ] `npm run lint`, `npm run build` 통과, 한 주 리팩터링 정리

**React 기본기 (1h): Context, 컴포넌트 합성**
- [ ] `ProjectCard`/`TaskBoard`/`TaskGroup` 등에서 props drilling 지점을 찾아 합성(children, slot)으로 개선
- [ ] Context는 "정말 필요한 곳"만 (예: 토스트·현재 사용자). 남용 금지

**완료 기준**: 배포 URL에서 로그인 → 태스크 CRUD → 대시보드까지 동작

---

## 운영 규칙
- 매일 마지막 15분: 오늘 배운 것 3줄 + 막힌 점을 이 문서 하단 "학습 로그"에 기록
- 각 요일 작업은 그날 끝에 `lint` 통과 상태 유지
- Next 관련 API는 쓰기 전 `node_modules/next/dist/docs/` 확인 (이 버전은 기존 지식과 다를 수 있음)
- 라이브러리는 그날 쓰는 것만 설치

## 학습 로그
<!-- 날짜 / 배운 것 / 막힌 점 -->

## Server Action vs Route Handler 비교 (화요일 작성)
<!-- 구현 후 채우기 -->
