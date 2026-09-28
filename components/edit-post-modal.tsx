"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { CodeIcon, ImageIcon, VideoIcon, XIcon } from "./icons";

const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "yaml",
  "json",
  "html",
  "css",
  "bash",
];

export function EditPostModal() {
  const { editingPost, closeEditPost, updatePost } = useApp();

  const [content, setContent] = useState(editingPost?.content ?? "");
  const [showCode, setShowCode] = useState(Boolean(editingPost?.code));
  const [language, setLanguage] = useState(
    editingPost?.code?.language ?? "typescript",
  );
  const [code, setCode] = useState(editingPost?.code?.code ?? "");
  const [image, setImage] = useState(editingPost?.image ?? "");
  const [video, setVideo] = useState(editingPost?.video ?? "");

  if (!editingPost) return null;

  const handleSave = () => {
    if (!content.trim()) return;
    updatePost(editingPost.id, {
      content: content.trim(),
      code: showCode && code.trim() ? { language, code: code.trim() } : undefined,
      image: image.trim() || undefined,
      video: video.trim() || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={closeEditPost}
      role="dialog"
      aria-modal="true"
      aria-label="Editar publicación"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">Editar publicación</h2>
          <button
            onClick={closeEditPost}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="¿Qué está pasando en tu código?"
            className="w-full resize-none bg-transparent text-[15px] text-zinc-100 placeholder-zinc-600 outline-none"
          />

          {showCode ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-300 outline-none focus:border-zinc-700"
                  aria-label="Lenguaje del código"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCode(false)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  <XIcon className="h-3.5 w-3.5" /> Quitar
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// pega tu código ${language} aquí`}
                rows={6}
                className="w-full resize-y rounded-lg border border-zinc-800 bg-[#0d0d0f] p-3 font-mono text-[13px] text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-700"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowCode(true)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
            >
              <CodeIcon className="h-4 w-4" /> Añadir código
            </button>
          )}

          {image ? (
            <div className="relative overflow-hidden rounded-xl border border-zinc-800">
              <img
                src={image}
                alt="Imagen de la publicación"
                className="max-h-64 w-full object-cover"
              />
              <button
                onClick={() => setImage("")}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-zinc-300 hover:text-white"
                aria-label="Quitar imagen"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setImage("https://picsum.photos/seed/devx-post/800/450")}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
            >
              <ImageIcon className="h-4 w-4" /> Añadir imagen
            </button>
          )}

          {video ? (
            <div className="relative overflow-hidden rounded-xl border border-zinc-800">
              <video
                src={video}
                controls
                preload="metadata"
                className="max-h-64 w-full bg-black object-contain"
              />
              <button
                onClick={() => setVideo("")}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-zinc-300 hover:text-white"
                aria-label="Quitar video"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
            >
              <VideoIcon className="h-4 w-4" /> Añadir video
            </button>
          )}

          <div className="flex justify-end gap-2 border-t border-zinc-900 pt-3">
            <button
              onClick={closeEditPost}
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim()}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                content.trim()
                  ? "bg-sky-500 text-white hover:bg-sky-400"
                  : "cursor-not-allowed bg-zinc-800 text-zinc-500"
              }`}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}