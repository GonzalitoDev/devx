# DevX

Red social estilo X/Twitter para desarrolladores. Comparte código, proyectos, preguntas, tutoriales y noticias.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Realtime)
- Sintaxis highlighting, iconos y estado con React/CSS/Tailwind nativos

## Base de datos

Las tablas de DevX viven en Supabase (prefijo `devx_`):

- `devx_posts` · `devx_comments` · `devx_messages` · `devx_notifications` · `devx_profiles`

El acceso pasa por **Server Actions** con la `service_role` (solo servidor, la key vive en `.env.local` y en las env vars de Vercel). RLS está habilitado sin políticas: el cliente no recibe ninguna credencial.

### Configurar el proyecto desde cero

1. Crea las tablas ejecutando `supabase/migrations/0001_devx_init.sql` y luego `0002_devx_profiles.sql` en Supabase → SQL Editor.
2. Copia `.env.local.example` a `.env.local` con tu `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
3. En Vercel añade las mismas variables: `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.

## Autenticación

- Login/registro con **Supabase Auth** (email + contraseña), todo desde el servidor: las credenciales nunca van al navegador, la sesión vive en cookies `httpOnly`.
- Cada usuario tiene un perfil en `devx_profiles`; sus posts, respuestas y mensajes quedan firmados con su id.
- Sin sesión la app es de solo lectura (al publicar/reaccionar se abre el login).

## Funciones

- **Mensajes directos** entre usuarios reales (botón "Mensaje" en los perfiles).
- **Editar perfil** (nombre, bio, web, GitHub, ubicación, tecnologías) desde tu perfil.
- **Editar y eliminar** publicaciones y comentarios propios.
- **Follows sincronizados** entre dispositivos (`devx_follows`) y **notificaciones automáticas** cuando alguien reacciona o comenta tu contenido.
- Likes, reposts, guardados, comunidades y respuestas en tiempo real.

### Migración 0003 (opcional)

Las tablas `devx_follows` y la columna `for_user_id` de notificaciones viven en
`supabase/migrations/0003_devx_follows.sql`. Sin ellas la app funciona igual
(follows en `localStorage`, sin notificaciones automáticas); al ejecutarlas se
activan los follows persistentes y las notificaciones por usuario.

## Tiempo real

- Los cambios se propagan con Supabase Realtime (`postgres_changes`).
- El cliente se suscribe a `/api/realtime`, un endpoint SSE que mantiene la key en el servidor y reenvía los eventos al navegador.
- Publicar, responder, enviar mensajes, likes, reposts y vistas se sincronizan entre clientes sin recargar.

## Desarrollo

```bash
npm install
npm run dev
```

## Despliegue

- **Auto-deploy por Git**: el proyecto está conectado a Vercel con el repo `GonzalitoDev/devx`. Cada push a `main` despliega producción automáticamente.
- Manual: `vercel --prod`.

La app está desplegada en: https://devx-sandy.vercel.app

## Seguridad

- La `SUPABASE_SERVICE_ROLE_KEY` vive solo en `.env.local` (gitignoreado) y en las env vars de Vercel como Secret. **Nunca se sube al repo ni al bundle del navegador** (se verificó que no aparece en `.next/static`).
- `lib/supabase.ts`, `lib/auth.ts` y `lib/db.ts` usan el guard `server-only`: es imposible importarlos desde un componente de cliente (error de build).
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` fija los IDs de Server Actions entre builds (evita errores por bundle viejo).

## Notas

- El usuario actual viene de Supabase Auth (email/password). Los datos de ejemplo se siembran automáticamente la primera vez.
- **Las interacciones están en la DB por usuario**: follows, guardados, likes, reposts y membresías de comunidades (`devx_follows`, `devx_bookmarks`, `devx_post_likes`, `devx_post_reposts`, `devx_community_members`). Se sincronizan entre dispositivos al iniciar sesión.
- `localStorage` solo actúa como respaldo/caché si la tabla correspondiente aún no existe o no hay sesión.
- Si Supabase no responde, la app cae a modo demostración con datos de ejemplo.

### Migraciones

1. `0001_devx_init.sql` — tablas del feed + realtime.
2. `0002_devx_profiles.sql` — perfiles + autores de ejemplo.
3. `0003_devx_follows.sql` — follows persistentes + notificaciones por usuario.
4. `0004_devx_interactions.sql` — guardados, likes, reposts y membresías en la DB.

Cada una es opcional y aditiva: sin ejecutarla, la app funciona igual (la interacción
queda en `localStorage`); al ejecutarla se activa la sincronización entre dispositivos.