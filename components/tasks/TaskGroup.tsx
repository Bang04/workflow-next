"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import type { StatusGroup, Task } from "@/lib/types";
import TaskTable from "./TaskTable";

type TaskGroupProps = {
  group: StatusGroup;
  tasks: Task[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onEdit: (task: Task) => void;
  onAdd: (status: StatusGroup["status"]) => void;
};

export default function TaskGroup({
  group,
  tasks,
  selected,
  onToggle,
  onToggleAll,
  onEdit,
  onAdd,
}: TaskGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-3 text-base font-semibold text-zinc-900"
        >
          <ChevronDown
            className={`size-4 text-zinc-500 transition-transform ${open ? "" : "-rotate-90"}`}
          />
          <span className={`h-5 w-1 rounded-full ${group.accent}`} />
          {group.label}
          <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600">
            {tasks.length}
          </span>
        </button>
        <button
          type="button"
          aria-label={`Add task to ${group.label}`}
          onClick={() => onAdd(group.status)}
          className="rounded-md p-1 text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-800"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {open &&
        (tasks.length > 0 ? (
          <TaskTable
            tasks={tasks}
            selected={selected}
            onToggle={onToggle}
            onToggleAll={onToggleAll}
            onEdit={onEdit}
          />
        ) : (
          <p className="border-b border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            No tasks
          </p>
        ))}
    </section>
  );
}
