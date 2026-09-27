"use client";

import { useParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { ProfileView } from "@/components/profile-view";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { UserIcon } from "@/components/icons";
import Link from "next/link";

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const { users } = useApp();

  const user = users.find((u) => u.username === params.username);

  if (!user) {
    return (
      <div>
        <PageHeader title="Perfil" back />
        <EmptyState
          icon={<UserIcon className="h-7 w-7" />}
          title="Usuario no encontrado"
          description={`No existe ningún desarrollador con el usuario @${params.username}.`}
          action={
            <Link
              href="/explore"
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Explorar desarrolladores
            </Link>
          }
        />
      </div>
    );
  }

  return <ProfileView user={user} />;
}