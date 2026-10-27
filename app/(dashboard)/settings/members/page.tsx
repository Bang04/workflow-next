import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getMembers } from "@/lib/db/queries";
import type { Member } from "@/lib/types";
import MemberList from "./MemberList";

// auth()는 내부에서 crypto.getRandomValues()(CSRF 토큰)를 쓰는데, prerender 중에는
// 이런 불안정한 값을 쓸 수 없다. connection()으로 요청 시점까지 미룬 뒤 호출한다
async function EditableMemberList({ members }: { members: Member[] }) {
  await connection();
  const session = await auth();

  return (
    <MemberList members={members} canEdit={session?.user?.role === "admin"} />
  );
}

export default async function MembersSettingsPage() {
  const members = await getMembers();

  return (
    // 정적 셸에는 읽기 전용 목록을 먼저 보여주고, 권한 확인 후 수정 버튼을 붙인다
    <Suspense fallback={<MemberList members={members} canEdit={false} />}>
      <EditableMemberList members={members} />
    </Suspense>
  );
}
