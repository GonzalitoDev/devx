import type {
  CodeSnippet,
  Comment,
  Message,
  Notification,
  Post,
  PostKind,
  User,
} from "./types";

export interface PostRow {
  id: string;
  author_id: string;
  kind: string;
  content: string;
  hashtags: string[];
  code: CodeSnippet | null;
  image: string | null;
  video: string | null;
  community_slug: string | null;
  created_at: string;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  featured?: boolean;
}

export interface CommentRow {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  code: CodeSnippet | null;
  created_at: string;
  likes: number;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  code: CodeSnippet | null;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  type: string;
  from_user_id: string | null;
  post_id: string | null;
  text: string;
  created_at: string;
  read: boolean;
  for_user_id?: string | null;
}

export interface ProfileRow {
  id: string;
  username: string;
  name: string;
  bio: string;
  website: string | null;
  github: string | null;
  location: string | null;
  followers: number;
  following: number;
  technologies: string[];
  liked_posts: string[];
  joined: string;
  verified: boolean;
  xp?: number;
  streak?: number;
  last_daily?: string | null;
}

export function toUser(row: ProfileRow): User {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    bio: row.bio,
    website: row.website ?? undefined,
    github: row.github ?? undefined,
    location: row.location ?? undefined,
    followers: row.followers,
    following: row.following,
    technologies: row.technologies ?? [],
    likedPosts: row.liked_posts ?? [],
    joined: row.joined,
    verified: row.verified,
    xp: row.xp ?? 0,
    streak: row.streak ?? 0,
    lastDaily: row.last_daily ?? undefined,
  };
}

export function toProfileRow(user: User): ProfileRow {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    website: user.website ?? null,
    github: user.github ?? null,
    location: user.location ?? null,
    followers: user.followers,
    following: user.following,
    technologies: user.technologies,
    liked_posts: user.likedPosts,
    joined: user.joined,
    verified: user.verified ?? false,
    xp: user.xp ?? 0,
    streak: user.streak ?? 0,
    last_daily: user.lastDaily ?? null,
  };
}

export function toPost(row: PostRow): Post {
  return {
    id: row.id,
    authorId: row.author_id,
    kind: row.kind as PostKind,
    content: row.content,
    hashtags: row.hashtags ?? [],
    code: row.code ?? undefined,
    image: row.image ?? undefined,
    video: row.video ?? undefined,
    createdAt: row.created_at,
    replies: row.replies,
    reposts: row.reposts,
    likes: row.likes,
    views: row.views,
    communitySlug: row.community_slug ?? undefined,
    featured: row.featured ?? false,
  };
}

export function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    content: row.content,
    code: row.code ?? undefined,
    createdAt: row.created_at,
    likes: row.likes,
  };
}

export function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: row.text,
    code: row.code ?? undefined,
    createdAt: row.created_at,
  };
}

export function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type as Notification["type"],
    fromUserId: row.from_user_id ?? undefined,
    postId: row.post_id ?? undefined,
    text: row.text,
    createdAt: row.created_at,
    read: row.read,
    forUserId: row.for_user_id ?? undefined,
  };
}

export function toPostRow(
  post: Post,
): Omit<PostRow, "replies" | "reposts" | "likes" | "views"> {
  return {
    id: post.id,
    author_id: post.authorId,
    kind: post.kind,
    content: post.content,
    hashtags: post.hashtags,
    code: post.code ?? null,
    image: post.image ?? null,
    video: post.video ?? null,
    community_slug: post.communitySlug ?? null,
    created_at: post.createdAt,
    featured: post.featured ?? false,
  };
}

export function toCommentRow(comment: Comment): CommentRow {
  return {
    id: comment.id,
    post_id: comment.postId,
    author_id: comment.authorId,
    content: comment.content,
    code: comment.code ?? null,
    created_at: comment.createdAt,
    likes: comment.likes,
  };
}

export function toMessageRow(message: Message): MessageRow {
  return {
    id: message.id,
    conversation_id: message.conversationId,
    sender_id: message.senderId,
    text: message.text,
    code: message.code ?? null,
    created_at: message.createdAt,
  };
}

export function toNotificationRow(notification: Notification): NotificationRow {
  return {
    id: notification.id,
    type: notification.type,
    from_user_id: notification.fromUserId ?? null,
    post_id: notification.postId ?? null,
    text: notification.text,
    created_at: notification.createdAt,
    read: notification.read,
    for_user_id: notification.forUserId ?? null,
  };
}

export function extractHashtags(content: string): string[] {
  return Array.from(new Set(content.match(/#([\w-]+)/g) ?? [])).map((h) =>
    h.slice(1),
  );
}

export function extractKind(content: string, code?: CodeSnippet): PostKind {
  if (code) return "code";
  if (/^(¿|qué|que|how|what|why|por qué|cuál)/i.test(content.trim())) {
    return "question";
  }
  return "idea";
}