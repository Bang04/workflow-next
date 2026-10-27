import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import TaskEditButton from "@/components/tasks/TaskEditButton";
import TypeBadge from "@/components/tasks/TypeBadge";
import AvatarGroup from "@/components/ui/AvatarGroup";
import { statusGroups } from "@/lib/constants";
import { getAllTasks, getProject, getTask } from "@/lib/db/queries";

// 상위 [projectId]와 현재 [taskId]를 한 번에 생성 (bottom-up)
export async function generateStaticParams() {
  const tasks = await getAllTasks();
  return tasks.map((task) => ({ projectId: task.projectId, taskId: task.id }));
}

export default async function TaskDetailPage({
  params,
}: PageProps<"/projects/[projectId]/tasks/[taskId]">) {
  const { projectId, taskId } = await params;
  const [task, project] = await Promise.all([
    getTask(projectId, taskId),
    getProject(projectId),
  ]);
  if (!task) notFound();

  const status = statusGroups.find((group) => group.status === task.status);

  return (
    <div className="border-t border-zinc-200 px-4 py-6 md:px-8 lg:px-12">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="size-4" />
        All tasks
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-semibold text-zinc-900">{task.name}</h2>
        <TaskEditButton task={task} members={project?.members ?? []} />
      </div>
      <p className="mt-2 max-w-2xl leading-relaxed text-zinc-600">
        {task.description || "No description yet."}
      </p>

      <dl className="mt-8 grid max-w-2xl grid-cols-[120px_1fr] gap-x-6 gap-y-4 text-sm">
        <dt className="text-zinc-500">Status</dt>
        <dd className="flex items-center gap-2 font-medium text-zinc-900">
          <span className={`h-4 w-1 rounded-full ${status?.accent}`} />
          {status?.label}
        </dd>
        <dt className="text-zinc-500">Priority</dt>
        <dd>
          <PriorityBadge priority={task.priority} />
        </dd>
        <dt className="text-zinc-500">Type</dt>
        <dd>
          <TypeBadge type={task.type} />
        </dd>
        <dt className="text-zinc-500">Estimation</dt>
        <dd className="text-zinc-900">{task.estimation}</dd>
        <dt className="text-zinc-500">People</dt>
        <dd>
          <AvatarGroup members={task.people} size="sm" />
        </dd>
      </dl>
    </div>
  );
}
