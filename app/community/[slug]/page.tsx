"use client";

import { useParams } from "next/navigation";
import { communityBySlug } from "@/lib/data";
import { CommunityView } from "@/components/community-view";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { UsersIcon } from "@/components/icons";
import Link from "next/link";

export default function CommunityPage() {
  const params = useParams<{ slug: string }>();
  const community = communityBySlug(params.slug);

  if (!community) {
    return (
      <div>
        <PageHeader title="Comunidad" back />
        <EmptyState
          icon={<UsersIcon className="h-7 w-7" />}
          title="Comunidad no encontrada"
          description={`No existe ninguna comunidad con el slug /${params.slug}.`}
          action={
            <Link
              href="/communities"
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Ver comunidades
            </Link>
          }
        />
      </div>
    );
  }

  return <CommunityView community={community} />;
}