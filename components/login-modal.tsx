"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { AtSignIcon, CodeIcon, LockIcon, MailIcon, XIcon } from "./icons";

type Mode = "login" | "signup";

const INPUT_CLASS =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-sky-500/60";

function Field({
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

export function LoginModal() {
  const { loginOpen, closeLogin, signIn, signUp } = useApp();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loginOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loginOpen, closeLogin]);

  if (!loginOpen) return null;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    if (mode === "signup" && (!name.trim() || !username.trim())) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError(null);

    const result =
      mode === "login"
        ? await signIn(email, password)
        : await signUp({ email, password, name, username });

    if (result) setError(result);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={closeLogin}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <CodeIcon className="h-5 w-5" />
          </span>
          <button
            onClick={closeLogin}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-zinc-100">
          {mode === "login" ? "Entrar en DevX" : "Crear tu cuenta"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {mode === "login"
            ? "Vuelve a la comunidad de desarrolladores."
            : "Únete a la red social para developers."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === "signup" ? (
            <>
              <Field
                icon={<AtSignIcon className="h-4 w-4" />}
                type="text"
                value={username}
                onChange={setUsername}
                placeholder="Usuario (ej: juan_dev)"
              />
              <Field
                icon={<CodeIcon className="h-4 w-4" />}
                type="text"
                value={name}
                onChange={setName}
                placeholder="Nombre completo"
              />
            </>
          ) : null}

          <Field
            icon={<MailIcon className="h-4 w-4" />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Email"
          />
          <Field
            icon={<LockIcon className="h-4 w-4" />}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Contraseña"
          />

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3 font-semibold text-white transition-colors ${
              loading
                ? "cursor-not-allowed bg-zinc-700"
                : "bg-sky-500 hover:bg-sky-400"
            }`}
          >
            {loading
              ? "Espera…"
              : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="font-semibold text-sky-400 hover:underline"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}