"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "./icons";

export function PageHeader({
  title,
  subtitle,
  back = false,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-900 bg-black/80 px-4 py-3 backdrop-blur">
      {back ? (
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          aria-label="Volver"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-zinc-100">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}