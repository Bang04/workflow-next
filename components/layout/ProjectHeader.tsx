import { UserPlus } from "lucide-react";
import AvatarGroup from "@/components/ui/AvatarGroup";
import ProjectIcon from "@/components/ui/ProjectIcon";
import type { Member } from "@/lib/types";

type ProjectHeaderProps = {
  title: string;
  letter: string;
  color: string;
  members: Member[];
};

export default function ProjectHeader({
  title,
  letter,
  color,
  members,
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-8 pb-5 md:px-8 lg:px-12">
      <div className="flex min-w-0 items-center gap-5">
        <ProjectIcon letter={letter} color={color} size="lg" />
        <h1 className="truncate text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <AvatarGroup members={members} max={4} />
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[15px] font-medium text-zinc-800 shadow-xs hover:bg-zinc-50"
        >
          <UserPlus className="size-4" />
          Invite
        </button>
      </div>
    </div>
  );
}
