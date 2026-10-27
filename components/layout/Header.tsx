import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  LogOut,
  Plus,
  Share2,
  Star,
} from "lucide-react";
import { logout } from "@/app/login/actions";
import { getAllTasks, getProjects } from "@/lib/db/queries";
import HeaderBreadcrumb from "./HeaderBreadcrumb";

const iconButton =
  "rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900";

export default async function Header() {
  // 브레드크럼(클라이언트 컴포넌트)이 DB를 직접 읽을 수 없어 이름 목록만 넘긴다
  const [projects, tasks] = await Promise.all([getProjects(), getAllTasks()]);
  const projectNames = Object.fromEntries(projects.map((p) => [p.id, p.name]));
  const taskNames = Object.fromEntries(
    tasks.map((t) => [`${t.projectId}/${t.id}`, t.name]),
  );

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div className="hidden items-center sm:flex">
          <button type="button" aria-label="Back" className={iconButton}>
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" aria-label="Forward" className={iconButton}>
            <ChevronRight className="size-5" />
          </button>
        </div>
        <span className="hidden h-6 w-px bg-zinc-200 sm:block" />
        <HeaderBreadcrumb projectNames={projectNames} taskNames={taskNames} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[15px] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 sm:flex"
        >
          <Plus className="size-4" />
          New Tab
        </button>
        <span className="hidden h-6 w-px bg-zinc-200 sm:block" />
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Favorite" className={iconButton}>
            <Star className="size-5" />
          </button>
          <button type="button" aria-label="Share" className={iconButton}>
            <Share2 className="size-5" />
          </button>
          <button type="button" aria-label="More" className={iconButton}>
            <Ellipsis className="size-5" />
          </button>
        </div>
        <span className="hidden h-6 w-px bg-zinc-200 sm:block" />
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[15px] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </form>
      </div>
    </header>
  );
}
