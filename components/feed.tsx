"use client";

import type { ReactNode } from "react";
import type { Post } from "@/lib/types";
import { useApp } from "@/lib/store";
import { PostCard } from "./post-card";
import { EmptyState } from "./empty-state";
import { FeedSkeleton } from "./skeleton";

export function Feed({
  posts,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: {
  posts: Post[];
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}) {
  const { ready } = useApp();

  if (!ready) {
    return <FeedSkeleton count={5} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}