"use client";

import { useState } from "react";
import type { CodeSnippet } from "@/lib/types";
import { tokenClass, tokenize } from "@/lib/highlight";
import { CheckIcon, CopyIcon } from "./icons";

export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);
  const tokens = tokenize(snippet.code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard no disponible
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0f]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </span>
          {snippet.language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              Copiado
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              Copiar
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {tokens.map((token, i) => (
            <span key={i} className={tokenClass(token.type)}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}