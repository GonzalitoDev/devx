-- ============================================================
-- DevX · Base de datos + Realtime
-- Ejecuta este script completo en:
--   Supabase Dashboard → tu proyecto → SQL Editor → New query → Run
-- ============================================================

-- Publicaciones compartidas (feed en tiempo real)
create table if not exists public.devx_posts (
  id text primary key,
  author_id text not null,
  kind text not null default 'idea',
  content text not null,
  hashtags text[] not null default '{}',
  code jsonb,
  image text,
  community_slug text,
  created_at timestamptz not null default now(),
  replies integer not null default 0,
  reposts integer not null default 0,
  likes integer not null default 0,
  views integer not null default 0
);

-- Respuestas
create table if not exists public.devx_comments (
  id text primary key,
  post_id text not null references public.devx_posts(id) on delete cascade,
  author_id text not null,
  content text not null,
  code jsonb,
  created_at timestamptz not null default now(),
  likes integer not null default 0
);

-- Mensajes privados
create table if not exists public.devx_messages (
  id text primary key,
  conversation_id text not null,
  sender_id text not null,
  text text not null,
  code jsonb,
  created_at timestamptz not null default now()
);

-- Notificaciones
create table if not exists public.devx_notifications (
  id text primary key,
  type text not null,
  from_user_id text,
  post_id text,
  text text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- Índices
create index if not exists devx_posts_created_idx on public.devx_posts(created_at desc);
create index if not exists devx_comments_post_idx on public.devx_comments(post_id);
create index if not exists devx_messages_conv_idx on public.devx_messages(conversation_id, created_at);

-- Seguridad: la app no tiene autenticación todavía. Todo el acceso pasa por
-- Server Actions con la service_role (que ignora RLS). El cliente NO recibe
-- ninguna credencial, así que RLS bloquea cualquier acceso directo anónimo.
alter table public.devx_posts enable row level security;
alter table public.devx_comments enable row level security;
alter table public.devx_messages enable row level security;
alter table public.devx_notifications enable row level security;

-- IMPORTANTE para el tiempo real:
-- agrega las tablas a la publicación de Realtime para que los cambios
-- (INSERT/UPDATE/DELETE) se transmitan a los clientes conectados.
alter publication supabase_realtime add table public.devx_posts;
alter publication supabase_realtime add table public.devx_comments;
alter publication supabase_realtime add table public.devx_messages;
alter publication supabase_realtime add table public.devx_notifications;