export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".0", "")}K`;
  return String(n);
}

export function fullDate(date: string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function joinedDate(date: string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}