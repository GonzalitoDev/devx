"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Feed } from "@/components/feed";
import { BookmarkIcon } from "@/components/icons";

export default function BookmarksPage() {
  const { posts, bookmarks } = useApp();
  const bookmarkedPosts = posts.filter((p) => bookmarks.includes(p.id));

  return (
    <div>
      <PageHeader title="Guardados" subtitle={`${bookmarks.length} publicaciones`} />

      <Feed
        posts={bookmarkedPosts}
        emptyIcon={<BookmarkIcon className="h-7 w-7" />}
        emptyTitle="No tienes publicaciones guardadas"
        emptyDescription="Toca el icono de guardar en cualquier publicación para encontrarla aquí."
        emptyAction={
          <Link
            href="/explore"
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          >
            Explorar
          </Link>
        }
      />
    </div>
  );
}