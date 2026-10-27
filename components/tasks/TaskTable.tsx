import {
  CalendarDays,
  Goal,
  MonitorSmartphone,
  Plus,
  SquareChevronDown,
  TextAlignStart,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Task } from "@/lib/types";
import TaskRow from "./TaskRow";

const columns: { label: string; icon: LucideIcon }[] = [
  { label: "Task Name", icon: Goal },
  { label: "Description", icon: TextAlignStart },
  { label: "Estimation", icon: CalendarDays },
  { label: "Type", icon: MonitorSmartphone },
  { label: "People", icon: Users },
  { label: "Priority", icon: SquareChevronDown },
];

type TaskTableProps = {
  tasks: Task[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onEdit: (task: Task) => void;
};

export default function TaskTable({
  tasks,
  selected,
  onToggle,
  onToggleAll,
  onEdit,
}: TaskTableProps) {
  const ids = tasks.map((task) => task.id);
  const allChecked = ids.length > 0 && ids.every((id) => selected.has(id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left">
        <thead>
          <tr className="border-b border-zinc-200 text-sm text-zinc-500">
            <th className="w-12 px-3.5 py-3">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => onToggleAll(ids, e.target.checked)}
                aria-label="Select all tasks"
                className="size-4 cursor-pointer rounded border-zinc-300 accent-zinc-900"
              />
            </th>
            {columns.map(({ label, icon: Icon }) => (
              <th key={label} className="px-3.5 py-3 font-normal">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Icon className="size-4 text-zinc-400" />
                  {label}
                </span>
              </th>
            ))}
            <th className="w-12 px-3.5 py-3 text-center">
              <button
                type="button"
                aria-label="Add column"
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <Plus className="size-4" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              checked={selected.has(task.id)}
              onToggle={onToggle}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
