export default function TaskBoardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3 animate-pulse">
      <div className="h-8 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-10 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-10 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-10 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-10 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
