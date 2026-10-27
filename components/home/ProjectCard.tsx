import Link from "next/link";
import AvatarGroup from "@/components/ui/AvatarGroup";
import ProjectIcon from "@/components/ui/ProjectIcon";
import type { Project } from "@/lib/types";

type StatusCount = {
  label: string;
  // 상태 점 색 (StatusGroup.accent)
  accent: string;
  count: number;
};

type ProjectCardProps = {
  project: Project;
  taskCount: number;
  statusCounts: StatusCount[];
};

// 홈 화면의 프로젝트 카드. 클릭하면 /projects/[projectId] 로 이동한다
export default function ProjectCard({
  project,
  taskCount,
  statusCounts,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-center gap-3">
        <ProjectIcon letter={project.letter} color={project.color} />
        <span className="flex-1 truncate text-[15px] font-semibold text-zinc-900">
          {project.name}
        </span>
        {project.badge && (
          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600">
            {project.badge}
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {statusCounts.map((status) => (
          <li
            key={status.label}
            className="flex items-center gap-2 text-sm text-zinc-600"
          >
            <span className={`size-2 rounded-full ${status.accent}`} />
            <span className="flex-1">{status.label}</span>
            <span className="font-medium text-zinc-900">{status.count}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
        <AvatarGroup members={project.members} max={4} size="sm" />
        <span className="text-sm text-zinc-500">{taskCount} tasks</span>
      </div>
    </Link>
  );
}
