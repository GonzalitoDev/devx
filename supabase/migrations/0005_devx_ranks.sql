-- ============================================================
-- DevX · Rangos, XP, misiones y destacados
-- Ejecuta este script completo en:
--   Supabase Dashboard → tu proyecto → SQL Editor → New query → Run
-- (Ejecútalo DESPUÉS de 0004_devx_interactions.sql)
-- ============================================================

-- XP, racha diaria y última recompensa de cada perfil.
alter table public.devx_profiles
  add column if not exists xp integer not null default 0;
alter table public.devx_profiles
  add column if not exists streak integer not null default 0;
alter table public.devx_profiles
  add column if not exists last_daily timestamptz;

-- Publicaciones destacadas (función por rango).
alter table public.devx_posts
  add column if not exists featured boolean not null default false;

-- Videos en publicaciones (función por rango).
alter table public.devx_posts
  add column if not exists video text;

-- Registro de misiones diarias completadas.
create table if not exists public.devx_quest_logs (
  user_id text not null,
  quest_id text not null,
  day date not null,
  primary key (user_id, quest_id, day)
);
alter table public.devx_quest_logs enable row level security;
create index if not exists devx_quest_logs_user_idx on public.devx_quest_logs(user_id);