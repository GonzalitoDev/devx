"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

const TOKEN_SOURCE =
  /(#[A-Za-z0-9_-]+)|(@[A-Za-z0-9_-]+)|(https?:\/\/[^\s]+)/.source;

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const { setSearch } = useApp();
  const router = useRouter();

  const parts: ReactNode[] = [];
  const tokenRegex = new RegExp(TOKEN_SOURCE, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [full, hash, mention, url] = match;
    if (hash) {
      parts.push(
        <button
          key={match.index}
          className="font-medium text-sky-400 hover:underline"
          onClick={() => {
            setSearch(hash.slice(1));
            router.push("/explore");
          }}
        >
          {hash}
        </button>,
      );
    } else if (mention) {
      const username = mention.slice(1);
      parts.push(
        <Link
          key={match.index}
          href={`/profile/${username}`}
          className="font-medium text-sky-400 hover:underline"
        >
          {mention}
        </Link>,
      );
    } else if (url) {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sky-400 hover:underline"
        >
          {url}
        </a>,
      );
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <p className={`whitespace-pre-wrap break-words ${className}`}>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </p>
  );
}