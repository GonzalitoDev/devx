"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp, guestUser } from "@/lib/store";
import { communityBySlug } from "@/lib/data";
import type { Post } from "@/lib/types";
import { formatCount, timeAgo } from "@/lib/format";
import { Avatar } from "./avatar";
import { CodeBlock } from "./code-block";
import { RichText } from "./rich-text";
import {
  BookmarkIcon,
  HeartIcon,
  MessageIcon,
  RepeatIcon,
  SendIcon,
  TrashIcon,
  VerifiedIcon,
} from "./icons";

const KIND_LABELS: Record<Post["kind"], string> = {
  code: "Código",
  project: "Proyecto",
  question: "Pregunta",
  tutorial: "Tutorial",
  news: "Noticias",
  idea: "Idea",
  experience: "Experiencia",
};

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const {
    currentUser,
    getUser,
    liked,
    reposted,
    bookmarks,
    following,
    likePost,
    repostPost,
    toggleBookmark,
    deletePost,
    addComment,
    openLogin,
  } = useApp();

  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const author = getUser(post.authorId);
  if (!author) return null;

  const community = post.communitySlug
    ? communityBySlug(post.communitySlug)
    : undefined;

  const isLiked = liked.includes(post.id);
  const isReposted = reposted.includes(post.id);
  const isBookmarked = bookmarks.includes(post.id);
  const isOwn = currentUser?.id === post.authorId;
  const isFollowing = following.includes(author.id);

  const handleReply = () => {
    if (!replyText.trim()) return;
    addComment(post.id, replyText.trim());
    setReplyText("");
    setReplying(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${post.id}`,
      );
    } catch {
      // clipboard no disponible
    }
  };

  const likes = post.likes + (isLiked ? 1 : 0);
  const repostCount = post.reposts + (isReposted ? 1 : 0);

  return (
    <article className="border-b border-zinc-900 px-4 py-3 transition-colors hover:bg-zinc-950/60">
      <div className="flex gap-3">
        <Link
          href={`/profile/${author.username}`}
          className="mt-0.5 shrink-0"
        >
          <Avatar user={author} size="md" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[15px]">
            <Link
              href={`/profile/${author.username}`}
              className="flex items-center gap-1 font-semibold text-zinc-100 hover:underline"
            >
              {author.name}
              {author.verified ? (
                <VerifiedIcon className="h-4 w-4 text-sky-400" />
              ) : null}
            </Link>
            <span className="text-zinc-500">@{author.username}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">{timeAgo(post.createdAt)}</span>
            <span className="ml-auto flex items-center gap-1.5">
              {community ? (
                <Link
                  href={`/community/${community.slug}`}
                  className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {community.emoji} {community.name}
                </Link>
              ) : null}
              {isOwn ? (
                <button
                  onClick={() => deletePost(post.id)}
                  className="rounded-full p-1 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Eliminar publicación"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              ) : null}
            </span>
          </div>

          <button
            onClick={() => router.push(`/post/${post.id}`)}
            className="mt-1 block w-full cursor-pointer text-left"
          >
            <RichText text={post.content} className="text-[15px] text-zinc-100" />
          </button>

          {post.code ? (
            <button
              onClick={() => router.push(`/post/${post.id}`)}
              className="mt-3 block w-full cursor-pointer text-left"
            >
              <CodeBlock snippet={post.code} />
            </button>
          ) : null}

          {post.image ? (
            <button
              onClick={() => router.push(`/post/${post.id}`)}
              className="mt-3 block w-full cursor-pointer text-left"
            >
              <img
                src={post.image}
                alt=""
                loading="lazy"
                className="max-h-72 w-full rounded-xl border border-zinc-800 object-cover"
              />
            </button>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-1">
            {post.hashtags.map((tag) => (
              <span key={tag} className="text-sm text-sky-400">
                #{tag}
              </span>
            ))}
            <span className="ml-auto rounded-md border border-zinc-800 px-1.5 py-0.5 text-[11px] uppercase tracking-wide text-zinc-500">
              {KIND_LABELS[post.kind]}
            </span>
          </div>

          <div className="mt-2 flex max-w-md items-center justify-between">
            <button
              onClick={() => {
                if (!currentUser) {
                  openLogin();
                  return;
                }
                setReplying((v) => !v);
              }}
              className="group flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-sky-400"
              aria-label="Responder"
            >
              <span className="rounded-full p-1.5 transition-colors group-hover:bg-sky-500/10">
                <MessageIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[13px]">{formatCount(post.replies)}</span>
            </button>

            <button
              onClick={() => repostPost(post.id)}
              className={`group flex items-center gap-1.5 transition-colors ${
                isReposted ? "text-emerald-400" : "text-zinc-500 hover:text-emerald-400"
              }`}
              aria-label="Repostear"
            >
              <span className="rounded-full p-1.5 transition-colors group-hover:bg-emerald-500/10">
                <RepeatIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[13px]">{formatCount(repostCount)}</span>
            </button>

            <button
              onClick={() => likePost(post.id)}
              className={`group flex items-center gap-1.5 transition-colors ${
                isLiked ? "text-rose-500" : "text-zinc-500 hover:text-rose-400"
              }`}
              aria-label="Me gusta"
            >
              <span className="rounded-full p-1.5 transition-colors group-hover:bg-rose-500/10">
                <HeartIcon
                  className={`h-[18px] w-[18px] ${isLiked ? "fill-rose-500" : ""}`}
                />
              </span>
              <span className="text-[13px]">{formatCount(likes)}</span>
            </button>

            <button
              onClick={() => toggleBookmark(post.id)}
              className={`group flex items-center gap-1.5 transition-colors ${
                isBookmarked ? "text-sky-400" : "text-zinc-500 hover:text-sky-400"
              }`}
              aria-label="Guardar"
            >
              <span className="rounded-full p-1.5 transition-colors group-hover:bg-sky-500/10">
                <BookmarkIcon
                  className={`h-[18px] w-[18px] ${isBookmarked ? "fill-sky-400" : ""}`}
                />
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center text-zinc-500 transition-colors hover:text-sky-400"
              aria-label="Copiar enlace"
            >
              <span className="rounded-full p-1.5 transition-colors hover:bg-sky-500/10">
                <SendIcon className="h-[18px] w-[18px]" />
              </span>
            </button>
          </div>

          {isFollowing ? (
            <p className="mt-1 text-xs text-zinc-600">
              Siguen a @{author.username} ·{" "}
              {formatCount(author.followers + (isFollowing ? 1 : 0))} seguidores
            </p>
          ) : null}

          {replying ? (
            <div className="mt-3 flex gap-3 border-t border-zinc-900 pt-3">
              <Avatar user={currentUser ?? guestUser} size="sm" />
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  placeholder={`Responde a @${author.username}`}
                  className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplying(false)}
                    className="rounded-full px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-900"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                      replyText.trim()
                        ? "bg-sky-500 text-white hover:bg-sky-400"
                        : "cursor-not-allowed bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    Responder
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}