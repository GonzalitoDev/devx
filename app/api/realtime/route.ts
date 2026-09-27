import { randomUUID } from "node:crypto";
import { getAdmin } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLES = [
  "devx_posts",
  "devx_comments",
  "devx_messages",
  "devx_notifications",
  "devx_profiles",
];

/**
 * Streaming SSE: conecta un canal de Supabase Realtime por cada cliente y
 * reenvía los cambios (postgres_changes) del feed. La service key nunca sale
 * del servidor: el navegador solo recibe los eventos ya filtrados.
 *
 * El topic del canal es único por conexión: realtime-js reutiliza el canal
 * por topic, y en un worker caliente una segunda conexión chocaría con un
 * canal ya suscrito (no se pueden añadir listeners postgres_changes después
 * de subscribe()).
 */
export async function GET(request: Request) {
  const admin = getAdmin();
  if (!admin) {
    return new Response("realtime no disponible", { status: 503 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let channel: RealtimeChannel | null = null;

      try {
        const send = (data: unknown) => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
            );
          } catch {
            // conexión cerrada
          }
        };

        channel = admin.channel(`devx-realtime-${randomUUID()}`);
        TABLES.forEach((table) => {
          channel!.on(
            "postgres_changes",
            { event: "*", schema: "public", table },
            (payload) => send(payload),
          );
        });
        channel.subscribe();

        // Primer chunk inmediato: obliga a Next.js a emitir los headers SSE
        // (no los escribe hasta que el stream produce algo).
        send({ eventType: "INIT", table: "devx", new: null, old: null });
      } catch {
        // si falla la suscripción, cerramos limpio en vez de responder 500
        try {
          controller.close();
        } catch {
          // ya cerrado
        }
        return;
      }

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          // ignore
        }
      }, 20_000);

      const cleanup = () => {
        clearInterval(heartbeat);
        if (channel) {
          admin.removeChannel(channel);
        }
        try {
          controller.close();
        } catch {
          // ya cerrado
        }
      };

      request.signal.addEventListener("abort", cleanup, { once: true });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}