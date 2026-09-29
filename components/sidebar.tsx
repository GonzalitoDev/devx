"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { Avatar } from "./avatar";
import {
  BellIcon,
  BookmarkIcon,
  CodeIcon,
  DownloadIcon,
  ExploreIcon,
  HomeIcon,
  LaughIcon,
  LogOutIcon,
  MailIcon,
  PenIcon,
  RocketIcon,
  TerminalIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from "./icons";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 px-3 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
        <CodeIcon className="h-5 w-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-zinc-100">
        Dev<span className="text-sky-400">X</span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, notifications, openComposer, openLogin, signOut } =
    useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const items = [
    { href: "/", label: "Inicio", icon: HomeIcon, match: "/" },
    { href: "/explore", label: "Explorar", icon: ExploreIcon, match: "/explore" },
    { href: "/memes", label: "Memes", icon: LaughIcon, match: "/memes" },
    { href: "/practice", label: "Práctica", icon: TerminalIcon, match: "/practice" },
    { href: "/misiones", label: "Misiones", icon: RocketIcon, match: "/misiones" },
    { href: "/rangos", label: "Rangos", icon: TrophyIcon, match: "/rangos" },
    { href: "/notifications", label: "Notificaciones", icon: BellIcon, match: "/notifications", badge: unread },
    { href: "/messages", label: "Mensajes", icon: MailIcon, match: "/messages" },
    { href: "/communities", label: "Comunidades", icon: UsersIcon, match: "/communities" },
    { href: "/bookmarks", label: "Guardados", icon: BookmarkIcon, match: "/bookmarks" },
    { href: "/profile", label: "Perfil", icon: UserIcon, match: "/profile" },
  ];

  return (
    <div className="flex h-full flex-col justify-between py-3">
      <div>
        <Logo />
        <nav className="mt-2 space-y-1">
          {items.map((item) => {
            const active = pathname === item.match;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-full px-4 py-2.5 text-lg transition-colors ${
                  active
                    ? "font-bold text-zinc-100"
                    : "font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <span className="relative">
                  <item.icon className="h-6 w-6" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={openComposer}
          className="mt-5 hidden w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-sky-400 lg:flex"
        >
          <PenIcon className="h-5 w-5" />
          Publicar
        </button>

        <a
          href="/DevX.apk"
          download
          className="mt-3 flex items-center gap-4 rounded-full px-4 py-2.5 text-lg font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
        >
          <DownloadIcon className="h-6 w-6" />
          <span className="hidden lg:inline">Descargar APK</span>
        </a>
      </div>

      {currentUser ? (
        <div className="mx-1 flex items-center gap-3 rounded-full p-2 transition-colors hover:bg-zinc-900">
          <Link href="/profile" className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar user={currentUser} size="sm" />
            <span className="hidden min-w-0 flex-1 lg:block">
              <span className="block truncate text-sm font-semibold text-zinc-100">
                {currentUser.name}
              </span>
              <span className="block truncate text-sm text-zinc-500">
                @{currentUser.username}
              </span>
            </span>
          </Link>
          <button
            onClick={() => void signOut()}
            className="hidden rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-400 lg:block"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={openLogin}
          className="mx-1 flex w-[calc(100%-0.5rem)] items-center justify-center gap-2 rounded-full border border-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
        >
          <UserIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Iniciar sesión</span>
          <span className="lg:hidden">Entrar</span>
        </button>
      )}
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { notifications, openComposer } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const items = [
    { href: "/", label: "Inicio", icon: HomeIcon, match: "/" },
    { href: "/explore", label: "Explorar", icon: ExploreIcon, match: "/explore" },
    { href: "/memes", label: "Memes", icon: LaughIcon, match: "/memes" },
    { href: "/practice", label: "Práctica", icon: TerminalIcon, match: "/practice" },
    { href: "/notifications", label: "Notis", icon: BellIcon, match: "/notifications", badge: unread },
    { href: "/messages", label: "Mensajes", icon: MailIcon, match: "/messages" },
    { href: "/profile", label: "Perfil", icon: UserIcon, match: "/profile" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-900 bg-black/95 backdrop-blur lg:hidden">
      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.match;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px] ${
                active ? "font-semibold text-sky-400" : "text-zinc-500"
              }`}
            >
              <span className="relative">
                <item.icon className="h-6 w-6" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </span>
              {item.label}
            </Link>
          );
        })}
        <a
          href="/DevX.apk"
          download
          className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px] text-zinc-500"
          aria-label="Descargar APK"
        >
          <DownloadIcon className="h-6 w-6" />
          APK
        </a>
      </div>
      <button
        onClick={openComposer}
        className="absolute -top-16 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition-transform hover:scale-105"
        aria-label="Publicar"
      >
        <PenIcon className="h-6 w-6" />
      </button>
    </nav>
  );
}