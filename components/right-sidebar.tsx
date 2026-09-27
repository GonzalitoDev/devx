"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { popularTechnologies, trends } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { Avatar } from "./avatar";
import { FlameIcon, SearchIcon } from "./icons";

function SearchBox() {
  const { search, setSearch } = useApp();
  const router = useRouter();

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") router.push("/explore");
        }}
        placeholder="Buscar en DevX"
        className="w-full rounded-full border border-transparent bg-zinc-900 py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-sky-500/50 focus:bg-black"
      />
    </div>
  );
}

export function RightSidebar() {
  const { users, following, currentUser, toggleFollow, setSearch } = useApp();
  const router = useRouter();

  const recommended = users
    .filter((u) => u.id !== currentUser?.id && !following.includes(u.id))
    .slice(0, 3);

  const goToTag = (tag: string) => {
    setSearch(tag);
    router.push("/explore");
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto py-3 pr-3">
      <div className="sticky top-3">
        <SearchBox />
      </div>

      <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60">
        <h2 className="flex items-center gap-2 px-4 pb-2 pt-4 text-lg font-bold text-zinc-100">
          <FlameIcon className="h-5 w-5 text-orange-400" />
          Tendencias
        </h2>
        <ul>
          {trends.slice(0, 5).map((trend) => (
            <li key={trend.id}>
              <button
                onClick={() => goToTag(trend.tag)}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-zinc-900/70"
              >
                <span className="block text-xs text-zinc-500">{trend.category}</span>
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
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-900/70"
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

      <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
        <h2 className="pb-3 text-lg font-bold text-zinc-100">
          Tecnologías populares
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTechnologies.map((tech) => (
            <button
              key={tech.name}
              onClick={() => goToTag(tech.name)}
              className={`rounded-full border border-zinc-800 px-3 py-1.5 text-sm font-medium transition-colors hover:border-zinc-600 hover:bg-zinc-900 ${tech.color}`}
            >
              {tech.name}
            </button>
          ))}
        </div>
      </section>

      <p className="px-2 text-xs leading-relaxed text-zinc-600">
        DevX · Una red social para desarrolladores. Construido con Next.js,
        React y Tailwind CSS.
      </p>
    </div>
  );
}