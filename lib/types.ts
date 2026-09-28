export type PostKind =
  | "code"
  | "project"
  | "question"
  | "tutorial"
  | "news"
  | "idea"
  | "experience";

export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  website?: string;
  github?: string;
  location?: string;
  followers: number;
  following: number;
  technologies: string[];
  likedPosts: string[];
  joined: string;
  verified?: boolean;
  xp?: number;
  streak?: number;
  lastDaily?: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface Post {
  id: string;
  authorId: string;
  kind: PostKind;
  content: string;
  hashtags: string[];
  code?: CodeSnippet;
  image?: string;
  video?: string;
  createdAt: string;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  communitySlug?: string;
  featured?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  code?: CodeSnippet;
  createdAt: string;
  likes: number;
}

export interface Community {
  slug: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  emoji: string;
  gradient: string;
  technologies: string[];
}

export type NotificationType =
  | "like"
  | "repost"
  | "follow"
  | "comment"
  | "mention"
  | "message"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId?: string;
  postId?: string;
  text: string;
  createdAt: string;
  read: boolean;
  forUserId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  code?: CodeSnippet;
  createdAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url?: string;
}

export interface Trend {
  id: string;
  tag: string;
  posts: number;
  category: string;
}

export interface CreatePostInput {
  id?: string;
  content: string;
  code?: CodeSnippet;
  image?: string;
  video?: string;
  communitySlug?: string;
}

export interface InitialData {
  posts: Post[];
  comments: Record<string, Comment[]>;
  messages: Message[];
  notifications: Notification[];
  users: User[];
}

export interface ScrapedMeme {
  id: string;
  title: string;
  image: string;
  url: string;
  source: string;
}

export interface ScrapedVideo {
  id: string;
  title: string;
  videoUrl: string;
  poster?: string;
  url: string;
  source: string;
}

export interface ScrapedResponse {
  memes: ScrapedMeme[];
  clips: ScrapedMeme[];
  videos: ScrapedVideo[];
  fetchedAt: string;
  cached: boolean;
  fallback?: boolean;
  error?: string;
}