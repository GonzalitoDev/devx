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

```bash
vercel --prod
```

La app está desplegada en: https://devx-sandy.vercel.app

## Notas

- El usuario actual viene de Supabase Auth (email/password). Los datos de ejemplo se siembran automáticamente la primera vez.
- Las interacciones por dispositivo (follows, guardados, join) persisten en `localStorage`.
- Si Supabase no responde, la app cae a modo demostración con datos de ejemplo.