"use server";

import type { CreatePostInput, InitialData, User } from "@/lib/types";
import {
  createComment,
  createPost,
  deletePost,
  fetchInitialData,
  markAllNotificationsRead,
  sendMessage,
  updatePostCounter,
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
  if (field !== "views") await requireUserId();
  await updatePostCounter(id, field, delta);
}

export async function markAllNotificationsReadAction(): Promise<void> {
  await markAllNotificationsRead();
}