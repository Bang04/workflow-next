import type { Priority } from "@/lib/types";

const styles: Record<Priority, { badge: string; dot: string }> = {
  High: { badge: "border-red-200 bg-red-50 text-red-600", dot: "bg-red-500" },
  Medium: {
    badge: "border-amber-200 bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  Low: { badge: "border-blue-200 bg-blue-50 text-blue-600", dot: "bg-blue-500" },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const style = styles[priority];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium shadow-xs ${style.badge}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  );
}
