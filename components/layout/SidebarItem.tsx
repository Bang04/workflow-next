"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  href: string;
  label: string;
  // lucide 아이콘이나 색상 사각형 등 자유롭게 전달
  icon: React.ReactNode;
  badge?: string;
};

export default function SidebarItem({
  href,
  label,
  icon,
  badge,
}: SidebarItemProps) {
  const pathname = usePathname();
  // 하위 경로(/projects/crafboard/tasks/t1)에 있어도 상위 메뉴를 활성으로 표시
  const active =
    href !== "#" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
        active
          ? "bg-white font-semibold text-zinc-900 shadow-xs"
          : "text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
      }`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600">
          {badge}
        </span>
      )}
    </Link>
  );
}
