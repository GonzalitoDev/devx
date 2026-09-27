-- ============================================================
-- DevX · Follows persistentes + notificaciones por usuario
-- Ejecuta este script completo en:
--   Supabase Dashboard → tu proyecto → SQL Editor → New query → Run
-- (Ejecútalo DESPUÉS de 0002_devx_profiles.sql)
-- ============================================================

-- Follows entre usuarios (sincronizados entre dispositivos).
create table if not exists public.devx_follows (
  follower_id text not null,
  followee_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id)
);

-- RLS: solo la service_role (servidor) accede.
alter table public.devx_follows enable row level security;

-- Índice para listar los follows de un usuario.
create index if not exists devx_follows_follower_idx on public.devx_follows(follower_id);
create index if not exists devx_follows_followee_idx on public.devx_follows(followee_id);

-- Destinatario de cada notificación (null = notificación global/demo).
alter table public.devx_notifications add column if not exists for_user_id text;
create index if not exists devx_notifications_for_user_idx on public.devx_notifications(for_user_id);