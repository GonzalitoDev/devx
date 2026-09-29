export interface Rank {
  level: number;
  name: string;
  emoji: string;
  minXp: number;
  color: string;
  chip: string;
  perks: string[];
}

export const RANKS: Rank[] = [
  {
    level: 1,
    name: "Novato",
    emoji: "🥉",
    minXp: 0,
    color: "text-zinc-400",
    chip: "border-zinc-700 bg-zinc-900 text-zinc-300",
    perks: ["Publicar texto y código", "Comentar y reaccionar", "Guardar y comunidades", "Mensajes y memes"],
  },
  {
    level: 2,
    name: "Aprendiz",
    emoji: "🔧",
    minXp: 50,
    color: "text-emerald-400",
    chip: "border-emerald-700/40 bg-emerald-500/10 text-emerald-300",
    perks: ["Imágenes en publicaciones", "Perfil con banner"],
  },
  {
    level: 3,
    name: "Junior",
    emoji: "💻",
    minXp: 150,
    color: "text-sky-400",
    chip: "border-sky-700/40 bg-sky-500/10 text-sky-300",
    perks: ["Destacar publicaciones", "Iniciar conversaciones nuevas"],
  },
  {
    level: 4,
    name: "Mid",
    emoji: "🚀",
    minXp: 300,
    color: "text-violet-400",
    chip: "border-violet-700/40 bg-violet-500/10 text-violet-300",
    perks: ["Videos en publicaciones"],
  },
  {
    level: 5,
    name: "Senior",
    emoji: "⚡",
    minXp: 500,
    color: "text-amber-400",
    chip: "border-amber-700/40 bg-amber-500/10 text-amber-300",
    perks: ["Modo foco personalizado"],
  },
  {
    level: 6,
    name: "Arquitecto",
    emoji: "🏗️",
    minXp: 800,
    color: "text-orange-400",
    chip: "border-orange-700/40 bg-orange-500/10 text-orange-300",
    perks: ["Emblema exclusivo de arquitecto"],
  },
  {
    level: 7,
    name: "Líder",
    emoji: "👑",
    minXp: 1200,
    color: "text-yellow-400",
    chip: "border-yellow-600/40 bg-yellow-500/10 text-yellow-300",
    perks: ["Mediación de comunidades"],
  },
  {
    level: 8,
    name: "Maestro",
    emoji: "🧠",
    minXp: 1800,
    color: "text-fuchsia-400",
    chip: "border-fuchsia-700/40 bg-fuchsia-500/10 text-fuchsia-300",
    perks: ["Tutoriales destacados", "Acceso anticipado"],
  },
  {
    level: 9,
    name: "Legendario",
    emoji: "🐉",
    minXp: 2600,
    color: "text-rose-400",
    chip: "border-rose-700/40 bg-rose-500/10 text-rose-300",
    perks: ["Insignia Legendario", "Rol en la plataforma"],
  },
];

export function getRank(xp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) current = rank;
  }
  return current;
}

export function getRankByLevel(level: number): Rank {
  return RANKS.find((r) => r.level === level) ?? RANKS[0];
}

export function rankProgress(xp: number): {
  current: Rank;
  next: Rank | null;
  currentXp: number;
  nextXp: number;
  pct: number;
} {
  const current = getRank(xp);
  const next = RANKS.find((r) => r.level === current.level + 1) ?? null;
  if (!next) {
    return { current, next, currentXp: xp, nextXp: xp, pct: 100 };
  }
  const span = next.minXp - current.minXp;
  const progress = Math.min(100, Math.max(0, ((xp - current.minXp) / span) * 100));
  return {
    current,
    next,
    currentXp: xp - current.minXp,
    nextXp: next.minXp - current.minXp,
    pct: progress,
  };
}

export type GatedFeature = "images" | "boost" | "video";

export const FEATURE_MIN_RANK: Record<GatedFeature, number> = {
  images: 2,
  boost: 3,
  video: 4,
};

export function canUse(xp: number, feature: GatedFeature): boolean {
  return getRank(xp).level >= FEATURE_MIN_RANK[feature];
}

export function requiredRankFor(feature: GatedFeature): Rank {
  return getRankByLevel(FEATURE_MIN_RANK[feature]);
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  xp: number;
}

export const QUESTS: Quest[] = [
  {
    id: "post",
    name: "Publica una contribución",
    description: "Compartí código, una idea o un tutorial.",
    xp: 10,
  },
  {
    id: "reply",
    name: "Responde a alguien",
    description: "Comentá una publicación de la comunidad.",
    xp: 5,
  },
  {
    id: "practice",
    name: "Resolvé un reto",
    description: "Completá un ejercicio en la zona de práctica.",
    xp: 10,
  },
  {
    id: "daily",
    name: "Recompensa diaria",
    description: "Entrá a DevX hoy y mantené tu racha.",
    xp: 3,
  },
];

export const XP_ACTIONS = {
  post: 10,
  reply: 5,
  likeReceived: 1,
  practice: 10,
  daily: 3,
};