"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { Feed } from "@/components/feed";
import { FeedTabs } from "@/components/feed-tabs";
import { PostForm } from "@/components/post-form";
import { CodeIcon } from "@/components/icons";

export default function HomePage() {
  const { posts, following, currentUser, feedTab } = useApp();

  const visiblePosts = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (feedTab === "following") {
      return sorted.filter(
        (p) => p.authorId === currentUser?.id || following.includes(p.authorId),
      );
    }
    return sorted;
  }, [posts, feedTab, following, currentUser?.id]);

  return (
    <div>
      <div className="sticky top-0 z-30 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="flex items-center gap-2 px-4 py-3 lg:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <CodeIcon className="h-4 w-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-zinc-100">
            Dev<span className="text-sky-400">X</span>
          </span>
        </div>
        <FeedTabs />
      </div>

      <div className="hidden border-b border-zinc-900 lg:block">
        <PostForm />
      </div>

      <Feed
        posts={visiblePosts}
        emptyIcon={<CodeIcon className="h-7 w-7" />}
        emptyTitle={
          feedTab === "following"
            ? "Todavía no sigues a nadie"
            : "No hay publicaciones"
        }
        emptyDescription={
          feedTab === "following"
            ? "Sigue a desarrolladores para ver sus publicaciones aquí."
            : "Sé el primero en compartir algo con la comunidad."
        }
      />
    </div>
  );
}