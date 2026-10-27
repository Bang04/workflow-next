import TabNav from "@/components/layout/TabNav";

const tabs = [
  { label: "General", href: "/settings" },
  { label: "Members", href: "/settings/members" },
];

// /settings 와 /settings/members 가 공유하는 레이아웃 (제목 + 탭)
export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <div className="px-4 pt-8 md:px-8 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Settings
      </h1>
      <TabNav items={tabs} />
      <div className="py-6">{children}</div>
    </div>
  );
}
