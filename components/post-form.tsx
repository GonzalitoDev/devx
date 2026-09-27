"use client";

import { useState } from "react";
import { useApp, guestUser } from "@/lib/store";
import { Avatar } from "./avatar";
import { CodeIcon, ImageIcon, SendIcon, XIcon } from "./icons";
import { communities } from "@/lib/data";

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

const MAX_LENGTH = 280;

export function PostForm({ variant = "inline" }: { variant?: "inline" | "modal" }) {
  const { currentUser, createPost, openLogin } = useApp();

  const [content, setContent] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState("");
  const [image, setImage] = useState("");
  const [communitySlug, setCommunitySlug] = useState<string>("");

  const canPublish = content.trim().length > 0;

  const handlePublish = () => {
    if (!canPublish) return;
    if (!currentUser) {
      openLogin();
      return;
    }
    createPost({
      content: content.trim(),
      code: showCode && code.trim() ? { language, code: code.trim() } : undefined,
      image: image.trim() || undefined,
      communitySlug: communitySlug || undefined,
    });
    setContent("");
    setShowCode(false);
    setCode("");
    setImage("");
    setCommunitySlug("");
  };

  return (
    <div className="flex gap-3 p-4">
      <Avatar user={currentUser ?? guestUser} size="md" />
      <div className="flex-1 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="¿Qué está pasando en tu código?"
          rows={3}
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
        ) : null}

        {image ? (
          <div className="relative overflow-hidden rounded-xl border border-zinc-800">
            <img src={image} alt="Imagen de la publicación" className="max-h-64 w-full object-cover" />
            <button
              onClick={() => setImage("")}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-zinc-300 hover:text-white"
              aria-label="Quitar imagen"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-zinc-900 pt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCode((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                showCode
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <CodeIcon className="h-4 w-4" /> Código
            </button>
            <button
              onClick={() => setImage("https://picsum.photos/seed/devx-post/800/450")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                image
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <ImageIcon className="h-4 w-4" /> Imagen
            </button>
            <select
              value={communitySlug}
              onChange={(e) => setCommunitySlug(e.target.value)}
              className="rounded-full border border-zinc-800 bg-transparent px-3 py-1.5 text-sm text-zinc-500 outline-none hover:text-zinc-300 focus:border-zinc-700"
              aria-label="Comunidad"
            >
              <option value="">Comunidad</option>
              {communities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs tabular-nums ${
                content.length > MAX_LENGTH - 20
                  ? "text-amber-400"
                  : "text-zinc-600"
              }`}
            >
              {content.length}/{MAX_LENGTH}
            </span>
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                canPublish
                  ? "bg-sky-500 text-white hover:bg-sky-400"
                  : "cursor-not-allowed bg-zinc-800 text-zinc-500"
              }`}
            >
              <SendIcon className="h-4 w-4" />
              {variant === "modal" ? "Publicar" : "Postear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}