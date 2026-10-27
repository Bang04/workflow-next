import { Monitor, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TaskType } from "@/lib/types";

const styles: Record<TaskType, { className: string; icon: LucideIcon }> = {
  Dashboard: {
    className: "border-violet-200 bg-violet-50 text-violet-600",
    icon: Monitor,
  },
  "Mobile App": {
    className: "border-orange-200 bg-orange-50 text-orange-600",
    icon: Smartphone,
  },
};

export default function TypeBadge({ type }: { type: TaskType }) {
  const { className, icon: Icon } = styles[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium shadow-xs ${className}`}
    >
      <Icon className="size-3.5" />
      {type}
    </span>
  );
}
