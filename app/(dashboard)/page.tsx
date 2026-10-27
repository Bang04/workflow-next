import ProjectGrid from "@/components/home/ProjectGrid";
import { getProjects } from "@/lib/db/queries";

// "/" 홈 화면. 프로젝트 화면은 사이드바나 카드를 클릭했을 때만 열린다
export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="px-4 pt-8 pb-10 md:px-8 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Home
      </h1>
      <p className="mt-1 text-[15px] text-zinc-500">
        프로젝트를 선택해 작업을 확인하세요.
      </p>

      <section className="mt-8">
        <h2 className="pb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          My Pages
        </h2>
        <ProjectGrid projects={projects} />
      </section>
    </div>
  );
}
