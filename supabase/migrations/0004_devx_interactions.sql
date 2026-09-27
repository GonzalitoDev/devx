-- ============================================================
-- DevX · Interacciones por usuario en la DB
-- (bookmarks, likes, reposts y membresías de comunidades)
-- Ejecuta este script completo en:
--   Supabase Dashboard → tu proyecto → SQL Editor → New query → Run
-- (Ejecútalo DESPUÉS de 0003_devx_follows.sql)
-- ============================================================

-- Publicaciones guardadas por usuario.
create table if not exists public.devx_bookmarks (
  user_id text not null,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
alter table public.devx_bookmarks enable row level security;
create index if not exists devx_bookmarks_user_idx on public.devx_bookmarks(user_id);

-- Likes por usuario.
create table if not exists public.devx_post_likes (
  user_id text not null,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
alter table public.devx_post_likes enable row level security;
create index if not exists devx_post_likes_user_idx on public.devx_post_likes(user_id);

-- Reposts por usuario.
create table if not exists public.devx_post_reposts (
  user_id text not null,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
alter table public.devx_post_reposts enable row level security;
create index if not exists devx_post_reposts_user_idx on public.devx_post_reposts(user_id);

-- Membresías de comunidades por usuario.
create table if not exists public.devx_community_members (
  user_id text not null,
  community_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, community_slug)
);
alter table public.devx_community_members enable row level security;
create index if not exists devx_community_members_user_idx on public.devx_community_members(user_id);