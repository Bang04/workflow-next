"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
      <h2 className="text-xl font-semibold">문제가 발생했습니다.</h2>
      <button
        onClick={() => retry()}
        className="rounded-full bg-foreground px-5 py-2 text-background"
      >
        다시 시도
      </button>
    </div>
  );
}
