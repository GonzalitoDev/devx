"use client";

import { useApp } from "@/lib/store";

export function FeedTabs() {
  const { feedTab, setFeedTab } = useApp();

  const tabs = [
    { id: "foryou" as const, label: "Para ti" },
    { id: "following" as const, label: "Siguiendo" },
  ];

  return (
    <div className="flex border-b border-zinc-900">
      {tabs.map((tab) => {
        const active = feedTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setFeedTab(tab.id)}
            className="relative flex-1 py-3.5 text-sm font-semibold transition-colors hover:bg-zinc-950"
          >
            <span className={active ? "text-zinc-100" : "text-zinc-500"}>
              {tab.label}
            </span>
            {active ? (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-14 -translate-x-1/2 rounded-full bg-sky-500" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}