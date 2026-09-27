"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import type { Notification } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Avatar } from "@/components/avatar";
import { EmptyState } from "@/components/empty-state";
import {
  BellIcon,
  CheckIcon,
  HeartIcon,
  MailIcon,
  MessageIcon,
  RepeatIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/icons";

const TYPE_ICONS: Record<
  Notification["type"],
  { icon: typeof HeartIcon; className: string }
> = {
  like: { icon: HeartIcon, className: "text-rose-400" },
  repost: { icon: RepeatIcon, className: "text-emerald-400" },
  follow: { icon: UserIcon, className: "text-sky-400" },
  comment: { icon: MessageIcon, className: "text-sky-400" },
  mention: { icon: UserIcon, className: "text-violet-400" },
  message: { icon: MailIcon, className: "text-sky-400" },
  system: { icon: ShieldIcon, className: "text-amber-400" },
};

export default function NotificationsPage() {
  const { notifications, getUser, markAllNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <PageHeader
        title="Notificaciones"
        subtitle={unread > 0 ? `${unread} sin leer` : undefined}
        right={
          unread > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              <CheckIcon className="h-4 w-4" /> Marcar leídas
            </button>
          ) : undefined
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={<BellIcon className="h-7 w-7" />}
          title="Sin notificaciones"
          description="Cuando alguien interactúe contigo, lo verás aquí."
        />
      ) : (
        <ul>
          {sorted.map((notification) => {
            const meta = TYPE_ICONS[notification.type];
            const Icon = meta.icon;
            const actor = notification.fromUserId
              ? getUser(notification.fromUserId)
              : undefined;

            const content = (
              <div className="flex gap-3 px-4 py-3">
                {actor ? (
                  <Avatar user={actor} size="sm" />
                ) : (
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 ${meta.className}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-zinc-300">
                      {actor ? (
                        <Link
                          href={`/profile/${actor.username}`}
                          className="font-bold text-zinc-100 hover:underline"
                        >
                          {actor.name}
                        </Link>
                      ) : null}{" "}
                      {notification.text}
                    </p>
                    <span className="shrink-0 text-xs text-zinc-600">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
                {!notification.read ? (
                  <span
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500"
                    aria-label="No leída"
                  />
                ) : null}
              </div>
            );

            return (
              <li
                key={notification.id}
                className={`border-b border-zinc-900 transition-colors hover:bg-zinc-950/60 ${
                  notification.read ? "" : "bg-sky-500/[0.03]"
                }`}
              >
                {notification.postId ? (
                  <Link href={`/post/${notification.postId}`} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}