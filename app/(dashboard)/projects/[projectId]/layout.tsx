import { Suspense } from "react";
import { getProjects } from "@/lib/db/queries";
import ProjectHeaderLoader from "./project-header-loader";
import ProjectHeaderSkeleton from "./project-header-skeleton";

// cacheComponents 환경에서는 동적 세그먼트 값을 빌드 시점에 알려줘야 정적으로 프리렌더된다
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ projectId: project.id }));
}

// /projects/[projectId] 와 그 하위(/tasks/[taskId])가 공유하는 레이아웃.
// 하위 페이지로 이동해도 ProjectHeader는 다시 그려지지 않고 children 영역만 교체된다.
export default function ProjectLayout({
  children,
  params,
}: LayoutProps<"/projects/[projectId]">) {
  return (
    <>
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <ProjectHeaderLoader params={params} />
      </Suspense>
      {children}
    </>
  );
}
