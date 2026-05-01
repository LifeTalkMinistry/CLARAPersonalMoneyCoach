import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, MoreHorizontal, Phone, Send, Search } from "lucide-react";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

function formatMessageTime(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (error) {
    console.warn("Unable to format message time", error);
    return "";
  }
}

function formatConversationTime(value) {
  if (!value) return "";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;

  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.warn("Unable to format conversation time", error);
    return "";
  }
}

function getInitials(value = "") {
  const cleaned = value.trim();

  if (!cleaned) return "CP";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CP";
}

function StateCard({ title, description }) {
  return (
    <div className="mx-4 my-4 rounded-[26px] border border-white/10 bg-white/[0.045] px-4 py-5 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <p className="text-sm font-semibold text-white/90">{title}</p>
      <p className="mx-auto mt-1 max-w-[260px] text-xs leading-relaxed text-white/45">
        {description}
      </p>
    </div>
  );
}

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatError, setChatError] = useState(false);
  const messageEndRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const filteredConversations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const haystack = [
        conversation.name,
        conversation.preview,
        ...(conversation.members || []).map((member) => member.display_name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [conversations, searchTerm]);

  useEffect(() => {
    if (!user?.id || !supabase) {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
      return undefined;
    }

    let alive = true;

    async function fetchConversations() {
      setLoadingConversations(true);
      setChatError(false);

      try {
        const { data: membershipRows, error: membershipError } = await supabase
          .from("conversation_members")
          .select("id, conversation_id, user_id, display_name, avatar_initials, role, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (membershipError) throw membershipError;

        const conversationIds = [
          ...new Set((membershipRows || []).map((row) => row.conversation_id).filter(Boolean)),
        ];

        if (!conversationIds.length) {
          if (!alive) return;
          setConversations([]);
          setActiveConversationId(null);
          setMessages([]);
          return;
        }

        const [{ data: conversationRows, error: conversationError }, { data: memberRows, error: memberError }] =
          await Promise.all([
            supabase
              .from("conversations")
              .select("id, title, type, created_by, created_at, updated_at")
              .in("id", conversationIds)
              .order("updated_at", { ascending: false }),
            supabase
              .from("conversation_members")
              .select("id, conversation_id, user_id, display_name, avatar_initials, role, created_at")
              .in("conversation_id", conversationIds),
          ]);

        if (conversationError) throw conversationError;
        if (memberError) throw memberError;

        const { data: latestMessages, error: latestError } = await supabase
          .from("messages")
          .select("id, conversation_id, body, created_at")
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
          .limit(50);

        if (latestError) throw latestError;

        const latestByConversation = new Map();
        (latestMessages || []).forEach((message) => {
          if (!latestByConversation.has(message.conversation_id)) {
            latestByConversation.set(message.conversation_id, message);
          }
        });

        const nextConversations = (conversationRows || []).map((conversation) => {
          const members = (memberRows || []).filter(
            (member) => member.conversation_id === conversation.id
          );
          const otherMember = members.find((member) => member.user_id !== user.id);
          const latestMessage = latestByConversation.get(conversation.id);
          const displayName =
            conversation.title ||
            otherMember?.display_name ||
            members[0]?.display_name ||
            "CLARA Partner";

          return {
            id: conversation.id,
            name: displayName,
            initials:
              otherMember?.avatar_initials ||
              members[0]?.avatar_initials ||
              getInitials(displayName),
            preview: latestMessage?.body || "Ready for money check-ins.",
            time: formatConversationTime(latestMessage?.created_at || conversation.updated_at),
            updatedAt: latestMessage?.created_at || conversation.updated_at || conversation.created_at,
            members,
          };
        });

        nextConversations.sort(
          (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
        );

        if (!alive) return;

        setConversations(nextConversations);
        setActiveConversationId((currentId) => {
          if (currentId && nextConversations.some((conversation) => conversation.id === currentId)) {
            return currentId;
          }

          return nextConversations[0]?.id || null;
        });
      } catch (error) {
        console.warn("Messages conversation fetch failed", error);
        if (!alive) return;
        setChatError(true);
        setConversations([]);
        setActiveConversationId(null);
        setMessages([]);
      } finally {
        if (alive) setLoadingConversations(false);
      }
    }

    fetchConversations();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!activeConversationId || !supabase) {
      setMessages([]);
      return undefined;
    }

    let alive = true;

    async function fetchMessages() {
      setLoadingMessages(true);
      setChatError(false);

      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id, conversation_id, sender_id, body, created_at, seen_at")
          .eq("conversation_id", activeConversationId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (!alive) return;
        setMessages(data || []);
      } catch (error) {
        console.warn("Messages fetch failed", error);
        if (!alive) return;
        setChatError(true);
        setMessages([]);
      } finally {
        if (alive) setLoadingMessages(false);
      }
    }

    fetchMessages();

    const channel = supabase
      .channel(`clara-messages-${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const incomingMessage = payload.new;

          setMessages((currentMessages) => {
            if (currentMessages.some((message) => message.id === incomingMessage.id)) {
              return currentMessages;
            }

            return [...currentMessages, incomingMessage].sort(
              (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
            );
          });

          setConversations((currentConversations) =>
            currentConversations
              .map((conversation) =>
                conversation.id === incomingMessage.conversation_id
                  ? {
                      ...conversation,
                      preview: incomingMessage.body,
                      time: formatConversationTime(incomingMessage.created_at),
                      updatedAt: incomingMessage.created_at,
                    }
                  : conversation
              )
              .sort(
                (a, b) =>
                  new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
              )
          );
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("Messages realtime channel error");
        }
      });

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [activeConversationId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, activeConversationId, loadingMessages]);

  async function handleSendMessage() {
    const cleanMessage = draftMessage.trim();

    if (!cleanMessage || !user?.id || !activeConversationId || sendingMessage || !supabase) return;

    setSendingMessage(true);

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConversationId,
        sender_id: user.id,
        body: cleanMessage,
      });

      if (error) throw error;

      setDraftMessage("");
    } catch (error) {
      console.warn("Message send failed", error);
      setChatError(true);
    } finally {
      setSendingMessage(false);
    }
  }

  const showSignedOutState = !authLoading && !user?.id;
  const showNoConversations =
    !showSignedOutState && !chatError && !loadingConversations && conversations.length === 0;
  const showNoFilteredConversations =
    !showSignedOutState &&
    !chatError &&
    !loadingConversations &&
    conversations.length > 0 &&
    filteredConversations.length === 0;
  const showNoMessages =
    !chatError && !loadingMessages && activeConversationId && messages.length === 0;

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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/35"
            />
          </div>
        </header>

        <div className="grid flex-1 grid-rows-[auto_1fr_auto] overflow-hidden">
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3">
            {authLoading || loadingConversations ? (
              <div className="flex min-w-[210px] items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-3 text-left">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-white/10" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                  <div className="h-2 w-36 animate-pulse rounded-full bg-white/5" />
                </div>
              </div>
            ) : null}

            {!authLoading &&
              !loadingConversations &&
              filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveConversationId(conversation.id)}
                    className={`flex min-w-[210px] items-center gap-3 rounded-3xl border p-3 text-left transition active:scale-[0.99] ${
                      isActive
                        ? "border-white/15 bg-white/[0.09] shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                        : "border-white/10 bg-white/[0.035]"
                    }`}
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-bold text-white/85">
                      {conversation.initials}
                      {isActive && (
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
                );
              })}
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-bold text-white/85">
                  {activeConversation?.initials || "CP"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    {activeConversation?.name || "CLARA Partner"}
                  </p>
                  <p className="text-[11px] text-emerald-300/75">
                    {activeConversation ? "Active for money check-ins" : "Messages ready"}
                  </p>
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
              {showSignedOutState && (
                <StateCard
                  title="Sign in to use Messages"
                  description="Your CLARA partner chats will appear here after you sign in."
                />
              )}

              {chatError && (
                <StateCard
                  title="Messages are not ready yet."
                  description="Please check the Supabase chat tables."
                />
              )}

              {showNoConversations && (
                <StateCard
                  title="No conversations yet."
                  description="Your CLARA partner chats will appear here."
                />
              )}

              {showNoFilteredConversations && (
                <StateCard
                  title="No matching conversations."
                  description="Try searching by chat name, preview, or member name."
                />
              )}

              {loadingMessages && !chatError && (
                <StateCard title="Loading messages..." description="Preparing your money check-in thread." />
              )}

              {showNoMessages && (
                <StateCard
                  title="No messages yet."
                  description="Start the conversation with a quick money check-in."
                />
              )}

              {!chatError &&
                !loadingMessages &&
                messages.map((message) => {
                  const isMe = message.sender_id === user?.id;

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
                          {message.body}
                        </div>
                        <p
                          className={`mt-1 px-1 text-[10px] text-white/35 ${
                            isMe ? "text-right" : "text-left"
                          }`}
                        >
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}

              <div ref={messageEndRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/90 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <div className="flex items-end gap-2 rounded-[26px] border border-white/10 bg-white/[0.055] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <textarea
                rows={1}
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={!user?.id || !activeConversationId || chatError || sendingMessage}
                placeholder={user?.id ? "Message your partner..." : "Sign in to send messages"}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  !draftMessage.trim() ||
                  !user?.id ||
                  !activeConversationId ||
                  chatError ||
                  sendingMessage
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.12)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
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
