import { NextResponse } from "next/server";
import type { ScrapedMeme, ScrapedResponse, ScrapedVideo } from "@/lib/types";

export const dynamic = "force-dynamic";

const SUBS = ["ProgrammerHumor", "dankmemes", "me_irl"];
const TTL = 15 * 60 * 1000; // 15 minutos de caché

let cache: {
  at: number;
  memes: ScrapedMeme[];
  clips: ScrapedMeme[];
  videos: ScrapedVideo[];
} | null = null;

function dedupe<T extends { id: string }>(list: T[]): T[] {
  const seen = new Set<string>();
  return list.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/** Memes e imágenes animadas (GIF) vía meme-api.com, proxy de subreddits. */
async function scrapeMemesFromMemeApi(): Promise<{
  memes: ScrapedMeme[];
  clips: ScrapedMeme[];
}> {
  const memes: ScrapedMeme[] = [];
  const clips: ScrapedMeme[] = [];
  for (const sub of SUBS) {
    try {
      const res = await fetch(`https://meme-api.com/gimme/${sub}/20`, {
        cache: "no-store",
      });
      if (!res.ok) continue;
      const json = await res.json();
      const items = Array.isArray(json?.memes) ? json.memes : [];
      for (const m of items) {
        if (typeof m?.url !== "string") continue;
        const entry: ScrapedMeme = {
          id: m.postLink ?? m.url,
          title: m.title ?? "Meme",
          image: m.url,
          url: m.postLink ?? m.url,
          source: `r/${m.subreddit ?? sub}`,
        };
        if (/\.gif(\?|$)/i.test(m.url)) {
          clips.push(entry);
        } else {
          memes.push(entry);
        }
      }
    } catch {
      // siguiente subreddit
    }
  }
  return {
    memes: dedupe(memes).slice(0, 30),
    clips: dedupe(clips).slice(0, 15),
  };
}

/** Videos hospedados por Reddit (best-effort; algunos IPs lo bloquean). */
async function scrapeRedditVideos(): Promise<ScrapedVideo[]> {
  const videos: ScrapedVideo[] = [];
  for (const sub of SUBS) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/top.json?t=day&limit=50&raw_json=1`,
        {
          headers: {
            "User-Agent": "devx-scraper/1.0 (red social de developers)",
            Accept: "application/json, text/plain, */*",
          },
          cache: "no-store",
        },
      );
      if (!res.ok) continue;
      const json = await res.json();
      const children = json?.data?.children ?? [];
      for (const child of children) {
        const d = child?.data;
        const fallbackUrl = d?.media?.reddit_video?.fallback_url;
        if (
          d?.post_hint === "hosted:video" &&
          typeof fallbackUrl === "string"
        ) {
          videos.push({
            id: d.id,
            title: d.title,
            videoUrl: fallbackUrl,
            poster: typeof d.url === "string" ? d.url : undefined,
            url: `https://www.reddit.com${d.permalink}`,
            source: `r/${d.subreddit}`,
          });
        }
      }
    } catch {
      // siguiente subreddit
    }
  }
  return dedupe(videos).slice(0, 15);
}

/** Fallback: plantillas de Imgflip (si meme-api no responde). */
async function scrapeImgflip(): Promise<ScrapedMeme[]> {
  const res = await fetch("https://api.imgflip.com/get_memes", {
    cache: "no-store",
  });
  const json = await res.json();
  if (!json?.success) return [];
  return (json.data.memes ?? [])
    .slice(0, 30)
    .map((m: { id: string; name: string; url: string }) => ({
      id: m.id,
      title: m.name,
      image: m.url,
      url: m.url,
      source: "imgflip",
    }));
}

export async function GET(request: Request) {
  const refresh = new URL(request.url).searchParams.get("refresh") === "1";

  if (!refresh && cache && Date.now() - cache.at < TTL) {
    const response: ScrapedResponse = {
      ...cache,
      fetchedAt: new Date().toISOString(),
      cached: true,
    };
    return NextResponse.json(response);
  }

  let memes: ScrapedMeme[] = [];
  let clips: ScrapedMeme[] = [];
  let fallback = false;
  try {
    const scraped = await scrapeMemesFromMemeApi();
    memes = scraped.memes;
    clips = scraped.clips;
  } catch {
    // sin contenido
  }
  if (memes.length === 0 && clips.length === 0) {
    try {
      memes = await scrapeImgflip();
      fallback = true;
    } catch {
      fallback = true;
    }
  }

  const videos = await scrapeRedditVideos().catch(() => []);

  cache = { at: Date.now(), memes, clips, videos };
  const response: ScrapedResponse = {
    memes,
    clips,
    videos,
    fetchedAt: new Date().toISOString(),
    cached: false,
    fallback,
  };
  return NextResponse.json(response);
}