import { ArrowLeft, MoreHorizontal, Phone, Send, Search } from "lucide-react";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";

const conversations = [
  {
    id: 1,
    name: "CLARA Partner",
    initials: "CP",
    preview: "You stayed within your daily spending target today.",
    time: "Now",
    active: true,
  },
  {
    id: 2,
    name: "Accountability Circle",
    initials: "AC",
    preview: "Share one small money win this week.",
    time: "2h",
    active: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "partner",
    text: "Hey Max, quick check-in. How did your spending feel today?",
    time: "3:20 PM",
  },
  {
    id: 2,
    sender: "me",
    text: "Better. I paused before buying something unnecessary.",
    time: "3:22 PM",
  },
  {
    id: 3,
    sender: "partner",
    text: "That is progress. Small pauses create stronger discipline.",
    time: "3:23 PM",
  },
];

export default function Messages() {
  return (
    <ClaraPageShell hideTopNav={true}>
      <section className="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <header className="border-b border-white/10 bg-white/[0.045] px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition active:scale-95"
                aria-label="Back"
              >
                <ArrowLeft size={17} />
              </button>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  CLARA Messages
                </p>
                <h1 className="text-base font-semibold tracking-tight text-white">
                  Conversations
                </h1>
              </div>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition active:scale-95"
              aria-label="Message options"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white/40">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/35"
            />
          </div>
        </header>

        <div className="grid flex-1 grid-rows-[auto_1fr_auto] overflow-hidden">
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`flex min-w-[210px] items-center gap-3 rounded-3xl border p-3 text-left transition active:scale-[0.99] ${
                  conversation.active
                    ? "border-white/15 bg-white/[0.09] shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                    : "border-white/10 bg-white/[0.035]"
                }`}
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-bold text-white/85">
                  {conversation.initials}
                  {conversation.active && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white/90">
                      {conversation.name}
                    </p>
                    <span className="text-[10px] text-white/35">{conversation.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-white/45">
                    {conversation.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-bold text-white/85">
                  CP
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">CLARA Partner</p>
                  <p className="text-[11px] text-emerald-300/75">Active for money check-ins</p>
                </div>
              </div>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition active:scale-95"
                aria-label="Call partner"
              >
                <Phone size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => {
                const isMe = message.sender === "me";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[78%] ${isMe ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-[0_14px_36px_rgba(0,0,0,0.22)] ${
                          isMe
                            ? "rounded-br-md bg-white text-slate-950"
                            : "rounded-bl-md border border-white/10 bg-white/[0.07] text-white/82"
                        }`}
                      >
                        {message.text}
                      </div>
                      <p
                        className={`mt-1 px-1 text-[10px] text-white/35 ${
                          isMe ? "text-right" : "text-left"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/90 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <div className="flex items-end gap-2 rounded-[26px] border border-white/10 bg-white/[0.055] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <textarea
                rows={1}
                placeholder="Message your partner..."
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
              />

              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.12)] transition active:scale-95"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </ClaraPageShell>
  );
}
