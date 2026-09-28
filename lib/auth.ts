import "server-only";
import { cookies } from "next/headers";
import { getAdmin } from "./supabase";
import { createProfile, getProfileByUserId, usernameExists } from "./db";
import type { User } from "./types";

const ACCESS_COOKIE = "devx-access-token";
const REFRESH_COOKIE = "devx-refresh-token";
const WEEK = 60 * 60 * 24 * 7;
// Sesión de larga duración: el refresh token vive 10 años y se renueva solo.
const REFRESH_MAX_AGE = 60 * 60 * 24 * 365 * 10;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/** Devuelve el perfil del usuario con sesión activa (o null). */
export async function getSessionUser(): Promise<User | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) return null;

  let token = access ?? "";
  let userData: Awaited<ReturnType<typeof admin.auth.getUser>>["data"] | null =
    null;
  let userError: Error | null = null;

  if (access) {
    const res = await admin.auth.getUser(access);
    userData = res.data;
    userError = res.error;
  }

  // Si el access token falta o expiró, la sesión se restaura con el
  // refresh token (de larga duración). Así el usuario no vuelve a loguearse.
  if ((!token || userError) && refresh) {
    const { data: refreshed, error: refreshError } =
      await admin.auth.refreshSession({ refresh_token: refresh });
    if (refreshError || !refreshed.session) return null;
    token = refreshed.session.access_token;
    store.set(ACCESS_COOKIE, token, cookieOptions(WEEK));
    store.set(
      REFRESH_COOKIE,
      refreshed.session.refresh_token,
      cookieOptions(REFRESH_MAX_AGE),
    );
    const again = await admin.auth.getUser(token);
    userData = again.data;
    userError = again.error;
  }

  if (userError || !userData?.user) return null;

  try {
    return await getProfileByUserId(userData.user.id);
  } catch {
    return null;
  }
}

/** Lanza si no hay sesión; devuelve el id del perfil autenticado. */
export async function requireUserId(): Promise<string> {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");
  return user.id;
}

export interface AuthResult {
  error: string | null;
  user: User | null;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const admin = getAdmin();
  if (!admin) return { error: "Error de configuración del servidor", user: null };

  const { data, error } = await admin.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error || !data.session) {
    return { error: "Email o contraseña incorrectos", user: null };
  }

  const store = await cookies();
  store.set(ACCESS_COOKIE, data.session.access_token, cookieOptions(WEEK));
  store.set(
    REFRESH_COOKIE,
    data.session.refresh_token,
    cookieOptions(REFRESH_MAX_AGE),
  );

  // Devuelve el perfil directamente para que la UI se actualice sin depender
  // del round-trip del cookie (más robusto tras el login).
  let user: User | null = null;
  try {
    user = await getProfileByUserId(data.user.id);
  } catch {
    // sin perfil todavía: el usuario queda logueado pero sin perfil
  }
  return { error: null, user };
}

export async function signUp(input: {
  email: string;
  password: string;
  name: string;
  username: string;
}): Promise<AuthResult> {
  const admin = getAdmin();
  if (!admin) return { error: "Error de configuración del servidor", user: null };

  const name = input.name.trim();
  const username = input.username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return {
      error: "El usuario debe tener entre 3 y 20 caracteres (letras, números o _).",
      user: null,
    };
  }
  if (name.length < 2) return { error: "Escribe tu nombre.", user: null };
  if (input.password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres.", user: null };
  }

  try {
    if (await usernameExists(username)) {
      return { error: "Ese nombre de usuario ya está en uso.", user: null };
    }
  } catch {
    // si la tabla aún no existe, se detectará en createProfile
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.password,
    email_confirm: true,
    user_metadata: { username, name },
  });
  if (createError) {
    const msg = createError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("exists")) {
      return { error: "Ese email ya está registrado.", user: null };
    }
    return { error: "No se pudo crear la cuenta.", user: null };
  }
  if (!created.user) return { error: "No se pudo crear la cuenta.", user: null };

  const profile: User = {
    id: created.user.id,
    username,
    name,
    bio: "",
    followers: 0,
    following: 0,
    technologies: [],
    likedPosts: [],
    joined: new Date().toISOString(),
  };
  try {
    await createProfile(profile);
  } catch {
    return {
      error: "Base de datos no configurada. Ejecuta las migraciones en el SQL Editor.",
      user: null,
    };
  }

  return signIn(input.email.trim(), input.password);
}

export async function sendPasswordReset(email: string): Promise<string | null> {
  const admin = getAdmin();
  if (!admin) return "Error de configuración del servidor";
  const appUrl = process.env.APP_URL ?? "https://devx-sandy.vercel.app";
  const { error } = await admin.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${appUrl}/?recovery=1`,
  });
  if (error) return "No se pudo enviar el correo. Verificá que el email exista.";
  return null;
}

export async function setNewPassword(
  token: string,
  password: string,
): Promise<string | null> {
  const admin = getAdmin();
  if (!admin) return "Error de configuración del servidor";
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  try {
    const { error: setError } = await admin.auth.setSession({
      access_token: token,
      refresh_token: "",
    });
    if (setError) return "El enlace no es válido o expiró.";
    const { error: updError } = await admin.auth.updateUser({ password });
    if (updError) return "No se pudo actualizar la contraseña.";
    return null;
  } catch {
    return "No se pudo actualizar la contraseña.";
  }
}

export async function signOut(): Promise<void> {
  const admin = getAdmin();
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (admin && access) {
    try {
      await admin.auth.admin.signOut(access);
    } catch {
      // best effort
    }
  }
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}