-- ============================================================
-- DevX · Perfiles + Login
-- Ejecuta este script completo en:
--   Supabase Dashboard → tu proyecto → SQL Editor → New query → Run
-- (Ejecútalo DESPUÉS de 0001_devx_init.sql)
-- ============================================================

-- Perfiles de usuario (1:1 con auth.users para usuarios reales,
-- y con los autores de ejemplo para el contenido sembrado).
create table if not exists public.devx_profiles (
  id text primary key,
  username text unique not null,
  name text not null,
  bio text not null default '',
  website text,
  github text,
  location text,
  followers integer not null default 0,
  following integer not null default 0,
  technologies text[] not null default '{}',
  liked_posts text[] not null default '{}',
  joined timestamptz not null default now(),
  verified boolean not null default false
);

-- RLS: solo la service_role (servidor) accede; el cliente no recibe credenciales.
alter table public.devx_profiles enable row level security;

-- Realtime: los nuevos perfiles se propagan a todos los clientes.
alter publication supabase_realtime add table public.devx_profiles;

-- Semilla: autores de ejemplo para que el feed resuelva sus perfiles.
insert into public.devx_profiles
  (id, username, name, bio, website, github, location, followers, following, technologies, liked_posts, joined, verified)
values
  ('u-devx',  'devx',    'Alex Torres',  'Full-stack developer · React, TypeScript y café en vena ☕ Construyendo cosas en la web.', 'https://devx.dev', 'devx',  'Madrid, España',  4821,  318,  ARRAY['TypeScript','React','Next.js'], ARRAY['p-2','p-5'], '2021-03-14', true),
  ('u-maria', 'mariadev','María García', 'Frontend engineer. Diseño sistemas de componentes y cuido el detalle de la UI.', 'https://mariadev.dev', 'mariadev', 'Barcelona, España', 12304, 451, ARRAY['React','TailwindCSS','TypeScript'], ARRAY['p-1','p-3'], '2020-05-02', true),
  ('u-john',  'johndoe', 'John Carter',  'Backend engineer. Go, microservicios y bases de datos a escala. Aprendiendo Rust.', null, 'johncarter', 'Austin, EE. UU.', 8912, 620, ARRAY['Go','PostgreSQL','Docker'], ARRAY['p-4'], '2019-11-20', false),
  ('u-ravi',  'ravi',    'Ravi Patel',   'AI/ML engineer. LLMs, RAG y agentes. Comparto experimentos y papers que valen la pena.', null, 'ravipatel', 'Bangalore, India', 27340, 389, ARRAY['Python','AI','PyTorch'], ARRAY['p-6','p-7'], '2019-01-08', true),
  ('u-anna',  'anna',    'Anna Kova',    'Rust developer. Sistemas, WASM y CLIs rápidos. Performance es mi religión.', null, 'annakova', 'Berlín, Alemania', 15420, 210, ARRAY['Rust','WASM','Linux'], ARRAY['p-8'], '2020-08-15', false),
  ('u-luis',  'luisdev', 'Luis Fernández','DevOps / SRE. CI/CD, Kubernetes y observabilidad. Automatizo todo lo que puedo.', null, 'luisdev', 'México DF, México', 6580, 540, ARRAY['DevOps','Kubernetes','AWS'], ARRAY['p-9'], '2018-06-30', false),
  ('u-sofia', 'sofia',   'Sofía Mendoza', 'Pythonista y defensora del open source. Mantengo 3 paquetes que usan miles de personas.', null, 'sofiamendoza', 'Bogotá, Colombia', 19820, 760, ARRAY['Python','Open Source','Django'], ARRAY['p-10'], '2017-09-12', true),
  ('u-tomas', 'tomweb',  'Tom Weber',    'Mobile dev. React Native y Expo. Me gusta la arquitectura limpia y las apps bonitas.', null, 'tomweber', 'Ámsterdam, Países Bajos', 4310, 302, ARRAY['React Native','TypeScript','Expo'], ARRAY['p-11'], '2022-01-25', false),
  ('u-hana',  'hana',    'Hana Sato',    'Research engineer. Causal inference y deep learning. Blog con visualizaciones.', null, 'hanasato', 'Tokio, Japón', 31280, 150, ARRAY['AI','Python','MLOps'], ARRAY['p-12'], '2020-02-10', true)
on conflict (id) do nothing;

-- Un usuario nuevo no puede registrarse con el nombre de un autor de ejemplo.
-- (El check de unicidad lo hace la app; este índice lo respalda.)
create unique index if not exists devx_profiles_username_lower_idx
  on public.devx_profiles (lower(username));