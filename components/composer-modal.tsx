"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { PostForm } from "./post-form";
import { XIcon } from "./icons";

export function ComposerModal() {
  const { composerOpen, closeComposer } = useApp();

  useEffect(() => {
    if (!composerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeComposer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [composerOpen, closeComposer]);

  if (!composerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={closeComposer}
      role="dialog"
      aria-modal="true"
      aria-label="Nueva publicación"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-2xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
          <button
            onClick={closeComposer}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-300">
            Nueva publicación
          </span>
          <span className="w-9" />
        </div>
        <PostForm variant="modal" />
      </div>
    </div>
  );
}