import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-500">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
      {description ? (
        <p className="max-w-sm text-sm text-zinc-500">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}