type AvatarProps = {
  name: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
};

const sizes = {
  sm: "size-7 text-[10px]",
  md: "size-9 text-xs",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({
  name,
  color,
  size = "md",
  className = "",
}: AvatarProps) {
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white ${color} ${sizes[size]} ${className}`}
    >
      {initials(name)}
    </span>
  );
}
