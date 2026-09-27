export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-zinc-800 ${className}`} />;
}

export function PostSkeleton() {
  return (
    <div className="border-b border-zinc-900 p-4">
      <div className="flex gap-3">
        <Skeleton className="h-11 w-11" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="flex justify-between pt-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true" role="status">
      <span className="sr-only">Cargando publicaciones</span>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}