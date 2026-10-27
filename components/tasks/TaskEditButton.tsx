"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import type { Member, Task } from "@/lib/types";
import TaskDialog from "./TaskDialog";

type TaskEditButtonProps = {
  task: Task;
  members: Member[];
};

// 상세 페이지의 수정/삭제 진입점. 삭제하면 목록으로 이동한다
export default function TaskEditButton({ task, members }: TaskEditButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 shadow-xs hover:bg-zinc-50"
      >
        <Pencil className="size-4" />
        Edit
      </button>

      {open && (
        <TaskDialog
          projectId={task.projectId}
          members={members}
          task={task}
          onClose={closeDialog}
          onDeleted={() => router.replace(`/projects/${task.projectId}`)}
        />
      )}
    </>
  );
}
