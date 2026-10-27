import type { Member } from "@/lib/types";
import Avatar from "./Avatar";

type AvatarGroupProps = {
  members: Member[];
  max?: number;
  size?: "sm" | "md";
};

export default function AvatarGroup({
  members,
  max = 3,
  size = "md",
}: AvatarGroupProps) {
  const visible = members.slice(0, max);
  const rest = members.length - visible.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((member) => (
        <Avatar
          key={member.id}
          name={member.name}
          color={member.color}
          size={size}
        />
      ))}
      {rest > 0 && (
        <span
          className={`inline-flex items-center justify-center rounded-full bg-zinc-100 font-medium text-zinc-600 ring-2 ring-white ${
            size === "sm" ? "size-7 text-[10px]" : "size-9 text-xs"
          }`}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
