"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { resetPasswordAction, setNewPasswordAction } from "@/app/actions";
import { AtSignIcon, CodeIcon, LockIcon, MailIcon, XIcon } from "./icons";

type Mode = "login" | "signup" | "reset" | "recovery";

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

function parseRecoveryToken(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("access_token");
  return params.get("type") === "recovery" && token ? token : null;
}

export function LoginModal() {
  const { loginOpen, closeLogin, signIn, signUp } = useApp();

  const [recoveryToken] = useState<string | null>(parseRecoveryToken);
  const [recoveryResolved, setRecoveryResolved] = useState(false);
  const [mode, setMode] = useState<Mode>(() =>
    recoveryToken ? "recovery" : "login",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeRecovery = recoveryToken !== null && !recoveryResolved;
  const visible = loginOpen || activeRecovery;

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, closeLogin]);

  if (!visible) return null;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    if (result) setError(result);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name.trim() || !username.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signUp({ email, password, name, username });
    if (result) setError(result);
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Escribe tu email.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await resetPasswordAction(email);
    if (result) {
      setError(result);
    } else {
      setNotice("Revisá tu email: te enviamos un enlace para restablecer la contraseña.");
      setMode("login");
    }
    setLoading(false);
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryToken) return;
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await setNewPasswordAction(recoveryToken, password);
    if (result) {
      setError(result);
      setLoading(false);
      return;
    }
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    setRecoveryResolved(true);
    setMode("login");
    setNotice("Contraseña actualizada. Ya podés iniciar sesión.");
    setLoading(false);
  };

  const title =
    mode === "login"
      ? "Entrar en DevX"
      : mode === "signup"
        ? "Crear tu cuenta"
        : mode === "reset"
          ? "Restablecer contraseña"
          : "Nueva contraseña";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={closeLogin}
      role="dialog"
      aria-modal="true"
      aria-label={title}
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

        <h2 className="mt-4 text-2xl font-bold text-zinc-100">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {mode === "reset"
            ? "Te enviamos un enlace a tu email."
            : mode === "recovery"
              ? "Elegí una contraseña nueva para tu cuenta."
              : mode === "signup"
                ? "Únete a la red social para developers."
                : "Vuelve a la comunidad de desarrolladores."}
        </p>

        {notice ? (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {notice}
          </p>
        ) : null}

        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : mode === "signup"
                ? handleSignup
                : mode === "reset"
                  ? handleReset
                  : handleRecovery
          }
          className="mt-5 space-y-3"
        >
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

          {mode !== "recovery" ? (
            <Field
              icon={<MailIcon className="h-4 w-4" />}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email"
            />
          ) : null}

          {mode === "login" || mode === "signup" || mode === "recovery" ? (
            <Field
              icon={<LockIcon className="h-4 w-4" />}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={
                mode === "recovery" ? "Contraseña nueva" : "Contraseña"
              }
            />
          ) : null}

          {mode === "recovery" ? (
            <Field
              icon={<LockIcon className="h-4 w-4" />}
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repetir contraseña"
            />
          ) : null}

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
                : mode === "signup"
                  ? "Crear cuenta"
                  : mode === "reset"
                    ? "Enviar enlace"
                    : "Guardar contraseña"}
          </button>
        </form>

        {mode === "login" ? (
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={() => switchMode("reset")}
              className="text-zinc-500 hover:text-zinc-300"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <button
              onClick={() => switchMode("signup")}
              className="font-semibold text-sky-400 hover:underline"
            >
              Regístrate
            </button>
          </div>
        ) : mode === "signup" ? (
          <p className="mt-4 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => switchMode("login")}
              className="font-semibold text-sky-400 hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        ) : mode === "reset" ? (
          <p className="mt-4 text-center text-sm text-zinc-500">
            <button
              onClick={() => switchMode("login")}
              className="font-semibold text-sky-400 hover:underline"
            >
              Volver a iniciar sesión
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}