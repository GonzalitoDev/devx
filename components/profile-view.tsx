"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { projects } from "@/lib/data";
import type { Comment, Post, User } from "@/lib/types";
import { formatCount, joinedDate, timeAgo } from "@/lib/format";
import { Avatar, avatarGradient } from "./avatar";
import { EmptyState } from "./empty-state";
import { PostCard } from "./post-card";
import { RichText } from "./rich-text";
import {
  CalendarIcon,
  CheckIcon,
  GithubIcon,
  GlobeIcon,
  MapPinIcon,
  MessageIcon,
  RocketIcon,
  VerifiedIcon,
} from "./icons";

type ProfileTab = "posts" | "replies" | "projects" | "likes";

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "replies", label: "Respuestas" },
  { id: "projects", label: "Proyectos" },
  { id: "likes", label: "Likes" },
];

export function ProfileView({ user }: { user: User }) {
  const router = useRouter();
  const {
    currentUser,
    posts,
    comments,
    liked,
    following,
    toggleFollow,
    openEditProfile,
    openConversation,
  } = useApp();
  const [tab, setTab] = useState<ProfileTab>("posts");

  const isOwn = currentUser?.id === user.id;
  const isFollowing = following.includes(user.id);
  const followers = user.followers + (isFollowing ? 1 : 0);
  const followingCount = isOwn ? following.length : user.following;

  const userPosts = useMemo(
    () =>
      posts
        .filter((p) => p.authorId === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [posts, user.id],
  );

  const userReplies = useMemo(
    () =>
      Object.values(comments)
        .flat()
        .filter((c) => c.authorId === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [comments, user.id],
  );

  const userProjects = useMemo(
    () => projects.filter((p) => p.ownerId === user.id),
    [user.id],
  );

  const userLikedIds = useMemo(() => {
    const ids = new Set(user.likedPosts);
    if (isOwn) liked.forEach((id) => ids.add(id));
    return ids;
  }, [user.likedPosts, liked, isOwn]);

  const userLikedPosts = useMemo(
    () => posts.filter((p) => userLikedIds.has(p.id)),
    [posts, userLikedIds],
  );

  return (
    <div>
      <div
        className={`h-36 w-full bg-gradient-to-br sm:h-44 ${avatarGradient(user.username)}`}
        role="presentation"
      />
      <div className="px-4">
        <div className="flex justify-between">
          <div className="-mt-10 rounded-full border-4 border-black">
            <Avatar user={user} size="2xl" />
          </div>
          {isOwn ? (
            <button
              onClick={openEditProfile}
              className="mt-4 rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-900"
            >
              Editar perfil
            </button>
          ) : (
            <span className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  openConversation(user.id);
                  router.push("/messages");
                }}
                className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-900"
              >
                Mensaje
              </button>
              <button
                onClick={() => toggleFollow(user.username)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  isFollowing
                    ? "border border-zinc-700 text-zinc-100 hover:border-red-500/50 hover:text-red-400"
                    : "bg-zinc-100 text-zinc-900 hover:bg-white"
                }`}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </button>
            </span>
          )}
        </div>

        <div className="mt-2">
          <h1 className="flex items-center gap-1.5 text-xl font-bold text-zinc-100">
            {user.name}
            {user.verified ? (
              <VerifiedIcon className="h-5 w-5 text-sky-400" />
            ) : null}
          </h1>
          <p className="text-sm text-zinc-500">@{user.username}</p>
        </div>

        <p className="mt-3 text-[15px] text-zinc-200">{user.bio}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-500">
          {user.location ? (
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" /> {user.location}
            </span>
          ) : null}
          {user.website ? (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:underline"
            >
              <GlobeIcon className="h-4 w-4" /> {user.website.replace(/^https?:\/\//, "")}
            </a>
          ) : null}
          {user.github ? (
            <a
              href={`https://github.com/${user.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:underline"
            >
              <GithubIcon className="h-4 w-4" /> github.com/{user.github}
            </a>
          ) : null}
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" /> Se unió en {joinedDate(user.joined)}
          </span>
        </div>

        <div className="mt-3 flex gap-4 text-sm">
          <span className="text-zinc-500">
            <span className="font-bold text-zinc-100">{formatCount(followers)}</span>{" "}
            Seguidores
          </span>
          <span className="text-zinc-500">
            <span className="font-bold text-zinc-100">
              {formatCount(followingCount)}
            </span>{" "}
            Siguiendo
          </span>
        </div>

        {user.technologies.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex border-b border-zinc-900">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative flex-1 py-3 text-sm font-semibold transition-colors hover:bg-zinc-950"
            >
              <span className={active ? "text-zinc-100" : "text-zinc-500"}>
                {t.label}
              </span>
              {active ? (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-14 -translate-x-1/2 rounded-full bg-sky-500" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div>
        {tab === "posts" ? (
          userPosts.length === 0 ? (
            <EmptyState
              icon={<RocketIcon className="h-7 w-7" />}
              title="Sin publicaciones"
              description={isOwn ? "Comparte tu primera publicación." : "Este perfil aún no publica."}
            />
          ) : (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        ) : null}

        {tab === "replies" ? (
          userReplies.length === 0 ? (
            <EmptyState
              icon={<MessageIcon className="h-7 w-7" />}
              title="Sin respuestas"
              description="Todavía no ha respondido a ninguna publicación."
            />
          ) : (
            userReplies.map((comment) => (
              <CommentRow key={comment.id} comment={comment} posts={posts} />
            ))
          )
        ) : null}

        {tab === "projects" ? (
          userProjects.length === 0 ? (
            <EmptyState
              icon={<GithubIcon className="h-7 w-7" />}
              title="Sin proyectos"
              description="Este perfil todavía no comparte proyectos."
            />
          ) : (
            <div className="space-y-3 p-4">
              {userProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-zinc-800 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-950/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100">{project.name}</span>
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <GithubIcon className="h-4 w-4" /> {formatCount(project.stars)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{project.description}</p>
                  <p className="mt-2 text-xs text-zinc-600">
                    {project.language} · actualizado {timeAgo(project.updatedAt)}
                  </p>
                </a>
              ))}
            </div>
          )
        ) : null}

        {tab === "likes" ? (
          userLikedPosts.length === 0 ? (
            <EmptyState
              icon={<CheckIcon className="h-7 w-7" />}
              title="Sin likes"
              description="Las publicaciones a las que le gusten aparecerán aquí."
            />
          ) : (
            userLikedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        ) : null}
      </div>
    </div>
  );
}

function CommentRow({ comment, posts }: { comment: Comment; posts: Post[] }) {
  const { getUser } = useApp();
  const post = posts.find((p) => p.id === comment.postId);
  return (
    <div className="border-b border-zinc-900 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <MessageIcon className="h-4 w-4" />
        Respondió a{" "}
        {post ? (
          <Link
            href={`/post/${post.id}`}
            className="text-sky-400 hover:underline"
          >
            @{getUser(post.authorId)?.username ?? "dev"}
          </Link>
        ) : (
          "una publicación"
        )}
        <span>· {timeAgo(comment.createdAt)}</span>
      </div>
      <RichText text={comment.content} className="mt-1 text-[15px] text-zinc-200" />
    </div>
  );
}