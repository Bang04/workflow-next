"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { label: string; href: string };

// 현재 URL과 정확히 일치하는 탭을 활성화 (/settings 가 /settings/members 에서 같이 켜지지 않도록)
export default function TabNav({ items }: { items: Tab[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-2 border-b border-zinc-200">
      {items.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 pt-2 pb-3.5 text-base font-medium transition-colors ${
              active
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
