"use client";

import { useParams } from "next/navigation";
import { PostDetail } from "@/components/post-detail";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  return <PostDetail postId={params.id} />;
}