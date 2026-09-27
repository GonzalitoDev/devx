"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("DevX error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center">
      <span className="text-5xl">⚠️</span>
      <h1 className="text-xl font-bold text-zinc-100">
        Algo salió mal
      </h1>
      <p className="max-w-md text-sm text-zinc-500">
        Ocurrió un error inesperado al cargar esta página. Puedes intentarlo de
        nuevo.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
      >
        Reintentar
      </button>
    </div>
  );
}