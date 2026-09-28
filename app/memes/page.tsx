"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScrapedResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/skeleton";
import { LaughIcon, RefreshIcon, VideoIcon } from "@/components/icons";

type Tab = "memes" | "videos";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function MemesPage() {
  const [tab, setTab] = useState<Tab>("memes");
  const [data, setData] = useState<ScrapedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (force = false) => {
    try {
      const res = await fetch(`/api/scraped${force ? "?refresh=1" : ""}`);
      const json = (await res.json()) as ScrapedResponse;
      setData(json);
    } catch {
      setData({
        memes: [],
        videos: [],
        fetchedAt: new Date().toISOString(),
        cached: false,
        error: "No se pudo cargar el contenido. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const memes = data?.memes ?? [];
  const videos = data?.videos ?? [];
  const items = tab === "memes" ? memes : videos;

  return (
    <div>
      <PageHeader
        title="Memes y videos"
        subtitle={
          data?.fallback
            ? "Fuente: imgflip (Reddit no respondió)"
            : "r/ProgrammerHumor · r/dankmemes · r/me_irl"
        }
        right={
          <button
            onClick={() => {
              setLoading(true);
              load(true);
            }}
            className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            <RefreshIcon className="h-4 w-4" /> Actualizar
          </button>
        }
      />

      <div className="flex border-b border-zinc-900">
        {(["memes", "videos"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative flex-1 py-3 text-sm font-semibold transition-colors hover:bg-zinc-950"
            >
              <span className={active ? "text-zinc-100" : "text-zinc-500"}>
                {t === "memes" ? `Memes (${data?.memes.length ?? 0})` : `Videos (${data?.videos.length ?? 0})`}
              </span>
              {active ? (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-14 -translate-x-1/2 rounded-full bg-sky-500" />
              ) : null}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : data?.error ? (
        <EmptyState
          icon={<LaughIcon className="h-7 w-7" />}
          title="No se pudo cargar el contenido"
          description={data.error}
          action={
            <button
              onClick={() => load(true)}
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Reintentar
            </button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={tab === "memes" ? <LaughIcon className="h-7 w-7" /> : <VideoIcon className="h-7 w-7" />}
          title={tab === "memes" ? "Sin memes por ahora" : "Sin videos por ahora"}
          description={
            tab === "memes"
              ? "No encontramos memes en las fuentes. Tocá Actualizar."
              : "Esta fuente tiene pocos videos hoy. Tocá Actualizar."
          }
        />
      ) : tab === "memes" ? (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {memes.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 transition-colors hover:border-zinc-600"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-zinc-100">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.source}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {videos.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 transition-colors hover:border-zinc-600"
            >
              <video
                src={item.videoUrl}
                poster={item.poster}
                controls
                preload="metadata"
                className="aspect-video w-full bg-black object-contain"
              />
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-zinc-100">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.source}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}