export type TaskStatus = "todo" | "in-progress" | "in-review";

export type TaskType = "Dashboard" | "Mobile App";

export type Priority = "High" | "Medium" | "Low";

export type Member = {
  id: number;
  name: string;
  // Tailwind 배경 + 글자색 클래스 (예: "bg-emerald-100 text-emerald-700")
  color: string;
};

export type Project = {
  // URL 세그먼트로 쓰이는 값 (/projects/[projectId])
  id: string;
  name: string;
  letter: string;
  // ProjectIcon 배경색 클래스
  color: string;
  badge?: string;
  members: Member[];
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  description: string;
  estimation: string;
  type: TaskType;
  people: Member[];
  priority: Priority;
  status: TaskStatus;
};

export type StatusGroup = {
  status: TaskStatus;
  label: string;
  // 그룹 제목 왼쪽 세로 막대 색
  accent: string;
};

export type ViewMode = "board" | "timeline" | "list";
