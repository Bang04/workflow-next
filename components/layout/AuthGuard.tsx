import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// 로그인 세션이 없으면 /login으로 보낸다. auth()는 prerender 중 호출할 수 없으므로
// connection()으로 요청 시점까지 미룬 뒤 확인하고, 통과해야만 children을 렌더한다
export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <>{children}</>;
}
