import { Suspense } from "react";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Loading from "@/app/loading";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-full bg-zinc-100 md:p-3">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white md:rounded-2xl md:border md:border-zinc-200 md:shadow-sm">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<Loading />}>
            <AuthGuard>{children}</AuthGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
