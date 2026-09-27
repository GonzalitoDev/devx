"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { communities } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { UsersIcon } from "@/components/icons";

export default function CommunitiesPage() {
  const { joinedCommunities, toggleJoinCommunity } = useApp();

  return (
    <div>
      <PageHeader
        title="Comunidades"
        subtitle={`${communities.length} comunidades activas`}
      />

      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {communities.map((community) => {
          const isJoined = joinedCommunities.includes(community.slug);
          return (
            <div
              key={community.slug}
              className={`rounded-2xl border border-zinc-800 bg-gradient-to-br p-4 transition-colors ${community.gradient}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl" role="img" aria-label={community.name}>
                  {community.emoji}
                </span>
                <button
                  onClick={() => toggleJoinCommunity(community.slug)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    isJoined
                      ? "border border-zinc-600 text-zinc-200 hover:border-red-500/50 hover:text-red-400"
                      : "bg-zinc-100 text-zinc-900 hover:bg-white"
                  }`}
                >
                  {isJoined ? "Unido" : "Unirse"}
                </button>
              </div>

              <Link href={`/community/${community.slug}`}>
                <h2 className="mt-3 text-lg font-bold text-zinc-100 hover:underline">
                  {community.name}
                </h2>
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                {community.description}
              </p>

              <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  {formatCount(community.members)} miembros
                </span>
                <span>{formatCount(community.posts)} publicaciones</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {community.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}