"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { Avatar } from "@/components/avatar";
import { CodeBlock } from "@/components/code-block";
import { EmptyState } from "@/components/empty-state";
import { ArrowLeftIcon, MailIcon, SendIcon } from "@/components/icons";

function useActiveConversation(messages: ReturnType<typeof useApp>["messages"]) {
  const conversations = useMemo(() => {
    const map = new Map<string, typeof messages>();
    messages.forEach((m) => {
      const list = map.get(m.conversationId) ?? [];
      list.push(m);
      map.set(m.conversationId, list);
    });
    return [...map.entries()]
      .map(([userId, msgs]) => ({
        userId,
        messages: msgs.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
        lastAt: msgs[msgs.length - 1].createdAt,
      }))
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  }, [messages]);

  return conversations;
}

export default function MessagesPage() {
  const {
    messages,
    currentUser,
    getUser,
    sendMessage,
    openLogin,
    messagesTarget,
  } = useApp();
  const conversations = useActiveConversation(messages);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    messagesTarget,
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [text, setText] = useState("");

  const activeUserId = selectedUserId ?? messagesTarget ?? conversations[0]?.userId ?? null;

  const activeUser = activeUserId ? getUser(activeUserId) : undefined;
  const activeMessages = activeUserId
    ? conversations.find((c) => c.userId === activeUserId)?.messages ?? []
    : [];

  const handleSend = () => {
    if (!text.trim() || !activeUserId) return;
    if (!currentUser) {
      openLogin();
      return;
    }
    sendMessage(activeUserId, text.trim());
    setText("");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-30 border-b border-zinc-900 bg-black/80 px-4 py-3 backdrop-blur lg:hidden">
        <h1 className="text-lg font-bold text-zinc-100">Mensajes</h1>
      </div>

      <div className="flex flex-1">
        <div
          className={`w-full flex-col border-zinc-900 md:flex md:w-72 md:border-r ${
            chatOpen ? "hidden md:flex" : "flex"
          }`}
        >
          {conversations.length === 0 ? (
            <EmptyState
              icon={<MailIcon className="h-7 w-7" />}
              title="Sin conversaciones"
              description="Cuando inicies una conversación, aparecerá aquí."
            />
          ) : (
            <ul>
              {conversations.map((conversation) => {
                const user = getUser(conversation.userId);
                if (!user) return null;
                const last = conversation.messages[conversation.messages.length - 1];
                const isActive = activeUserId === conversation.userId;
                return (
                  <li key={conversation.userId}>
                    <button
                      onClick={() => {
                        setSelectedUserId(conversation.userId);
                        setChatOpen(true);
                      }}
                      className={`flex w-full items-center gap-3 border-b border-zinc-900 px-4 py-3 text-left transition-colors ${
                        isActive ? "bg-zinc-950" : "hover:bg-zinc-950/60"
                      }`}
                    >
                      <Avatar user={user} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between">
                          <span className="truncate font-semibold text-zinc-100">
                            {user.name}
                          </span>
                          <span className="text-xs text-zinc-600">
                            {timeAgo(last.createdAt)}
                          </span>
                        </span>
                        <span className="block truncate text-sm text-zinc-500">
                          {last.senderId === currentUser?.id ? "Tú: " : ""}
                          {last.text}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={`min-w-0 flex-1 flex-col ${chatOpen ? "flex" : "hidden md:flex"}`}
        >
          {activeUser ? (
            <>
              <div className="flex items-center gap-3 border-b border-zinc-900 px-4 py-3">
                <button
                  onClick={() => setChatOpen(false)}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-900 md:hidden"
                  aria-label="Volver"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <Avatar user={activeUser} size="sm" />
                <div>
                  <p className="font-semibold text-zinc-100">{activeUser.name}</p>
                  <p className="text-sm text-zinc-500">@{activeUser.username}</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {activeMessages.map((message) => {
                  const mine = message.senderId === currentUser?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                          mine
                            ? "rounded-br-md bg-sky-500/90 text-white"
                            : "rounded-bl-md bg-zinc-900 text-zinc-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {message.text}
                        </p>
                        {message.code ? (
                          <div className="mt-2">
                            <CodeBlock snippet={message.code} />
                          </div>
                        ) : null}
                        <p
                          className={`mt-1 text-right text-[10px] ${
                            mine ? "text-sky-100" : "text-zinc-500"
                          }`}
                        >
                          {timeAgo(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-900 p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Mensaje para ${activeUser.name}`}
                  className="flex-1 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-sky-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    text.trim()
                      ? "bg-sky-500 text-white hover:bg-sky-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                  aria-label="Enviar mensaje"
                >
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<MailIcon className="h-7 w-7" />}
              title="Selecciona una conversación"
              description="Elige un chat de la lista para empezar."
            />
          )}
        </div>
      </div>
    </div>
  );
}