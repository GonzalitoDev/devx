"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { popularTechnologies } from "@/lib/data";
import { getRank, QUESTS } from "@/lib/ranks";
import { formatCount } from "@/lib/format";
import { Avatar } from "./avatar";
import { RankBadge, RankProgress } from "./rank";
import {
  CheckIcon,
  ChevronRightIcon,
  LockIcon,
  SearchIcon,
  TrophyIcon,
} from "./icons";

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
  const { users, currentUser, questsToday, openLogin, setSearch } = useApp();
  const router = useRouter();

  const topDevelopers = [...users]
    .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
    .slice(0, 5);

  const goToTag = (tag: string) => {
    setSearch(tag);
    router.push("/explore");
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto py-3 pr-3">
      <div className="sticky top-3">
        <SearchBox />
      </div>

      {currentUser ? (
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
          <h2 className="flex items-center justify-between text-base font-bold text-zinc-100">
            Tu progreso
            <Link
              href="/misiones"
              className="flex items-center text-xs font-semibold text-sky-400 hover:underline"
            >
              Misiones <ChevronRightIcon className="h-3.5 w-3.5" />
            </Link>
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <Avatar user={currentUser} size="md" />
            <div className="min-w-0 flex-1">
              <RankBadge xp={currentUser.xp ?? 0} size="md" />
              <p className="mt-1 text-xs text-zinc-500">
                🔥 Racha de {currentUser.streak ?? 0} días
              </p>
            </div>
          </div>
          <RankProgress xp={currentUser.xp ?? 0} className="mt-3" />
          <ul className="mt-3 space-y-1.5">
            {QUESTS.map((quest) => {
              const done = questsToday.includes(quest.id);
              return (
                <li key={quest.id} className="flex items-center gap-2 text-xs">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      done
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-700 text-zinc-600"
                    }`}
                  >
                    {done ? <CheckIcon className="h-3 w-3" /> : null}
                  </span>
                  <span className={done ? "text-zinc-500 line-through" : "text-zinc-300"}>
                    {quest.name}
                  </span>
                  <span className="ml-auto text-emerald-400">+{quest.xp}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
          <h2 className="text-base font-bold text-zinc-100">Sube de rango</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Gana XP publicando y reaccionando para desbloquear funciones por rango.
          </p>
          <button
            onClick={openLogin}
            className="mt-3 w-full rounded-full bg-sky-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
          >
            Empezar ahora
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60">
        <h2 className="flex items-center gap-2 px-4 pb-2 pt-4 text-lg font-bold text-zinc-100">
          <TrophyIcon className="h-5 w-5 text-amber-400" />
          Top DevX
        </h2>
        <ul>
          {topDevelopers.map((user, index) => (
            <li key={user.id}>
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-900/70"
              >
                <span className="w-5 text-center text-sm font-bold text-zinc-500">
                  {index + 1}
                </span>
                <Avatar user={user} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-100">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">
                    @{user.username} · {getRank(user.xp ?? 0).emoji}{" "}
                    {getRank(user.xp ?? 0).name}
                  </span>
                </span>
                <span className="text-xs text-zinc-600">
                  {formatCount(user.xp ?? 0)} XP
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/rangos"
          className="block px-4 py-3 text-center text-sm font-semibold text-sky-400 hover:underline"
        >
          Ver todos los rangos
        </Link>
      </section>

      <section className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4">
        <h2 className="flex items-center gap-2 pb-3 text-lg font-bold text-zinc-100">
          <LockIcon className="h-5 w-5 text-sky-400" />
          Funciones por rango
        </h2>
        <div className="space-y-2">
          {[
            ["Imágenes", 2],
            ["Destacar publicaciones", 3],
            ["Videos", 4],
          ].map(([label, level]) => (
            <Link
              key={String(label)}
              href="/rangos"
              className="flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600"
            >
              <span>{label}</span>
              <span className="text-xs text-zinc-500">Rango {level}</span>
            </Link>
          ))}
        </div>
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
        DevX · Plataforma de developers con rangos, XP y misiones. Construido con
        Next.js, React y Tailwind CSS.
      </p>
    </div>
  );
}