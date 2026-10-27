import { Suspense } from "react";
import ProjectTasks from "./project-tasks";
import TaskBoardSkeleton from "./task-board-skeleton";

export default function ProjectPage({
  params,
}: PageProps<"/projects/[projectId]">) {
  return (
    <Suspense fallback={<TaskBoardSkeleton />}>
      <ProjectTasks params={params} />
    </Suspense>
  );
}
