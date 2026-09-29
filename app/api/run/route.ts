import { NextResponse } from "next/server";
import { languageCompiler } from "@/lib/challenges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ejecuta código en la zona de práctica usando Wandbox (gratis, sin API key).
 * El navegador nunca ejecuta código de otros usuarios: la compilación corre
 * del lado del servidor.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const languageId = body?.languageId;
  const code = body?.code;

  if (
    typeof languageId !== "string" ||
    typeof code !== "string" ||
    !code.trim()
  ) {
    return NextResponse.json(
      { error: "Faltan datos de ejecución." },
      { status: 400 },
    );
  }

  const lang = languageCompiler(languageId);
  if (!lang) {
    return NextResponse.json(
      { error: "Lenguaje no soportado." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, compiler: lang.compiler, stdin: "" }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Motor de ejecución no disponible (${res.status}). Probá en unos segundos.` },
        { status: 502 },
      );
    }

    const json = await res.json();
    const stdout = typeof json?.program_output === "string" ? json.program_output : "";
    const stderr =
      json?.program_error || json?.compiler_error || json?.compiler_message || "";
    const failed = String(json?.status ?? "0") !== "0";

    return NextResponse.json({
      output: stdout,
      errorOutput: failed ? String(stderr ?? "") : "",
      failed,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo ejecutar tu código ahora. Probá de nuevo en unos segundos." },
      { status: 502 },
    );
  }
}