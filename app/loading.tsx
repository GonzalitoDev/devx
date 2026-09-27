import { FeedSkeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-black">
      <div className="mx-auto flex w-full max-w-[1260px] justify-center">
        <div className="hidden h-dvh w-[250px] shrink-0 border-r border-zinc-900 lg:block" />
        <div className="w-full max-w-[600px] border-x border-zinc-900">
          <div className="flex border-b border-zinc-900">
            <div className="h-12 flex-1" />
            <div className="h-12 flex-1" />
          </div>
          <FeedSkeleton count={4} />
        </div>
        <div className="hidden w-[330px] shrink-0 xl:block" />
      </div>
    </div>
  );
}