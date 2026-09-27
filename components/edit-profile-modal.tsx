"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { XIcon } from "./icons";

const INPUT_CLASS =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-sky-500/60";

export function EditProfileModal() {
  const { currentUser, closeEditProfile, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [website, setWebsite] = useState(currentUser?.website ?? "");
  const [github, setGithub] = useState(currentUser?.github ?? "");
  const [location, setLocation] = useState(currentUser?.location ?? "");
  const [technologies, setTechnologies] = useState(
    currentUser?.technologies.join(", ") ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Escribe tu nombre.");
      return;
    }
    setSaving(true);
    setError(null);
    const techs = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);
    const result = await updateProfile({
      name,
      bio,
      website,
      github,
      location,
      technologies: techs,
    });
    if (result) setError(result);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={closeEditProfile}
      role="dialog"
      aria-modal="true"
      aria-label="Editar perfil"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100">Editar perfil</h2>
          <button
            onClick={closeEditProfile}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-500">
              Nombre
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-500">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Cuéntanos qué haces"
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-500">
                Web
              </label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://…"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-500">
                GitHub
              </label>
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="usuario"
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-500">
              Ubicación
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ciudad, País"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-500">
              Tecnologías (separadas por coma)
            </label>
            <input
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="TypeScript, React, Next.js"
              className={INPUT_CLASS}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className={`w-full rounded-full py-3 font-semibold text-white transition-colors ${
              saving
                ? "cursor-not-allowed bg-zinc-700"
                : "bg-sky-500 hover:bg-sky-400"
            }`}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}