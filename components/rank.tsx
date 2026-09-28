import { getRank, rankProgress } from "@/lib/ranks";

export function RankBadge({
  xp,
  size = "sm",
  className = "",
}: {
  xp: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const rank = getRank(xp);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${rank.chip} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      } ${className}`}
      title={`${rank.name} · ${rank.emoji}`}
    >
      <span>{rank.emoji}</span>
      <span>{rank.name}</span>
    </span>
  );
}

export function RankProgress({ xp, className = "" }: { xp: number; className?: string }) {
  const { current, next, currentXp, nextXp, pct } = rankProgress(xp);
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-200">
          {current.emoji} {current.name}
        </span>
        {next ? (
          <span className="text-zinc-500">
            {currentXp}/{nextXp} XP ·{" "}
            <span className="text-zinc-400">{next.emoji} {next.name}</span>
          </span>
        ) : (
          <span className="text-zinc-500">Nivel máximo</span>
        )}
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}