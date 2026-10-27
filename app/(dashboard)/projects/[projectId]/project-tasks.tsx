import TaskBoard from "@/components/tasks/TaskBoard";
import { statusGroups } from "@/lib/constants";
import { getProject, getProjectTasks } from "@/lib/db/queries";

export default async function ProjectTasks({
  params,
}: Pick<PageProps<"/projects/[projectId]">, "params">) {
  const { projectId } = await params;
  const [tasks, project] = await Promise.all([
    getProjectTasks(projectId),
    getProject(projectId),
  ]);

  return (
    <TaskBoard
      projectId={projectId}
      members={project?.members ?? []}
      tasks={tasks}
      groups={statusGroups}
    />
  );
}
