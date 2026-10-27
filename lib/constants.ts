import type { Priority, StatusGroup, TaskType } from "./types";

// 칸반 컬럼의 라벨/색상은 UI 설정이라 DB가 아닌 코드에 둔다
export const statusGroups: StatusGroup[] = [
  { status: "todo", label: "To-do", accent: "bg-zinc-300" },
  { status: "in-progress", label: "In Progress", accent: "bg-sky-400" },
  { status: "in-review", label: "In Review", accent: "bg-orange-400" },
];

// Task 폼의 선택지 (DB enum과 동일한 값)
export const taskTypes: TaskType[] = ["Dashboard", "Mobile App"];
export const priorities: Priority[] = ["High", "Medium", "Low"];

// 멤버 아바타 색상 팔레트. Tailwind가 클래스를 인식하도록 전체 문자열을 리터럴로 둔다
export const memberColors = [
  "bg-zinc-100 text-zinc-600",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
];
