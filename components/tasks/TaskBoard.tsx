"use client";

import { useCallback, useState } from "react";
import type {
  Member,
  StatusGroup,
  Task,
  TaskStatus,
  ViewMode,
} from "@/lib/types";
import TaskDialog from "./TaskDialog";
import TaskGroup from "./TaskGroup";
import ViewController from "./ViewController";

type TaskBoardProps = {
  projectId: string;
  members: Member[];
  tasks: Task[];
  groups: StatusGroup[];
};

// { status } = 해당 상태로 새 태스크 등록, Task = 수정
type Editing = { status: TaskStatus } | Task | null;

export default function TaskBoard({
  projectId,
  members,
  tasks,
  groups,
}: TaskBoardProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Editing>(null);
  const closeDialog = useCallback(() => setEditing(null), []);

  const keyword = query.trim().toLowerCase();
  const filtered = keyword
    ? tasks.filter(
        (task) =>
          task.name.toLowerCase().includes(keyword) ||
          task.description.toLowerCase().includes(keyword),
      )
    : tasks;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(ids: string[], checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  return (
    <div>
      <ViewController
        view={view}
        onViewChange={setView}
        query={query}
        onQueryChange={setQuery}
        onNewTask={() => setEditing({ status: "todo" })}
      />

      <div className="flex flex-col gap-8 px-4 py-5 md:px-8 lg:px-12">
        {view === "list" ? (
          groups.map((group) => (
            <TaskGroup
              key={group.status}
              group={group}
              tasks={filtered.filter((task) => task.status === group.status)}
              selected={selected}
              onToggle={toggle}
              onToggleAll={toggleAll}
              onEdit={setEditing}
              onAdd={(status) => setEditing({ status })}
            />
          ))
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-400">
            {view === "board" ? "Board" : "Timeline"} view is coming soon.
          </div>
        )}
      </div>

      {editing && (
        <TaskDialog
          key={"id" in editing ? editing.id : `new-${editing.status}`}
          projectId={projectId}
          members={members}
          task={"id" in editing ? editing : undefined}
          defaultStatus={"id" in editing ? undefined : editing.status}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
