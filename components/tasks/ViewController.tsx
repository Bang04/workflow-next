"use client";

import { Funnel, List, Plus, Search, SquareKanban, TextAlignCenter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ViewMode } from "@/lib/types";

const tabs: { value: ViewMode; label: string; icon: LucideIcon }[] = [
  { value: "board", label: "Board", icon: SquareKanban },
  { value: "timeline", label: "Timeline", icon: TextAlignCenter },
  { value: "list", label: "List", icon: List },
];

type ViewControllerProps = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onNewTask: () => void;
};

export default function ViewController({
  view,
  onViewChange,
  query,
  onQueryChange,
  onNewTask,
}: ViewControllerProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-zinc-200 px-4 md:px-8 lg:px-12">
      <div role="tablist" aria-label="View" className="flex gap-2">
        {tabs.map(({ value, label, icon: Icon }) => {
          const active = view === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(value)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 pt-2 pb-3.5 text-base font-medium transition-colors ${
                active
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 pb-3">
        <label className="relative">
          <span className="sr-only">Search tasks</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search ..."
            className="h-10 w-40 rounded-lg border border-zinc-200 bg-white pr-3 pl-9 text-sm shadow-xs placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
        </label>
        <span className="h-6 w-px bg-zinc-200" />
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 shadow-xs hover:bg-zinc-50"
        >
          <Funnel className="size-4" />
          Filter
        </button>
        <button
          type="button"
          onClick={onNewTask}
          className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
        >
          <Plus className="size-4" />
          New Task
        </button>
      </div>
    </div>
  );
}
