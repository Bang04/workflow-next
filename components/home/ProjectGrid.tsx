import { statusGroups } from "@/lib/constants";
import { getAllTasks } from "@/lib/db/queries";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

type ProjectGridProps = {
  projects: Project[];
};

// 프로젝트별 태스크 수와 상태별 개수를 계산해 카드에 넘긴다 (카드는 표시만 담당)
export default async function ProjectGrid({ projects }: ProjectGridProps) {
  const allTasks = await getAllTasks();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const projectTasks = allTasks.filter(
          (task) => task.projectId === project.id,
        );
        const statusCounts = statusGroups.map((group) => ({
          label: group.label,
          accent: group.accent,
          count: projectTasks.filter((task) => task.status === group.status)
            .length,
        }));

        return (
          <ProjectCard
            key={project.id}
            project={project}
            taskCount={projectTasks.length}
            statusCounts={statusCounts}
          />
        );
      })}
    </div>
  );
}
