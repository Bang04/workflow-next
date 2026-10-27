import Link from "next/link";
import { Ellipsis } from "lucide-react";
import type { Task } from "@/lib/types";
import AvatarGroup from "@/components/ui/AvatarGroup";
import PriorityBadge from "./PriorityBadge";
import TypeBadge from "./TypeBadge";

type TaskRowProps = {
  task: Task;
  checked: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
};

// 체크박스 칸을 제외한 모든 셀에 왼쪽 세로 구분선
const cell = "border-l border-zinc-200 px-3.5 py-3";

export default function TaskRow({
  task,
  checked,
  onToggle,
  onEdit,
}: TaskRowProps) {
  return (
    <tr className="border-b border-zinc-200 text-sm text-zinc-800 hover:bg-zinc-50/70">
      <td className="w-12 px-3.5 py-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(task.id)}
          aria-label={`Select ${task.name}`}
          className="size-4 cursor-pointer rounded border-zinc-300 accent-zinc-900"
        />
      </td>
      <td className={`${cell} whitespace-nowrap`}>
        <Link
          href={`/projects/${task.projectId}/tasks/${task.id}`}
          className="font-medium hover:text-indigo-600 hover:underline"
        >
          {task.name}
        </Link>
      </td>
      <td className={`${cell} max-w-[340px] leading-relaxed`}>
        {task.description || "-"}
      </td>
      <td className={`${cell} whitespace-nowrap`}>{task.estimation}</td>
      <td className={cell}>
        <TypeBadge type={task.type} />
      </td>
      <td className={cell}>
        <AvatarGroup members={task.people} size="sm" />
      </td>
      <td className={cell}>
        <PriorityBadge priority={task.priority} />
      </td>
      <td className={`${cell} w-12 text-center`}>
        <button
          type="button"
          aria-label={`Edit ${task.name}`}
          onClick={() => onEdit(task)}
          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <Ellipsis className="size-4" />
        </button>
      </td>
    </tr>
  );
}
