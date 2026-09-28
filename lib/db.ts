import "server-only";
import type { Comment, CreatePostInput, InitialData, Message, Notification, Post, User } from "./types";
import { getAdmin } from "./supabase";
import { canUse, XP_ACTIONS } from "./ranks";
import {
  comments as mockComments,
  messages as mockMessages,
  notifications as mockNotifications,
  posts as mockPosts,
  users as mockUsers,
} from "./data";
import {
  extractHashtags,
  extractKind,
  toComment,
  toCommentRow,
  toMessage,
  toMessageRow,
  toNotification,
  toNotificationRow,
  toPost,
  toPostRow,
  toProfileRow,
  toUser,
} from "./mappers";

export type CounterField = "likes" | "reposts" | "views";

function ensureAdmin() {
  const admin = getAdmin();
  if (!admin) {
    throw new Error(
      "Supabase no está configurado (faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY)",
    );
  }
  return admin;
}

/**
 * Inserta los datos de ejemplo la primera vez que las tablas están vacías.
 * El seed NUNCA tumba la carga inicial: si falla (p. ej. RLS en un proyecto
 * con configuraciones especiales), se loguea y se continúa con lo existente.
 */
export async function ensureSeeded(): Promise<void> {
  const admin = ensureAdmin();
  try {
    const { count: postCount, error: postErr } = await admin
      .from("devx_posts")
      .select("id", { count: "exact", head: true });
    if (postErr) throw postErr;

    if ((postCount ?? 0) === 0) {
      const postRows = mockPosts.map(toPostRow);
      const commentRows = Object.values(mockComments).flat().map(toCommentRow);
      const messageRows = mockMessages.map(toMessageRow);
      const notificationRows = mockNotifications.map(toNotificationRow);

      const results = await Promise.all([
        admin.from("devx_posts").upsert(postRows, { onConflict: "id", ignoreDuplicates: true }),
        admin.from("devx_comments").upsert(commentRows, { onConflict: "id", ignoreDuplicates: true }),
        admin.from("devx_messages").upsert(messageRows, { onConflict: "id", ignoreDuplicates: true }),
        admin.from("devx_notifications").upsert(notificationRows, { onConflict: "id", ignoreDuplicates: true }),
      ]);
      const firstError = results.find((r) => r.error)?.error;
      if (firstError) throw firstError;
    }

    const { count: profileCount, error: profileErr } = await admin
      .from("devx_profiles")
      .select("id", { count: "exact", head: true });
    if (profileErr) throw profileErr;

    if ((profileCount ?? 0) === 0) {
      const { error } = await admin.from("devx_profiles").upsert(
        mockUsers.map(toProfileRow),
        { onConflict: "id", ignoreDuplicates: true },
      );
      if (error) throw error;
    }
  } catch (e) {
    console.error("DevX: seed falló (se continúa con los datos existentes):", e);
  }
}

export async function fetchInitialData(): Promise<InitialData> {
  const admin = ensureAdmin();
  await ensureSeeded();

  const [postsRes, commentsRes, messagesRes, notifRes, profilesRes] =
    await Promise.all([
      admin.from("devx_posts").select("*").order("created_at", { ascending: false }),
      admin.from("devx_comments").select("*").order("created_at", { ascending: true }),
      admin.from("devx_messages").select("*").order("created_at", { ascending: true }),
      admin.from("devx_notifications").select("*").order("created_at", { ascending: false }),
      admin.from("devx_profiles").select("*").order("name", { ascending: true }),
    ]);

  const err = [postsRes, commentsRes, messagesRes, notifRes, profilesRes].find(
    (r) => r.error,
  )?.error;
  if (err) throw err;

  const comments: Record<string, Comment[]> = {};
  (commentsRes.data ?? []).forEach((row) => {
    const comment = toComment(row as Parameters<typeof toComment>[0]);
    comments[comment.postId] = [...(comments[comment.postId] ?? []), comment];
  });

  return {
    posts: (postsRes.data ?? []).map((r) => toPost(r as Parameters<typeof toPost>[0])),
    comments,
    messages: (messagesRes.data ?? []).map((r) => toMessage(r as Parameters<typeof toMessage>[0])),
    notifications: (notifRes.data ?? []).map((r) => toNotification(r as Parameters<typeof toNotification>[0])),
    users: (profilesRes.data ?? []).map((r) => toUser(r as Parameters<typeof toUser>[0])),
  };
}

export async function createPost(input: CreatePostInput, authorId: string): Promise<Post> {
  const admin = ensureAdmin();
  const xp = await getXp(authorId);
  if (input.image && !canUse(xp, "images")) {
    throw new Error("Subir imágenes requiere rango Aprendiz (2)");
  }
  if (input.video && !canUse(xp, "video")) {
    throw new Error("Subir videos requiere rango Mid (4)");
  }
  const id = input.id ?? `p-${Date.now()}`;
  const post: Post = {
    id,
    authorId,
    kind: extractKind(input.content, input.code),
    content: input.content,
    hashtags: extractHashtags(input.content),
    code: input.code,
    image: input.image,
    video: input.video,
    createdAt: new Date().toISOString(),
    replies: 0,
    reposts: 0,
    likes: 0,
    views: 0,
    communitySlug: input.communitySlug,
  };
  const { data, error } = await admin.from("devx_posts").insert(toPostRow(post)).select().single();
  if (error) throw error;
  await grantXp(authorId, XP_ACTIONS.post);
  await markQuestDone(authorId, "post");
  return toPost(data as Parameters<typeof toPost>[0]);
}

export async function deletePost(id: string, actorId: string): Promise<void> {
  const admin = ensureAdmin();
  const { data: post } = await admin
    .from("devx_posts")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();
  if (post && (post as { author_id: string }).author_id !== actorId) {
    throw new Error("No autorizado");
  }
  const { error } = await admin.from("devx_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function createComment(
  postId: string,
  content: string,
  authorId: string,
  id: string,
): Promise<Comment> {
  const admin = ensureAdmin();
  const comment: Comment = { id, postId, authorId, content, createdAt: new Date().toISOString(), likes: 0 };
  const { data, error } = await admin.from("devx_comments").insert(toCommentRow(comment)).select().single();
  if (error) throw error;

  const { data: post } = await admin.from("devx_posts").select("replies").eq("id", postId).single();
  await admin.from("devx_posts").update({ replies: (post?.replies ?? 0) + 1 }).eq("id", postId);

  await grantXp(authorId, XP_ACTIONS.reply);
  await markQuestDone(authorId, "reply");

  return toComment(data as Parameters<typeof toComment>[0]);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
  id: string,
): Promise<Message> {
  const admin = ensureAdmin();
  const message: Message = { id, conversationId, senderId, text, createdAt: new Date().toISOString() };
  const { data, error } = await admin.from("devx_messages").insert(toMessageRow(message)).select().single();
  if (error) throw error;
  return toMessage(data as Parameters<typeof toMessage>[0]);
}

export async function updatePostCounter(
  id: string,
  field: CounterField,
  delta: number,
): Promise<void> {
  const admin = ensureAdmin();
  const { data } = await admin.from("devx_posts").select(field).eq("id", id).single();
  const current = (data as Record<string, number> | null)?.[field] ?? 0;
  const { error } = await admin
    .from("devx_posts")
    .update({ [field]: Math.max(0, current + delta) })
    .eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead(): Promise<void> {
  const admin = ensureAdmin();
  const { error } = await admin.from("devx_notifications").update({ read: true }).eq("read", false);
  if (error) throw error;
}

export async function getProfileByUserId(id: string): Promise<User | null> {
  const admin = ensureAdmin();
  const { data, error } = await admin.from("devx_profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toUser(data as Parameters<typeof toUser>[0]) : null;
}

export async function usernameExists(username: string): Promise<boolean> {
  const admin = ensureAdmin();
  const { data, error } = await admin
    .from("devx_profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function createProfile(profile: User): Promise<User> {
  const admin = ensureAdmin();
  const { data, error } = await admin.from("devx_profiles").upsert(toProfileRow(profile)).select().single();
  if (error) throw error;
  return toUser(data as Parameters<typeof toUser>[0]);
}

async function getXp(userId: string): Promise<number> {
  const admin = ensureAdmin();
  try {
    const { data } = await admin
      .from("devx_profiles")
      .select("xp")
      .eq("id", userId)
      .maybeSingle();
    return (data as { xp?: number } | null)?.xp ?? 0;
  } catch {
    return 0;
  }
}

export async function grantXp(userId: string, amount: number): Promise<void> {
  const admin = ensureAdmin();
  try {
    const current = await getXp(userId);
    await admin
      .from("devx_profiles")
      .update({ xp: Math.max(0, current + amount) })
      .eq("id", userId);
  } catch {
    // best effort
  }
}

export async function markQuestDone(
  userId: string,
  questId: string,
): Promise<void> {
  const admin = ensureAdmin();
  try {
    await admin.from("devx_quest_logs").upsert(
      { user_id: userId, quest_id: questId, day: new Date().toISOString().slice(0, 10) },
      { onConflict: "user_id, quest_id, day", ignoreDuplicates: true },
    );
  } catch {
    // tabla aún no existe
  }
}

export async function getQuestsDoneToday(userId: string): Promise<string[]> {
  const admin = ensureAdmin();
  try {
    const { data } = await admin
      .from("devx_quest_logs")
      .select("quest_id")
      .eq("user_id", userId)
      .eq("day", new Date().toISOString().slice(0, 10));
    return (data ?? []).map((r) => (r as { quest_id: string }).quest_id);
  } catch {
    return [];
  }
}

export async function claimDailyReward(userId: string): Promise<{
  xp: number;
  streak: number;
  claimed: boolean;
}> {
  const admin = ensureAdmin();
  try {
    const { data: profile } = await admin
      .from("devx_profiles")
      .select("xp, streak, last_daily")
      .eq("id", userId)
      .maybeSingle();
    if (!profile) return { xp: 0, streak: 0, claimed: false };
    const p = profile as {
      xp: number;
      streak: number;
      last_daily: string | null;
    };
    const today = new Date().toISOString().slice(0, 10);
    if (p.last_daily && p.last_daily.slice(0, 10) === today) {
      return { xp: p.xp, streak: p.streak, claimed: false };
    }
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak = p.last_daily && p.last_daily.slice(0, 10) === yesterday ? p.streak + 1 : 1;
    const xp = p.xp + XP_ACTIONS.daily;
    await admin
      .from("devx_profiles")
      .update({ xp, streak, last_daily: new Date().toISOString() })
      .eq("id", userId);
    await markQuestDone(userId, "daily");
    return { xp, streak, claimed: true };
  } catch {
    return { xp: 0, streak: 0, claimed: false };
  }
}

export async function getProgress(userId: string): Promise<{
  xp: number;
  streak: number;
  questsToday: string[];
}> {
  try {
    const admin = ensureAdmin();
    const { data } = await admin
      .from("devx_profiles")
      .select("xp, streak")
      .eq("id", userId)
      .maybeSingle();
    const p = (data as { xp?: number; streak?: number } | null) ?? {};
    const questsToday = await getQuestsDoneToday(userId);
    return {
      xp: p.xp ?? 0,
      streak: p.streak ?? 0,
      questsToday,
    };
  } catch {
    return { xp: 0, streak: 0, questsToday: [] };
  }
}

export async function boostPost(id: string, actorId: string): Promise<void> {
  const admin = ensureAdmin();
  const xp = await getXp(actorId);
  if (!canUse(xp, "boost")) throw new Error("Requiere rango Junior (3)");
  const { data: existing } = await admin
    .from("devx_posts")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) throw new Error("Publicación no encontrada");
  if ((existing as { author_id: string }).author_id !== actorId) {
    throw new Error("Solo podés destacar publicaciones propias");
  }
  const { error } = await admin
    .from("devx_posts")
    .update({ featured: true })
    .eq("id", id);
  if (error) throw error;
}

export async function updateProfile(
  id: string,
  input: {
    name: string;
    bio: string;
    website?: string;
    github?: string;
    location?: string;
    technologies: string[];
  },
): Promise<User> {
  const admin = ensureAdmin();
  const { data, error } = await admin
    .from("devx_profiles")
    .update({
      name: input.name.trim() || "Sin nombre",
      bio: input.bio.trim(),
      website: input.website?.trim() || null,
      github: input.github?.trim() || null,
      location: input.location?.trim() || null,
      technologies: input.technologies,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toUser(data as Parameters<typeof toUser>[0]);
}

export async function deleteComment(id: string, actorId: string): Promise<void> {
  const admin = ensureAdmin();
  const { data: comment } = await admin
    .from("devx_comments")
    .select("author_id, post_id")
    .eq("id", id)
    .maybeSingle();
  if (!comment) return;
  if ((comment as { author_id: string }).author_id !== actorId) {
    throw new Error("No autorizado");
  }
  const postId = (comment as { post_id: string }).post_id;
  const { error } = await admin.from("devx_comments").delete().eq("id", id);
  if (error) throw error;

  const { data: post } = await admin
    .from("devx_posts")
    .select("replies")
    .eq("id", postId)
    .maybeSingle();
  await admin
    .from("devx_posts")
    .update({ replies: Math.max(0, (post?.replies ?? 0) - 1) })
    .eq("id", postId);
}

export async function updatePost(
  id: string,
  actorId: string,
  input: CreatePostInput,
): Promise<Post> {
  const admin = ensureAdmin();
  const { data: existing } = await admin
    .from("devx_posts")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) throw new Error("Publicación no encontrada");
  if ((existing as { author_id: string }).author_id !== actorId) {
    throw new Error("No autorizado");
  }
  const { data, error } = await admin
    .from("devx_posts")
    .update({
      content: input.content,
      code: input.code ?? null,
      image: input.image ?? null,
      hashtags: extractHashtags(input.content),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toPost(data as Parameters<typeof toPost>[0]);
}

export async function setFollow(
  actorId: string,
  username: string,
  following: boolean,
): Promise<void> {
  const admin = ensureAdmin();
  try {
    const { data: profile } = await admin
      .from("devx_profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (!profile) return;
    const targetId = (profile as { id: string }).id;

    if (following) {
      await admin
        .from("devx_follows")
        .upsert(
          { follower_id: actorId, followee_id: targetId },
          { onConflict: "follower_id, followee_id", ignoreDuplicates: true },
        );
      if (targetId !== actorId) {
        await createNotification({
          id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "follow",
          fromUserId: actorId,
          text: "empezó a seguirte",
          read: false,
          forUserId: targetId,
        });
      }
    } else {
      await admin
        .from("devx_follows")
        .delete()
        .eq("follower_id", actorId)
        .eq("followee_id", targetId);
    }
  } catch {
    // tabla devx_follows aún no existe: el follow queda en localStorage
  }
}

export async function getFollowingIds(userId: string): Promise<string[] | null> {
  const admin = ensureAdmin();
  try {
    const { data } = await admin
      .from("devx_follows")
      .select("followee_id")
      .eq("follower_id", userId);
    return (data ?? []).map((r) => (r as { followee_id: string }).followee_id);
  } catch {
    return null; // tabla no disponible: el cliente decide usar localStorage
  }
}

export async function notifyOnReaction(
  type: "like" | "repost" | "comment",
  postId: string,
  actorId: string,
): Promise<void> {
  const admin = ensureAdmin();
  try {
    const { data: post } = await admin
      .from("devx_posts")
      .select("author_id")
      .eq("id", postId)
      .maybeSingle();
    if (!post) return;
    const authorId = (post as { author_id: string }).author_id;
    if (authorId === actorId) return;
    const text =
      type === "like"
        ? "le gustó tu publicación"
        : type === "repost"
          ? "reposteó tu publicación"
          : "comentó tu publicación";
    await createNotification({
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      fromUserId: actorId,
      postId,
      text,
      read: false,
      forUserId: authorId,
    });
    if (type === "like") {
      await grantXp(authorId, XP_ACTIONS.likeReceived);
    }
  } catch {
    // la columna for_user_id aún no existe: no romper la acción
  }
}

async function createNotification(
  notification: Omit<Notification, "createdAt"> & { createdAt?: string },
): Promise<void> {
  const admin = ensureAdmin();
  try {
    await admin.from("devx_notifications").insert(
      toNotificationRow({
        ...notification,
        createdAt: notification.createdAt ?? new Date().toISOString(),
      }),
    );
  } catch {
    // tabla no configurada: best effort
  }
}

export async function getUserPostIds(
  table: "devx_bookmarks" | "devx_post_likes" | "devx_post_reposts",
  userId: string,
): Promise<string[] | null> {
  const admin = ensureAdmin();
  try {
    const { data } = await admin
      .from(table)
      .select("post_id")
      .eq("user_id", userId);
    return (data ?? []).map((r) => (r as { post_id: string }).post_id);
  } catch {
    return null; // tabla aún no existe: usar localStorage
  }
}

export async function setUserPostRel(
  table: "devx_bookmarks" | "devx_post_likes" | "devx_post_reposts",
  userId: string,
  postId: string,
  active: boolean,
): Promise<void> {
  const admin = ensureAdmin();
  try {
    if (active) {
      await admin
        .from(table)
        .upsert(
          { user_id: userId, post_id: postId },
          { onConflict: "user_id, post_id", ignoreDuplicates: true },
        );
    } else {
      await admin
        .from(table)
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);
    }
  } catch {
    // tabla aún no existe: la interacción queda en localStorage
  }
}

export async function getUserCommunitySlugs(
  userId: string,
): Promise<string[] | null> {
  const admin = ensureAdmin();
  try {
    const { data } = await admin
      .from("devx_community_members")
      .select("community_slug")
      .eq("user_id", userId);
    return (data ?? []).map((r) => (r as { community_slug: string }).community_slug);
  } catch {
    return null;
  }
}

export async function setCommunityMembership(
  userId: string,
  slug: string,
  active: boolean,
): Promise<void> {
  const admin = ensureAdmin();
  try {
    if (active) {
      await admin
        .from("devx_community_members")
        .upsert(
          { user_id: userId, community_slug: slug },
          { onConflict: "user_id, community_slug", ignoreDuplicates: true },
        );
    } else {
      await admin
        .from("devx_community_members")
        .delete()
        .eq("user_id", userId)
        .eq("community_slug", slug);
    }
  } catch {
    // tabla aún no existe: la membresía queda en localStorage
  }
}