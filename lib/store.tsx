"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Comment,
  CreatePostInput,
  Message,
  Notification,
  Post,
  User,
} from "./types";
import {
  comments as mockComments,
  guestUser,
  messages as mockMessages,
  notifications as mockNotifications,
  posts as mockPosts,
  users as mockUsers,
} from "./data";
import {
  extractHashtags,
  extractKind,
  toComment,
  toMessage,
  toNotification,
  toPost,
  toUser,
  type CommentRow,
  type MessageRow,
  type NotificationRow,
  type PostRow,
  type ProfileRow,
} from "./mappers";
import {
  addCommentAction,
  createPostAction,
  deleteCommentAction,
  deletePostAction,
  getFollowsAction,
  getInitialData,
  getSession,
  markAllNotificationsReadAction,
  sendMessageAction,
  setFollowAction,
  signInAction,
  signOutAction,
  signUpAction,
  updatePostAction,
  updatePostInteractionAction,
  updateProfileAction,
} from "@/app/actions";

export type FeedTab = "foryou" | "following";

interface AppState {
  ready: boolean;
  online: boolean;
  currentUser: User | null;
  users: User[];
  posts: Post[];
  comments: Record<string, Comment[]>;
  notifications: Notification[];
  messages: Message[];
  bookmarks: string[];
  liked: string[];
  reposted: string[];
  following: string[];
  joinedCommunities: string[];
  feedTab: FeedTab;
  search: string;
  composerOpen: boolean;
  loginOpen: boolean;
  editProfileOpen: boolean;
  editPostOpen: boolean;
  editingPost: Post | null;
  messagesTarget: string | null;
}

export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  username: string;
}

interface AppContextValue extends AppState {
  getUser: (id: string) => User | undefined;
  likePost: (id: string) => void;
  repostPost: (id: string) => void;
  toggleBookmark: (id: string) => void;
  toggleFollow: (username: string) => void;
  toggleJoinCommunity: (slug: string) => void;
  createPost: (input: CreatePostInput) => void;
  deletePost: (id: string) => void;
  addComment: (postId: string, content: string) => void;
  setFeedTab: (tab: FeedTab) => void;
  setSearch: (value: string) => void;
  openComposer: () => void;
  closeComposer: () => void;
  openLogin: () => void;
  closeLogin: () => void;
  openEditProfile: () => void;
  closeEditProfile: () => void;
  markAllNotificationsRead: () => void;
  sendMessage: (conversationId: string, text: string) => void;
  trackView: (id: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  updatePost: (id: string, input: CreatePostInput) => void;
  openEditPost: (id: string) => void;
  closeEditPost: () => void;
  openConversation: (userId: string) => void;
  updateProfile: (input: {
    name: string;
    bio: string;
    website?: string;
    github?: string;
    location?: string;
    technologies: string[];
  }) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (input: SignUpInput) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "devx-device-state-v1";

interface RealtimePayload {
  type?: string;
  eventType?: string;
  table?: string;
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    ready: false,
    online: false,
    currentUser: null,
    users: mockUsers,
    posts: mockPosts,
    comments: mockComments,
    notifications: mockNotifications,
    messages: mockMessages,
    bookmarks: [],
    liked: [],
    reposted: [],
    following: [],
    joinedCommunities: [],
    feedTab: "foryou",
    search: "",
    composerOpen: false,
    loginOpen: false,
    editProfileOpen: false,
    editPostOpen: false,
    editingPost: null,
    messagesTarget: null,
  });

  const applyRealtime = useCallback((payload: RealtimePayload) => {
    const table = payload.table;
    const type = payload.type ?? payload.eventType;

    setState((s) => {
      if (table === "devx_posts") {
        if (type === "INSERT" && payload.new) {
          const post = toPost(payload.new as unknown as PostRow);
          if (s.posts.some((p) => p.id === post.id)) return s;
          return { ...s, posts: [post, ...s.posts] };
        }
        if (type === "DELETE" && payload.old) {
          const id = payload.old.id as string;
          return {
            ...s,
            posts: s.posts.filter((p) => p.id !== id),
            bookmarks: s.bookmarks.filter((b) => b !== id),
            liked: s.liked.filter((l) => l !== id),
            reposted: s.reposted.filter((r) => r !== id),
          };
        }
        if (type === "UPDATE" && payload.new) {
          const row = payload.new as unknown as PostRow;
          return {
            ...s,
            posts: s.posts.map((p) => (p.id === row.id ? toPost(row) : p)),
          };
        }
      }

      if (table === "devx_comments" && type === "INSERT" && payload.new) {
        const comment = toComment(payload.new as unknown as CommentRow);
        const existing = s.comments[comment.postId] ?? [];
        if (existing.some((c) => c.id === comment.id)) return s;
        return {
          ...s,
          comments: {
            ...s.comments,
            [comment.postId]: [...existing, comment],
          },
        };
      }

      if (table === "devx_comments" && type === "DELETE" && payload.old) {
        const id = (payload.old as { id: string }).id;
        let foundPostId: string | null = null;
        for (const [postId, list] of Object.entries(s.comments)) {
          if (list.some((c) => c.id === id)) {
            foundPostId = postId;
            break;
          }
        }
        if (!foundPostId) return s;
        return {
          ...s,
          comments: {
            ...s.comments,
            [foundPostId]: s.comments[foundPostId].filter((c) => c.id !== id),
          },
          posts: s.posts.map((p) =>
            p.id === foundPostId
              ? { ...p, replies: Math.max(0, p.replies - 1) }
              : p,
          ),
        };
      }

      if (table === "devx_messages" && type === "INSERT" && payload.new) {
        const message = toMessage(payload.new as unknown as MessageRow);
        if (s.messages.some((m) => m.id === message.id)) return s;
        return { ...s, messages: [...s.messages, message] };
      }

      if (table === "devx_profiles") {
        if (type === "INSERT" && payload.new) {
          const user = toUser(payload.new as unknown as ProfileRow);
          if (s.users.some((u) => u.id === user.id)) return s;
          return { ...s, users: [...s.users, user] };
        }
        if (type === "UPDATE" && payload.new) {
          const user = toUser(payload.new as unknown as ProfileRow);
          return {
            ...s,
            users: s.users.map((u) => (u.id === user.id ? user : u)),
          };
        }
      }

      if (table === "devx_notifications") {
        if (type === "INSERT" && payload.new) {
          const notification = toNotification(
            payload.new as unknown as NotificationRow,
          );
          const mine =
            notification.forUserId === undefined ||
            notification.forUserId === null ||
            notification.forUserId === s.currentUser?.id;
          if (!mine) return s;
          if (s.notifications.some((n) => n.id === notification.id)) return s;
          return { ...s, notifications: [notification, ...s.notifications] };
        }
        if (type === "UPDATE" && payload.new) {
          const row = payload.new as unknown as NotificationRow;
          return {
            ...s,
            notifications: s.notifications.map((n) =>
              n.id === row.id ? toNotification(row) : n,
            ),
          };
        }
        if (type === "DELETE" && payload.old) {
          return {
            ...s,
            notifications: s.notifications.filter(
              (n) => n.id !== (payload.old as { id: string }).id,
            ),
          };
        }
      }

      return s;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let es: EventSource | null = null;

    const init = async () => {
      const persisted = localStorage.getItem(STORAGE_KEY);
      if (persisted) {
        try {
          const saved = JSON.parse(persisted) as Partial<AppState>;
          setState((s) => ({
            ...s,
            bookmarks: saved.bookmarks ?? s.bookmarks,
            liked: saved.liked ?? s.liked,
            reposted: saved.reposted ?? s.reposted,
            following: saved.following ?? s.following,
            joinedCommunities: saved.joinedCommunities ?? s.joinedCommunities,
            feedTab: saved.feedTab ?? s.feedTab,
          }));
        } catch {
          // estado corrupto: ignorar
        }
      }

      const [data, sessionUser] = await Promise.all([
        (async () => {
          try {
            return await getInitialData();
          } catch (e) {
            console.error("DevX: error cargando datos iniciales", e);
            // Recuperación de version skew: un cliente con un bundle viejo
            // referencia Server Actions que ya no existen. Un único reload
            // trae el bundle nuevo; si vuelve a fallar, se muestra el aviso.
            if (
              typeof window !== "undefined" &&
              !sessionStorage.getItem("devx-reloaded")
            ) {
              sessionStorage.setItem("devx-reloaded", "1");
              window.location.reload();
            }
            return null;
          }
        })(),
        (async () => {
          try {
            return await getSession();
          } catch {
            return null;
          }
        })(),
      ]);

      let dbFollows: string[] | null = null;
      if (sessionUser) {
        dbFollows = await getFollowsAction().catch(() => null);
      }

      if (cancelled) return;

      setState((s) => ({
        ...s,
        posts: data?.posts ?? s.posts,
        comments: data?.comments ?? s.comments,
        messages: data?.messages ?? s.messages,
        notifications: (data?.notifications ?? s.notifications).filter(
          (n) =>
            n.forUserId === undefined ||
            n.forUserId === null ||
            n.forUserId === sessionUser?.id,
        ),
        users: data?.users ?? s.users,
        currentUser: sessionUser,
        following: dbFollows
          ? Array.from(new Set([...s.following, ...dbFollows]))
          : s.following,
        online: data !== null,
        ready: true,
      }));

      if (data) {
        try {
          sessionStorage.removeItem("devx-reloaded");
        } catch {
          // ignore
        }
      }

      if (!data) return;

      es = new EventSource("/api/realtime");
      es.onmessage = (event) => {
        try {
          applyRealtime(JSON.parse(event.data) as RealtimePayload);
        } catch {
          // evento inválido: ignorar
        }
      };
    };

    void init();

    const fallback = setTimeout(() => {
      if (!cancelled) {
        setState((s) => (s.ready ? s : { ...s, ready: true }));
      }
    }, 2500);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      es?.close();
    };
  }, [applyRealtime]);

  useEffect(() => {
    if (!state.ready) return;
    const persistable = {
      bookmarks: state.bookmarks,
      liked: state.liked,
      reposted: state.reposted,
      following: state.following,
      joinedCommunities: state.joinedCommunities,
      feedTab: state.feedTab,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [state]);

  const getUser = useCallback(
    (id: string) => state.users.find((u) => u.id === id),
    [state.users],
  );

  const openLogin = useCallback(() => {
    setState((s) => ({ ...s, loginOpen: true }));
  }, []);

  const closeLogin = useCallback(() => {
    setState((s) => ({ ...s, loginOpen: false }));
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const user = await getSession();
      setState((s) => ({ ...s, currentUser: user, loginOpen: false }));
    } catch {
      // sin sesión
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const error = await signInAction(email, password);
      if (error) return error;
      await refreshAuth();
      return null;
    },
    [refreshAuth],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const error = await signUpAction(input);
      if (error) return error;
      await refreshAuth();
      return null;
    },
    [refreshAuth],
  );

  const signOut = useCallback(async () => {
    await signOutAction().catch(() => {});
    setState((s) => ({ ...s, currentUser: null }));
  }, []);

  const createPost = useCallback(
    (input: CreatePostInput) => {
      const currentUser = state.currentUser;
      if (!currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      const id = input.id ?? `p-${Date.now()}`;
      const optimistic: Post = {
        id,
        authorId: currentUser.id,
        kind: extractKind(input.content, input.code),
        content: input.content,
        hashtags: extractHashtags(input.content),
        code: input.code,
        image: input.image,
        createdAt: new Date().toISOString(),
        replies: 0,
        reposts: 0,
        likes: 0,
        views: 0,
        communitySlug: input.communitySlug,
      };
      setState((s) => ({
        ...s,
        posts: [optimistic, ...s.posts],
        composerOpen: false,
      }));
      void createPostAction({ ...input, id }).catch(() => {});
    },
    [state.currentUser],
  );

  const deletePost = useCallback(
    (id: string) => {
      if (!state.currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      setState((s) => ({
        ...s,
        posts: s.posts.filter((p) => p.id !== id),
        bookmarks: s.bookmarks.filter((b) => b !== id),
        liked: s.liked.filter((l) => l !== id),
        reposted: s.reposted.filter((r) => r !== id),
      }));
      void deletePostAction(id).catch(() => {});
    },
    [state.currentUser],
  );

  const addComment = useCallback(
    (postId: string, content: string) => {
      const currentUser = state.currentUser;
      if (!currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      const id = `c-${Date.now()}`;
      const comment: Comment = {
        id,
        postId,
        authorId: currentUser.id,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      setState((s) => ({
        ...s,
        comments: {
          ...s.comments,
          [postId]: [...(s.comments[postId] ?? []), comment],
        },
        posts: s.posts.map((p) =>
          p.id === postId ? { ...p, replies: p.replies + 1 } : p,
        ),
      }));
      void addCommentAction(postId, content, id).catch(() => {});
    },
    [state.currentUser],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const currentUser = state.currentUser;
      if (!currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      const id = `m-${Date.now()}`;
      const message: Message = {
        id,
        conversationId,
        senderId: currentUser.id,
        text,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, messages: [...s.messages, message] }));
      void sendMessageAction(conversationId, text, id).catch(() => {});
    },
    [state.currentUser],
  );

  const likePost = useCallback(
    (id: string) => {
      if (!state.currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      const isLiked = state.liked.includes(id);
      setState((s) => ({
        ...s,
        liked: isLiked ? s.liked.filter((x) => x !== id) : [...s.liked, id],
        posts: s.posts.map((p) =>
          p.id === id
            ? { ...p, likes: Math.max(0, p.likes + (isLiked ? -1 : 1)) }
            : p,
        ),
      }));
      void updatePostInteractionAction(id, "likes", isLiked ? -1 : 1).catch(
        () => {},
      );
    },
    [state.currentUser, state.liked],
  );

  const repostPost = useCallback(
    (id: string) => {
      if (!state.currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      const isReposted = state.reposted.includes(id);
      setState((s) => ({
        ...s,
        reposted: isReposted
          ? s.reposted.filter((x) => x !== id)
          : [...s.reposted, id],
        posts: s.posts.map((p) =>
          p.id === id
            ? { ...p, reposts: Math.max(0, p.reposts + (isReposted ? -1 : 1)) }
            : p,
        ),
      }));
      void updatePostInteractionAction(id, "reposts", isReposted ? -1 : 1).catch(
        () => {},
      );
    },
    [state.currentUser, state.reposted],
  );

  const trackView = useCallback((id: string) => {
    void updatePostInteractionAction(id, "views", 1).catch(() => {});
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(id)
        ? s.bookmarks.filter((b) => b !== id)
        : [id, ...s.bookmarks],
    }));
  }, []);

  const toggleFollow = useCallback(
    (username: string) => {
      const user = state.users.find((u) => u.username === username);
      if (!user) return;
      const willFollow = !state.following.includes(user.id);
      setState((s) => ({
        ...s,
        following: willFollow
          ? [...s.following, user.id]
          : s.following.filter((u) => u !== user.id),
      }));
      void setFollowAction(username, willFollow).catch(() => {});
    },
    [state.users, state.following],
  );

  const toggleJoinCommunity = useCallback((slug: string) => {
    setState((s) => ({
      ...s,
      joinedCommunities: s.joinedCommunities.includes(slug)
        ? s.joinedCommunities.filter((c) => c !== slug)
        : [...s.joinedCommunities, slug],
    }));
  }, []);

  const setFeedTab = useCallback((tab: FeedTab) => {
    setState((s) => ({ ...s, feedTab: tab }));
  }, []);

  const setSearch = useCallback((value: string) => {
    setState((s) => ({ ...s, search: value }));
  }, []);

  const openComposer = useCallback(() => {
    setState((s) => ({ ...s, composerOpen: true }));
  }, []);

  const closeComposer = useCallback(() => {
    setState((s) => ({ ...s, composerOpen: false }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
    void markAllNotificationsReadAction().catch(() => {});
  }, []);

  const openEditProfile = useCallback(() => {
    setState((s) => ({ ...s, editProfileOpen: true }));
  }, []);

  const closeEditProfile = useCallback(() => {
    setState((s) => ({ ...s, editProfileOpen: false }));
  }, []);

  const deleteComment = useCallback(
    (postId: string, commentId: string) => {
      if (!state.currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      setState((s) => ({
        ...s,
        comments: {
          ...s.comments,
          [postId]: (s.comments[postId] ?? []).filter((c) => c.id !== commentId),
        },
        posts: s.posts.map((p) =>
          p.id === postId ? { ...p, replies: Math.max(0, p.replies - 1) } : p,
        ),
      }));
      void deleteCommentAction(commentId).catch(() => {});
    },
    [state.currentUser],
  );

  const openEditPost = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      editPostOpen: true,
      editingPost: s.posts.find((p) => p.id === id) ?? null,
    }));
  }, []);

  const closeEditPost = useCallback(() => {
    setState((s) => ({ ...s, editPostOpen: false, editingPost: null }));
  }, []);

  const updatePost = useCallback(
    (id: string, input: CreatePostInput) => {
      if (!state.currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return;
      }
      setState((s) => ({
        ...s,
        editPostOpen: false,
        editingPost: null,
        posts: s.posts.map((p) =>
          p.id === id
            ? {
                ...p,
                content: input.content,
                code: input.code,
                image: input.image,
                hashtags: extractHashtags(input.content),
              }
            : p,
        ),
      }));
      void updatePostAction(id, input).catch(() => {});
    },
    [state.currentUser],
  );

  const openConversation = useCallback((userId: string) => {
    setState((s) => ({ ...s, messagesTarget: userId }));
  }, []);

  const updateProfile = useCallback(
    async (input: {
      name: string;
      bio: string;
      website?: string;
      github?: string;
      location?: string;
      technologies: string[];
    }) => {
      if (!state.currentUser) {
        setState((s) => ({ ...s, loginOpen: true }));
        return "Inicia sesión para editar tu perfil.";
      }
      try {
        await updateProfileAction(input);
        await refreshAuth();
        setState((s) => ({ ...s, editProfileOpen: false }));
        return null;
      } catch {
        return "No se pudo actualizar el perfil. Intenta de nuevo.";
      }
    },
    [state.currentUser, refreshAuth],
  );

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState((s) => ({
      ...s,
      bookmarks: [],
      liked: [],
      reposted: [],
      following: [],
      joinedCommunities: [],
      feedTab: "foryou",
      search: "",
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      getUser,
      likePost,
      repostPost,
      toggleBookmark,
      toggleFollow,
      toggleJoinCommunity,
      createPost,
      deletePost,
      addComment,
      setFeedTab,
      setSearch,
      openComposer,
      closeComposer,
      openLogin,
      closeLogin,
      openEditProfile,
      closeEditProfile,
      markAllNotificationsRead,
      sendMessage,
      trackView,
      deleteComment,
      updatePost,
      openEditPost,
      closeEditPost,
      openConversation,
      updateProfile,
      signIn,
      signUp,
      signOut,
      resetData,
    }),
    [
      state,
      getUser,
      likePost,
      repostPost,
      toggleBookmark,
      toggleFollow,
      toggleJoinCommunity,
      createPost,
      deletePost,
      addComment,
      setFeedTab,
      setSearch,
      openComposer,
      closeComposer,
      openLogin,
      closeLogin,
      openEditProfile,
      closeEditProfile,
      markAllNotificationsRead,
      sendMessage,
      trackView,
      deleteComment,
      updatePost,
      openEditPost,
      closeEditPost,
      openConversation,
      updateProfile,
      signIn,
      signUp,
      signOut,
      resetData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de <AppProvider>");
  }
  return context;
}

export { guestUser };