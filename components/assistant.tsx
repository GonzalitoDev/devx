"use client";

import { useEffect, useRef, useState } from "react";
import { replyTo, welcome, type AssistantMessage } from "@/lib/assistant";
import { BotIcon, SendIcon, XIcon } from "./icons";

const STORAGE_KEY = "devx-assistant-history";

const CHIPS = [
  "Contame un chiste",
  "Dame una excusa",
  "Horóscopo dev",
  "Roastme",
  "Motivame",
  "Commit random",
];

function initialMessages(): AssistantMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as AssistantMessage[];
  } catch {
    // historial corrupto: empezar de cero
  }
  return [{ role: "bot", text: welcome("") }];
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: replyTo(trimmed, "dev") }]);
      setTyping(false);
    }, 500);
  };

  const clearChat = () => {
    setMessages([{ role: "bot", text: welcome("") }]);
  };

  return (
    <>
      {open ? (
        <div className="fixed bottom-24 left-4 z-50 flex max-h-[min(520px,calc(100dvh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl lg:bottom-6 lg:left-auto lg:right-6">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <BotIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-zinc-100">Buggy 🐛</p>
                <p className="text-[11px] text-zinc-500">Asistente social con humor de dev</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Cerrar asistente"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-sky-500/90 text-white"
                      : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-zinc-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="flex justify-start">
                <div className="rounded-bl-md rounded-2xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-400">
                  Buggy está escribiendo<span className="animate-pulse">…</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-zinc-800 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-sky-500/50 hover:text-zinc-200"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
                placeholder="Escribile algo a Buggy…"
                className="flex-1 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-sky-500/50"
              />
              <button
                onClick={() => send(input)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white transition-colors hover:bg-sky-400"
                aria-label="Enviar"
              >
                <SendIcon className="h-4 w-4" />
              </button>
              <button
                onClick={clearChat}
                className="shrink-0 rounded-full px-2 py-1.5 text-[11px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                title="Limpiar conversación"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition-transform hover:scale-105 lg:bottom-6 lg:left-auto lg:right-6"
        aria-label="Abrir asistente"
        title="Asistente Buggy"
      >
        <BotIcon className="h-6 w-6" />
      </button>
    </>
  );
}