"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { CHALLENGES, PRACTICE_LANGUAGES } from "@/lib/challenges";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import {
  CheckIcon,
  PlayIcon,
  RocketIcon,
  TerminalIcon,
} from "@/components/icons";

const DIFF_COLORS: Record<string, string> = {
  Fácil: "bg-emerald-500/10 text-emerald-300 border-emerald-700/40",
  Media: "bg-amber-500/10 text-amber-300 border-amber-700/40",
  Difícil: "bg-rose-500/10 text-rose-300 border-rose-700/40",
};

export default function PracticePage() {
  const { currentUser, questsToday, resolveChallenge, openLogin } = useApp();

  const [activeId, setActiveId] = useState(CHALLENGES[0].id);
  const [languageId, setLanguageId] = useState("javascript");
  const [code, setCode] = useState(CHALLENGES[0].starters.javascript);
  const [output, setOutput] = useState<string | null>(null);
  const [errorOutput, setErrorOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const challenge = CHALLENGES.find((c) => c.id === activeId) ?? CHALLENGES[0];
  const doneToday = questsToday.includes("practice");

  const switchChallenge = (id: string) => {
    const next = CHALLENGES.find((c) => c.id === id) ?? CHALLENGES[0];
    setActiveId(id);
    setCode(next.starters[languageId] ?? next.starters.javascript);
    setOutput(null);
    setErrorOutput("");
    setError(null);
    setShowSolution(false);
  };

  const switchLanguage = (lang: string) => {
    setLanguageId(lang);
    setCode(challenge.starters[lang] ?? challenge.starters.javascript);
    setOutput(null);
    setErrorOutput("");
    setError(null);
  };

  const handleRun = async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput(null);
    setErrorOutput("");
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languageId, code }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error ?? "No se pudo ejecutar.");
      } else {
        setOutput(json.output || "(sin salida)");
        if (json.failed) setErrorOutput(json.errorOutput || "El programa terminó con error.");
      }
    } catch {
      setError("No se pudo conectar con el motor de ejecución.");
    } finally {
      setRunning(false);
    }
  };

  const handleResolve = async () => {
    if (!currentUser) {
      openLogin();
      return;
    }
    const result = await resolveChallenge();
    setNotice(
      result.already
        ? "Ya resolviste un reto hoy (+0 XP). Mañana podés ganar de nuevo."
        : `¡Reto resuelto! +${result.xp} XP`,
    );
  };

  return (
    <div>
      <PageHeader
        title="Zona de práctica"
        subtitle="Retos de programación con ejecución real"
        right={
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <RocketIcon className="h-4 w-4" /> +{10} XP por reto
          </span>
        }
      />

      <div className="flex flex-col lg:flex-row">
        <aside className="flex gap-2 overflow-x-auto border-b border-zinc-900 p-3 lg:w-64 lg:shrink-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-3">
          {CHALLENGES.map((c) => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => switchChallenge(c.id)}
                className={`shrink-0 rounded-xl border px-3 py-2 text-left transition-colors ${
                  active
                    ? "border-sky-500/50 bg-sky-500/10"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-600"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  {c.title}
                </span>
                <span
                  className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] ${DIFF_COLORS[c.difficulty]}`}
                >
                  {c.difficulty}
                </span>
              </button>
            );
          })}
        </aside>

        <main className="min-w-0 flex-1 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-zinc-100">{challenge.title}</h2>
            <select
              value={languageId}
              onChange={(e) => switchLanguage(e.target.value)}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-300 outline-none focus:border-zinc-600"
              aria-label="Lenguaje"
            >
              {PRACTICE_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <p className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-300">
            {challenge.description}
          </p>

          <div className="relative">
            <div className="mb-2 flex items-center gap-1.5 font-mono text-xs text-zinc-500">
              <TerminalIcon className="h-3.5 w-3.5" /> {languageId}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="min-h-[240px] w-full resize-y rounded-xl border border-zinc-800 bg-[#0d0d0f] p-4 font-mono text-[13px] leading-relaxed text-zinc-200 outline-none focus:border-zinc-600"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => void handleRun()}
              disabled={running || !code.trim()}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                running || !code.trim()
                  ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                  : "bg-sky-500 text-white hover:bg-sky-400"
              }`}
            >
              <PlayIcon className="h-4 w-4" />
              {running ? "Ejecutando…" : "Ejecutar"}
            </button>
            <button
              onClick={handleResolve}
              className="flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
            >
              <CheckIcon className="h-4 w-4" />
              {doneToday ? "Resuelto hoy" : "Marcar como resuelto"}
            </button>
            <button
              onClick={() => setShowSolution((v) => !v)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
            >
              {showSolution ? "Ocultar solución" : "Ver solución"}
            </button>
          </div>

          {notice ? (
            <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              {notice}
            </p>
          ) : null}

          {error ? (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800 bg-black">
            <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 font-mono text-xs text-zinc-500">Salida</span>
            </div>
            <pre className="min-h-[80px] overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
              {running ? (
                <span className="text-zinc-500">Ejecutando…</span>
              ) : output !== null ? (
                <>
                  <span className="text-zinc-100">{output}</span>
                  {errorOutput ? (
                    <span className="mt-1 block text-red-400">{errorOutput}</span>
                  ) : null}
                </>
              ) : (
                <span className="text-zinc-600">
                  Presioná «Ejecutar» para ver la salida de tu código.
                </span>
              )}
            </pre>
          </div>

          {showSolution ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-zinc-500">
                Solución de referencia:
              </p>
              <CodeBlock snippet={{ language: "javascript", code: challenge.solution }} />
            </div>
          ) : null}

          {!currentUser ? (
            <p className="mt-4 text-xs text-zinc-600">
              Podés practicar sin cuenta. Iniciá sesión para ganar XP y subir de rango.
            </p>
          ) : null}
        </main>
      </div>
    </div>
  );
}