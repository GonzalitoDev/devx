"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp, guestUser } from "@/lib/store";
import { communityBySlug } from "@/lib/data";
import { formatCount, fullDate } from "@/lib/format";
import { Avatar } from "./avatar";
import { CodeBlock } from "./code-block";
import { PageHeader } from "./page-header";
import { RichText } from "./rich-text";
import { EmptyState } from "./empty-state";
import {
  BookmarkIcon,
  EyeIcon,
  HeartIcon,
  MessageIcon,
  RepeatIcon,
  SendIcon,
  TrashIcon,
  VerifiedIcon,
} from "./icons";

export function PostDetail({ postId }: { postId: string }) {
  const {
    currentUser,
    getUser,
    posts,
    comments,
    liked,
    reposted,
    bookmarks,
    likePost,
    repostPost,
    toggleBookmark,
    deletePost,
    addComment,
    openLogin,
    trackView,
  } = useApp();

  const [reply, setReply] = useState("");

  useEffect(() => {
    trackView(postId);
  }, [postId, trackView]);

  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return (
      <div>
        <PageHeader title="Publicación" back />
        <EmptyState
          icon={<MessageIcon className="h-7 w-7" />}
          title="Publicación no encontrada"
          description="Es posible que haya sido eliminada o que el enlace no sea correcto."
          action={
            <Link
              href="/"
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Volver al inicio
            </Link>
          }
        />
      </div>
    );
  }

  const author = getUser(post.authorId);
  if (!author) return null;

  const community = post.communitySlug
    ? communityBySlug(post.communitySlug)
    : undefined;

  const isLiked = liked.includes(post.id);
  const isReposted = reposted.includes(post.id);
  const isBookmarked = bookmarks.includes(post.id);
  const isOwn = currentUser?.id === post.authorId;

  const postComments = (comments[post.id] ?? []).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleReply = () => {
    if (!reply.trim()) return;
    if (!currentUser) {
      openLogin();
      return;
    }
    addComment(post.id, reply.trim());
    setReply("");
  };

  return (
    <div>
      <PageHeader title="Publicación" back />

      <div className="px-4 py-4">
        <div className="flex gap-3">
          <Link href={`/profile/${author.username}`} className="shrink-0">
            <Avatar user={author} size="lg" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profile/${author.username}`}
                className="flex items-center gap-1 font-bold text-zinc-100 hover:underline"
              >
                {author.name}
                {author.verified ? (
                  <VerifiedIcon className="h-4 w-4 text-sky-400" />
                ) : null}
              </Link>
              <span className="text-zinc-500">@{author.username}</span>
              {isOwn ? (
                <button
                  onClick={() => deletePost(post.id)}
                  className="ml-auto rounded-full p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Eliminar publicación"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <p className="text-sm text-zinc-500">{fullDate(post.createdAt)}</p>
          </div>
        </div>

        <div className="mt-4">
          <RichText text={post.content} className="text-lg text-zinc-100" />
        </div>

        {post.code ? (
          <div className="mt-4">
            <CodeBlock snippet={post.code} />
          </div>
        ) : null}

        {post.image ? (
          <div className="mt-4">
            <img
              src={post.image}
              alt=""
              className="max-h-[420px] w-full rounded-xl border border-zinc-800 object-cover"
            />
          </div>
        ) : null}

        {post.hashtags.length > 0 || community ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.hashtags.map((tag) => (
              <span key={tag} className="text-sky-400">
                #{tag}
              </span>
            ))}
            {community ? (
              <Link
                href={`/community/${community.slug}`}
                className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:text-zinc-100"
              >
                {community.emoji} {community.name}
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex gap-6 border-y border-zinc-900 py-3 text-sm text-zinc-500">
          <span className="flex items-center gap-1.5">
            <EyeIcon className="h-4 w-4" /> {formatCount(post.views)} vistas
          </span>
          <span>{formatCount(post.replies)} respuestas</span>
          <span>{formatCount(post.reposts + (isReposted ? 1 : 0))} reposts</span>
          <span>{formatCount(post.likes + (isLiked ? 1 : 0))} likes</span>
        </div>

        <div className="flex max-w-md items-center justify-between py-3">
          <button
            onClick={() => likePost(post.id)}
            className={`group flex items-center gap-1.5 text-sm transition-colors ${
              isLiked ? "text-rose-500" : "text-zinc-500 hover:text-rose-400"
            }`}
            aria-label="Me gusta"
          >
            <span className="rounded-full p-2 transition-colors group-hover:bg-rose-500/10">
              <HeartIcon
                className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`}
              />
            </span>
          </button>
          <button
            onClick={() => repostPost(post.id)}
            className={`group flex items-center gap-1.5 text-sm transition-colors ${
              isReposted
                ? "text-emerald-400"
                : "text-zinc-500 hover:text-emerald-400"
            }`}
            aria-label="Repostear"
          >
            <span className="rounded-full p-2 transition-colors group-hover:bg-emerald-500/10">
              <RepeatIcon className="h-5 w-5" />
            </span>
          </button>
          <button
            onClick={() => toggleBookmark(post.id)}
            className={`group flex items-center gap-1.5 text-sm transition-colors ${
              isBookmarked
                ? "text-sky-400"
                : "text-zinc-500 hover:text-sky-400"
            }`}
            aria-label="Guardar"
          >
            <span className="rounded-full p-2 transition-colors group-hover:bg-sky-500/10">
              <BookmarkIcon
                className={`h-5 w-5 ${isBookmarked ? "fill-sky-400" : ""}`}
              />
            </span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `${window.location.origin}/post/${post.id}`,
              );
            }}
            className="flex items-center text-sm text-zinc-500 transition-colors hover:text-sky-400"
            aria-label="Copiar enlace"
          >
            <span className="rounded-full p-2 transition-colors hover:bg-sky-500/10">
              <SendIcon className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>

      <div className="flex gap-3 border-t border-zinc-900 p-4">
        <Avatar user={currentUser ?? guestUser} size="md" />
        <div className="flex-1">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
            placeholder="Publica tu respuesta"
            className="w-full resize-none bg-transparent text-[15px] text-zinc-100 placeholder-zinc-600 outline-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleReply}
              disabled={!reply.trim()}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                reply.trim()
                  ? "bg-sky-500 text-white hover:bg-sky-400"
                  : "cursor-not-allowed bg-zinc-800 text-zinc-500"
              }`}
            >
              Responder
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900">
        {postComments.length === 0 ? (
          <EmptyState
            icon={<MessageIcon className="h-7 w-7" />}
            title="Sin respuestas todavía"
            description="Sé el primero en responder a esta publicación."
          />
        ) : (
          postComments.map((comment) => {
            const commentAuthor = getUser(comment.authorId);
            if (!commentAuthor) return null;
            return (
              <div
                key={comment.id}
                className="flex gap-3 border-b border-zinc-900 px-4 py-3"
              >
                <Link
                  href={`/profile/${commentAuthor.username}`}
                  className="shrink-0"
                >
                  <Avatar user={commentAuthor} size="sm" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Link
                      href={`/profile/${commentAuthor.username}`}
                      className="font-semibold text-zinc-100 hover:underline"
                    >
                      {commentAuthor.name}
                    </Link>
                    <span className="text-zinc-500">
                      @{commentAuthor.username} · {fullDate(comment.createdAt)}
                    </span>
                  </div>
                  <RichText
                    text={comment.content}
                    className="mt-1 text-[15px] text-zinc-200"
                  />
                  {comment.code ? (
                    <div className="mt-2">
                      <CodeBlock snippet={comment.code} />
                    </div>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-600">
                    {formatCount(comment.likes)} likes
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}