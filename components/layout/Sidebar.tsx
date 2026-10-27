import {
  BellDot,
  CalendarDays,
  ChevronDown,
  ChevronsLeft,
  ChevronsUpDown,
  House,
  Plus,
  Search,
  Settings,
  Triangle,
} from "lucide-react";
import ProjectIcon from "@/components/ui/ProjectIcon";
import { getProjects } from "@/lib/db/queries";
import SidebarItem from "./SidebarItem";

const mainMenu = [
  { label: "Home", href: "/", icon: House },
  { label: "Search", href: "#", icon: Search },
  { label: "Notification", href: "#", icon: BellDot, badge: "99+" },
  { label: "Calendar", href: "#", icon: CalendarDays },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1 pb-2">
      <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        {children}
      </p>
      <ChevronDown className="size-4 text-zinc-400" />
    </div>
  );
}

export default async function Sidebar() {
  // 프로젝트 데이터에서 메뉴를 만들어, 항목을 추가하면 /projects/[projectId] 경로가 자동으로 생긴다
  const projects = await getProjects();
  const myPages = projects.map((project) => ({
    label: project.name,
    href: `/projects/${project.id}`,
    letter: project.letter,
    color: project.color,
    badge: project.badge,
  }));

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-7 overflow-y-auto px-3 py-4 md:flex">
      <div className="flex justify-end">
        <button
          type="button"
          aria-label="Collapse sidebar"
          className="rounded-md p-1 text-zinc-400 hover:bg-white hover:text-zinc-700"
        >
          <ChevronsLeft className="size-4" />
        </button>
      </div>

      <button
        type="button"
        className="-mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-zinc-200/70 hover:bg-zinc-50"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
          <Triangle className="size-5 fill-white" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold text-zinc-900">
            Manageko.
          </span>
          <span className="block truncate text-sm text-zinc-500">
            manag@mail.com
          </span>
        </span>
        <ChevronsUpDown className="size-4 text-zinc-400" />
      </button>

      <nav aria-label="Main menu">
        <SectionTitle>Main Menu</SectionTitle>
        <div className="flex flex-col gap-0.5">
          {mainMenu.map(({ icon: Icon, ...item }) => (
            <SidebarItem
              key={item.label}
              {...item}
              icon={<Icon className="size-5 shrink-0" />}
            />
          ))}
        </div>
      </nav>

      <nav aria-label="My pages">
        <SectionTitle>My Pages</SectionTitle>
        <div className="flex flex-col gap-0.5">
          {myPages.map(({ letter, color, ...item }) => (
            <SidebarItem
              key={item.label}
              {...item}
              icon={<ProjectIcon letter={letter} color={color} />}
            />
          ))}
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
          >
            <Plus className="size-5" />
            Create New
          </button>
        </div>
      </nav>
    </aside>
  );
}
