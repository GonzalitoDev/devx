"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useApp } from "@/lib/store";
import { Sidebar, MobileNav } from "./sidebar";
import { RightSidebar } from "./right-sidebar";
import { ComposerModal } from "./composer-modal";
import { LoginModal } from "./login-modal";
import { EditProfileModal } from "./edit-profile-modal";
import { EditPostModal } from "./edit-post-modal";
import { Assistant } from "./assistant";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, online, editProfileOpen, editPostOpen } = useApp();
  const hideRight = pathname.startsWith("/messages");

  return (
    <div className="min-h-dvh bg-black text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1260px] justify-center">
        <aside className="sticky top-0 hidden h-dvh w-[250px] shrink-0 border-r border-zinc-900 px-2 lg:block">
          <Sidebar />
        </aside>

        <main className="min-h-dvh w-full max-w-[600px] border-x border-zinc-900 pb-24 lg:pb-0">
          {ready && !online ? (
            <p className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-400">
              Sin conexión con la base de datos — mostrando datos de ejemplo.
            </p>
          ) : null}
          {children}
        </main>

        <aside
          className={`sticky top-0 hidden h-dvh w-[330px] shrink-0 pl-5 ${
            hideRight ? "xl:hidden" : "xl:block"
          }`}
        >
          <RightSidebar />
        </aside>
      </div>

      <MobileNav />
      <Assistant />
      <ComposerModal />
      <LoginModal />
      {editProfileOpen ? <EditProfileModal /> : null}
      {editPostOpen ? <EditPostModal /> : null}
    </div>
  );
}