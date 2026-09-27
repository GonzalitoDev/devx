"use client";

import { useApp } from "@/lib/store";
import { ProfileView } from "@/components/profile-view";
import { EmptyState } from "@/components/empty-state";
import { UserIcon } from "@/components/icons";

export default function MyProfilePage() {
  const { currentUser, openLogin } = useApp();

  if (!currentUser) {
    return (
      <EmptyState
        icon={<UserIcon className="h-7 w-7" />}
        title="Inicia sesión para ver tu perfil"
        description="Tu perfil, tus publicaciones y tus proyectos te esperan. Entra con tu cuenta de DevX."
        action={
          <button
            onClick={openLogin}
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          >
            Iniciar sesión
          </button>
        }
      />
    );
  }

  return <ProfileView user={currentUser} />;
}