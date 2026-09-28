"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { QUESTS } from "@/lib/ranks";
import { Feed } from "@/components/feed";
import { FeedTabs } from "@/components/feed-tabs";
import { PostForm } from "@/components/post-form";
import { RankBadge, RankProgress } from "@/components/rank";
import { CheckIcon, CodeIcon } from "@/components/icons";

export default function HomePage() {
  const { posts, following, currentUser, feedTab, questsToday } = useApp();

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

      {currentUser ? (
        <div className="border-b border-zinc-900 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-500">
                Hola, <span className="font-semibold text-zinc-100">{currentUser.name}</span>
              </p>
              <RankProgress xp={currentUser.xp ?? 0} className="mt-2" />
            </div>
            <RankBadge xp={currentUser.xp ?? 0} size="md" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            {QUESTS.map((quest) => {
              const done = questsToday.includes(quest.id);
              return (
                <Link
                  key={quest.id}
                  href="/misiones"
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                    done
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {done ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-zinc-600" />
                  )}
                  {quest.name.split(" ")[0]}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

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