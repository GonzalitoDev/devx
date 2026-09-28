"use client";

import { useApp } from "@/lib/store";
import { QUESTS, rankProgress } from "@/lib/ranks";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { RankBadge, RankProgress } from "@/components/rank";
import { CheckIcon, FlameIcon, RocketIcon } from "@/components/icons";

export default function MisionesPage() {
  const { currentUser, questsToday, claimDaily, openLogin } = useApp();

  if (!currentUser) {
    return (
      <EmptyState
        icon={<RocketIcon className="h-7 w-7" />}
        title="Inicia sesión para ganar XP"
        description="Las misiones te dan XP para subir de rango y desbloquear funciones."
        action={
          <button
            onClick={openLogin}
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          >
            Iniciar sesión
          </button>
        }
      />
    );
  }

  const xp = currentUser.xp ?? 0;
  const progress = rankProgress(xp);

  return (
    <div>
      <PageHeader title="Misiones diarias" subtitle="Gana XP y sube de rango" />

      <div className="border-b border-zinc-900 p-4">
        <div className="flex items-center justify-between gap-3">
          <RankBadge xp={xp} size="md" />
          <span className="flex items-center gap-1 text-sm text-orange-400">
            <FlameIcon className="h-4 w-4" /> Racha {currentUser.streak ?? 0} días
          </span>
        </div>
        <RankProgress xp={xp} className="mt-3" />
        <p className="mt-2 text-sm text-zinc-500">
          {progress.next
            ? `Faltan ${progress.nextXp - progress.currentXp} XP para ${progress.next.emoji} ${progress.next.name}`
            : "Alcanzaste el rango máximo 🎉"}
        </p>
      </div>

      <div className="space-y-3 p-4">
        {QUESTS.map((quest) => {
          const done = questsToday.includes(quest.id);
          return (
            <div
              key={quest.id}
              className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 text-zinc-500"
                }`}
              >
                {done ? <CheckIcon className="h-5 w-5" /> : <RocketIcon className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`font-semibold ${
                    done ? "text-zinc-500 line-through" : "text-zinc-100"
                  }`}
                >
                  {quest.name}
                </p>
                <p className="text-sm text-zinc-500">{quest.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-emerald-400">
                  +{quest.xp} XP
                </span>
                {quest.id === "daily" ? (
                  done ? (
                    <span className="text-xs text-zinc-500">Reclamada</span>
                  ) : (
                    <button
                      onClick={() => void claimDaily()}
                      className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-400"
                    >
                      Reclamar
                    </button>
                  )
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-6">
        <p className="text-xs leading-relaxed text-zinc-600">
          Publicar, comentar y recibir likes también suman XP automáticamente. Tu
          racha crece cada día que reclamás la recompensa diaria.
        </p>
      </div>
    </div>
  );
}