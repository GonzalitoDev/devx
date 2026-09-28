"use client";

import { useApp } from "@/lib/store";
import { getRank, RANKS } from "@/lib/ranks";
import { PageHeader } from "@/components/page-header";
import { LockIcon } from "@/components/icons";

export default function RangosPage() {
  const { currentUser } = useApp();
  const myXp = currentUser?.xp ?? 0;
  const myRank = getRank(myXp);

  return (
    <div>
      <PageHeader title="Rangos" subtitle="Sube de nivel y desbloquea funciones" />

      {currentUser ? (
        <div className="border-b border-zinc-900 p-4 text-sm text-zinc-400">
          Tu rango:{" "}
          <span className="font-semibold text-zinc-100">
            {myRank.emoji} {myRank.name}
          </span>{" "}
          · {myXp} XP
        </div>
      ) : (
        <div className="border-b border-zinc-900 p-4 text-sm text-zinc-500">
          Iniciá sesión para ver tu rango y desbloquear funciones.
        </div>
      )}

      <div className="space-y-2 p-4">
        {RANKS.map((rank) => {
          const unlocked = myXp >= rank.minXp;
          const isCurrent = myRank.level === rank.level;
          return (
            <div
              key={rank.level}
              className={`rounded-2xl border p-4 transition-colors ${
                isCurrent
                  ? "border-sky-500/50 bg-sky-500/5"
                  : "border-zinc-800 bg-zinc-950/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rank.emoji}</span>
                  <div>
                    <p className="font-bold text-zinc-100">
                      {rank.name}{" "}
                      {unlocked ? (
                        <span className="text-xs font-semibold text-emerald-400">
                          · Desbloqueado
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-zinc-500">
                          · {rank.minXp} XP
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Desde {rank.minXp} XP
                    </p>
                  </div>
                </div>
                {!unlocked ? <LockIcon className="h-4 w-4 text-zinc-600" /> : null}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rank.perks.map((perk) => (
                  <span
                    key={perk}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      unlocked
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {perk}
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