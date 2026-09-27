"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/lib/store";
import type { Community } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { PageHeader } from "./page-header";
import { EmptyState } from "./empty-state";
import { PostCard } from "./post-card";
import { UsersIcon } from "./icons";

export function CommunityView({ community }: { community: Community }) {
  const { posts, joinedCommunities, toggleJoinCommunity } = useApp();
  const isJoined = joinedCommunities.includes(community.slug);

  const communityPosts = useMemo(
    () =>
      posts
        .filter((p) => p.communitySlug === community.slug)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [posts, community.slug],
  );

  const members = community.members + (isJoined ? 1 : 0);

  return (
    <div>
      <PageHeader title={community.name} back />

      <div
        className={`flex h-36 w-full items-end justify-between bg-gradient-to-br p-4 sm:h-44 ${community.gradient}`}
      >
        <span className="text-5xl" role="img" aria-label={community.name}>
          {community.emoji}
        </span>
      </div>

      <div className="px-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{community.name}</h1>
            <p className="text-sm text-zinc-500">
              /{community.slug} · {formatCount(members)} miembros ·{" "}
              {formatCount(communityPosts.length || community.posts)} publicaciones
            </p>
          </div>
          <button
            onClick={() => toggleJoinCommunity(community.slug)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              isJoined
                ? "border border-zinc-700 text-zinc-100 hover:border-red-500/50 hover:text-red-400"
                : "bg-sky-500 text-white hover:bg-sky-400"
            }`}
          >
            {isJoined ? "Unido" : "Unirse"}
          </button>
        </div>

        <p className="mt-3 text-[15px] text-zinc-200">{community.description}</p>

        {community.technologies.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {community.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <h2 className="border-b border-zinc-900 px-4 py-3 text-lg font-bold text-zinc-100">
          Publicaciones
        </h2>
        {communityPosts.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-7 w-7" />}
            title="Sin publicaciones todavía"
            description="Sé el primero en publicar en esta comunidad."
            action={
              <Link
                href="/"
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
              >
                Ir al inicio
              </Link>
            }
          />
        ) : (
          communityPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}