import { cookies } from "next/headers";
import { getAdmin } from "./supabase";
import { createProfile, getProfileByUserId, usernameExists } from "./db";
import type { User } from "./types";

const ACCESS_COOKIE = "devx-access-token";
const REFRESH_COOKIE = "devx-refresh-token";
const WEEK = 60 * 60 * 24 * 7;
const MONTH = 60 * 60 * 24 * 30;

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
  if (!access) return null;

  let token = access;
  let { data, error } = await admin.auth.getUser(token);

  if (error) {
    const refresh = store.get(REFRESH_COOKIE)?.value;
    if (!refresh) return null;
    const { data: refreshed, error: refreshError } =
      await admin.auth.refreshSession({ refresh_token: refresh });
    if (refreshError || !refreshed.session) return null;
    token = refreshed.session.access_token;
    store.set(ACCESS_COOKIE, token, cookieOptions(WEEK));
    store.set(REFRESH_COOKIE, refreshed.session.refresh_token, cookieOptions(MONTH));
    const again = await admin.auth.getUser(token);
    data = again.data;
    error = again.error;
  }

  if (error || !data.user) return null;

  try {
    return await getProfileByUserId(data.user.id);
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

export async function signIn(email: string, password: string): Promise<string | null> {
  const admin = getAdmin();
  if (!admin) return "Error de configuración del servidor";

  const { data, error } = await admin.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error || !data.session) return "Email o contraseña incorrectos";

  const store = await cookies();
  store.set(ACCESS_COOKIE, data.session.access_token, cookieOptions(WEEK));
  store.set(REFRESH_COOKIE, data.session.refresh_token, cookieOptions(MONTH));
  return null;
}

export async function signUp(input: {
  email: string;
  password: string;
  name: string;
  username: string;
}): Promise<string | null> {
  const admin = getAdmin();
  if (!admin) return "Error de configuración del servidor";

  const name = input.name.trim();
  const username = input.username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return "El usuario debe tener entre 3 y 20 caracteres (letras, números o _).";
  }
  if (name.length < 2) return "Escribe tu nombre.";
  if (input.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";

  try {
    if (await usernameExists(username)) return "Ese nombre de usuario ya está en uso.";
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
      return "Ese email ya está registrado.";
    }
    return "No se pudo crear la cuenta.";
  }
  if (!created.user) return "No se pudo crear la cuenta.";

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
    return "Base de datos no configurada. Ejecuta las migraciones en el SQL Editor.";
  }

  return signIn(input.email.trim(), input.password);
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