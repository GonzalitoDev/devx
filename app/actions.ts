"use server";

import type { CreatePostInput, InitialData, User } from "@/lib/types";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchInitialData,
  getFollowingIds,
  markAllNotificationsRead,
  notifyOnReaction,
  sendMessage,
  setFollow,
  updatePost,
  updatePostCounter,
  updateProfile,
  type CounterField,
} from "@/lib/db";
import {
  getSessionUser,
  requireUserId,
  signIn as signInWithPassword,
  signOut as signOutSession,
  signUp as signUpUser,
} from "@/lib/auth";

export async function getInitialData(): Promise<InitialData> {
  return fetchInitialData();
}

export async function getSession(): Promise<User | null> {
  return getSessionUser();
}

export async function signInAction(
  email: string,
  password: string,
): Promise<string | null> {
  return signInWithPassword(email, password);
}

export async function signUpAction(input: {
  email: string;
  password: string;
  name: string;
  username: string;
}): Promise<string | null> {
  return signUpUser(input);
}

export async function signOutAction(): Promise<void> {
  await signOutSession();
}

export async function createPostAction(input: CreatePostInput): Promise<void> {
  const authorId = await requireUserId();
  await createPost(input, authorId);
}

export async function deletePostAction(id: string): Promise<void> {
  const adminId = await requireUserId();
  await deletePost(id, adminId);
}

export async function addCommentAction(
  postId: string,
  content: string,
  id: string,
): Promise<void> {
  const authorId = await requireUserId();
  await createComment(postId, content, authorId, id);
  await notifyOnReaction("comment", postId, authorId);
}

export async function deleteCommentAction(id: string): Promise<void> {
  const actorId = await requireUserId();
  await deleteComment(id, actorId);
}

export async function updatePostAction(
  id: string,
  input: CreatePostInput,
): Promise<void> {
  const actorId = await requireUserId();
  await updatePost(id, actorId, input);
}

export async function getFollowsAction(): Promise<string[] | null> {
  const userId = await requireUserId();
  return getFollowingIds(userId);
}

export async function setFollowAction(
  username: string,
  following: boolean,
): Promise<void> {
  const actorId = await requireUserId();
  await setFollow(actorId, username, following);
}

export async function updateProfileAction(input: {
  name: string;
  bio: string;
  website?: string;
  github?: string;
  location?: string;
  technologies: string[];
}): Promise<void> {
  const userId = await requireUserId();
  await updateProfile(userId, input);
}

export async function sendMessageAction(
  conversationId: string,
  text: string,
  id: string,
): Promise<void> {
  const senderId = await requireUserId();
  await sendMessage(conversationId, senderId, text, id);
}

export async function updatePostInteractionAction(
  id: string,
  field: CounterField,
  delta: number,
): Promise<void> {
  let userId: string | null = null;
  if (field !== "views") {
    userId = await requireUserId();
  }
  await updatePostCounter(id, field, delta);
  if (field === "likes" && delta > 0 && userId) {
    await notifyOnReaction("like", id, userId);
  }
  if (field === "reposts" && delta > 0 && userId) {
    await notifyOnReaction("repost", id, userId);
  }
}

export async function markAllNotificationsReadAction(): Promise<void> {
  await markAllNotificationsRead();
}