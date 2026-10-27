type ProjectIconProps = {
  letter: string;
  color: string;
  size?: "sm" | "lg";
};

const sizes = {
  sm: "size-7 rounded-lg text-sm",
  lg: "size-14 rounded-2xl text-3xl",
};

export default function ProjectIcon({
  letter,
  color,
  size = "sm",
}: ProjectIconProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center font-bold text-white shadow-sm ring-1 ring-black/5 ring-inset ${color} ${sizes[size]}`}
    >
      {letter}
    </span>
  );
}
