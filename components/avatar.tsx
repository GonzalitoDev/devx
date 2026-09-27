import type { User } from "@/lib/types";

const PALETTES = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-500",
  "from-lime-500 to-emerald-400",
  "from-fuchsia-500 to-purple-500",
];

const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
  "2xl": "h-28 w-28 text-3xl",
} as const;

export type AvatarSize = keyof typeof SIZES;

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function avatarGradient(value: string): string {
  return PALETTES[hashSeed(value) % PALETTES.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  user,
  size = "md",
  className = "",
}: {
  user: Pick<User, "name" | "username">;
  size?: AvatarSize;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(
        user.username,
      )} font-semibold text-white ${SIZES[size]} ${className}`}
      aria-label={`Avatar de ${user.name}`}
    >
      {initials(user.name)}
    </div>
  );
}