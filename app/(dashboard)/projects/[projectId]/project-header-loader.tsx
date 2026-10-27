import { notFound } from "next/navigation";
import ProjectHeader from "@/components/layout/ProjectHeader";
import { getProject } from "@/lib/db/queries";

export default async function ProjectHeaderLoader({
  params,
}: Pick<LayoutProps<"/projects/[projectId]">, "params">) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  return (
    <ProjectHeader
      title={project.name}
      letter={project.letter}
      color={project.color}
      members={project.members}
    />
  );
}
