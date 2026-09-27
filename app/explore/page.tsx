"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { communities, popularTechnologies, trends } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Feed } from "@/components/feed";
import { Avatar } from "@/components/avatar";
import {
  FlameIcon,
  HashIcon,
  SearchIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/icons";

export default function ExplorePage() {
  const {
    posts,
    getUser,
    search,
    setSearch,
    users,
    following,
    currentUser,
    toggleFollow,
  } = useApp();

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return posts.filter((p) => {
      const author = getUser(p.authorId);
      const haystack = [
        p.content,
        p.hashtags.join(" "),
        p.communitySlug ?? "",
        author?.name ?? "",
        author?.username ?? "",
        author?.technologies.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, search, getUser]);

  const popularPosts = useMemo(
    () => [...posts].sort((a, b) => b.likes - a.likes).slice(0, 5),
    [posts],
  );

  const hashtagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) =>
      p.hashtags.forEach((tag) =>
        counts.set(tag, (counts.get(tag) ?? 0) + 1),
      ),
    );
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [posts]);

  const recommended = users
    .filter((u) => u.id !== currentUser?.id && !following.includes(u.id))
    .slice(0, 3);

  const searchHasQuery = search.trim().length > 0;

  return (
    <div>
      <PageHeader title="Explorar" />

      <div className="p-4 lg:hidden">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en DevX"
            className="w-full rounded-full border border-transparent bg-zinc-900 py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-sky-500/50 focus:bg-black"
          />
        </div>
      </div>

      {searchHasQuery ? (
        <div>
          <p className="border-b border-zinc-900 px-4 py-3 text-sm text-zinc-500">
            Resultados para{" "}
            <span className="font-semibold text-zinc-100">“{search}”</span> ·{" "}
            {results.length}
          </p>
          <Feed
            posts={results}
            emptyIcon={<SearchIcon className="h-7 w-7" />}
            emptyTitle="Sin resultados"
            emptyDescription={`No encontramos publicaciones que coincidan con “${search}”. Prueba con otro término.`}
          />
        </div>
      ) : (
        <div className="space-y-4 p-4">
          <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60">
            <h2 className="flex items-center gap-2 px-4 pb-2 pt-4 text-lg font-bold text-zinc-100">
              <FlameIcon className="h-5 w-5 text-orange-400" />
              Tendencias
            </h2>
            <ul>
              {trends.map((trend) => (
                <li key={trend.id}>
                  <button
                    onClick={() => setSearch(trend.tag)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-zinc-900/70"
                  >
                    <span className="block text-xs text-zinc-500">
                      {trend.category}
                    </span>
                    <span className="block text-sm font-semibold text-zinc-100">
                      {trend.tag}
                    </span>
                    <span className="block text-xs text-zinc-600">
                      {formatCount(trend.posts)} publicaciones
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
            <h2 className="flex items-center gap-2 pb-3 text-lg font-bold text-zinc-100">
              <HashIcon className="h-5 w-5 text-sky-400" />
              Hashtags populares
            </h2>
            <div className="flex flex-wrap gap-2">
              {hashtagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="rounded-full border border-zinc-800 px-3 py-1.5 text-sm text-sky-400 transition-colors hover:border-sky-500/50 hover:bg-zinc-900"
                >
                  #{tag} <span className="text-zinc-600">{count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
            <h2 className="flex items-center gap-2 pb-3 text-lg font-bold text-zinc-100">
              <ZapIcon className="h-5 w-5 text-amber-400" />
              Tecnologías populares
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularTechnologies.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => setSearch(tech.name)}
                  className={`rounded-full border border-zinc-800 px-3 py-1.5 text-sm font-medium transition-colors hover:border-zinc-600 hover:bg-zinc-900 ${tech.color}`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
            <h2 className="flex items-center gap-2 pb-3 text-lg font-bold text-zinc-100">
              <UsersIcon className="h-5 w-5 text-sky-400" />
              Comunidades
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[...communities]
                .sort((a, b) => b.members - a.members)
                .slice(0, 4)
                .map((community) => (
                  <Link
                    key={community.slug}
                    href={`/community/${community.slug}`}
                    className={`rounded-xl border border-zinc-800 bg-gradient-to-br p-3 transition-colors hover:border-zinc-600 ${community.gradient}`}
                  >
                    <span className="text-2xl">{community.emoji}</span>
                    <span className="mt-1 block text-sm font-semibold text-zinc-100">
                      {community.name}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      {formatCount(community.members)} miembros
                    </span>
                  </Link>
                ))}
            </div>
            <Link
              href="/communities"
              className="mt-3 block text-center text-sm font-semibold text-sky-400 hover:underline"
            >
              Ver todas las comunidades
            </Link>
          </section>

          <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60">
            <h2 className="px-4 pb-2 pt-4 text-lg font-bold text-zinc-100">
              Desarrolladores recomendados
            </h2>
            {recommended.length === 0 ? (
              <p className="px-4 py-4 text-sm text-zinc-500">
                Ya sigues a todos los desarrolladores recomendados.
              </p>
            ) : (
              <ul>
                {recommended.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-3 border-t border-zinc-900 px-4 py-3"
                  >
                    <Link href={`/profile/${user.username}`} className="shrink-0">
                      <Avatar user={user} size="sm" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/profile/${user.username}`}
                        className="block truncate text-sm font-semibold text-zinc-100 hover:underline"
                      >
                        {user.name}
                      </Link>
                      <span className="block truncate text-sm text-zinc-500">
                        @{user.username}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFollow(user.username)}
                      className="shrink-0 rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
                    >
                      Seguir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {!searchHasQuery ? (
        <div className="border-t border-zinc-900">
          <h2 className="px-4 py-3 text-lg font-bold text-zinc-100">
            Posts con más likes
          </h2>
          <Feed
            posts={popularPosts}
            emptyIcon={<HashIcon className="h-7 w-7" />}
            emptyTitle="No hay posts populares"
          />
        </div>
      ) : null}
    </div>
  );
}