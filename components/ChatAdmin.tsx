"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  startChatSession,
  sendChatMessage,
  DEFAULT_WELCOME_MESSAGES,
  type ChatMessage,
} from "@/lib/api/chat";
import { getEcho } from "@/lib/echo";

type ChatAdminModalProps = {
  onClose: () => void;
};

const CHAT_STORAGE_KEY = "p2r_live_chat_history";
const CHAT_SESSION_TOKEN_KEY = "p2r_live_chat_session_token";

export default function ChatAdminModal({ onClose }: ChatAdminModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "offline">("connecting");
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    setShowScrollBottom(false);
  };

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBottom(!isNearBottom);
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Initialize or restore session token & history
  const initOrRestoreSession = useCallback(async () => {
    let token = localStorage.getItem(CHAT_SESSION_TOKEN_KEY);
    const storedHistory = localStorage.getItem(CHAT_STORAGE_KEY);

    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        // ignore parse error
      }
    }

    if (!token && isAuthenticated) {
      try {
        const res = await startChatSession({
          guest_name: user?.name || "Player",
          guest_email: user?.email || null,
          topic: "Live Support P2R",
        });
        token = res.session.session_token;
        localStorage.setItem(CHAT_SESSION_TOKEN_KEY, token);
        if (res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        }
      } catch (err) {
        console.error("[ChatAdmin] Failed to initialize chat session:", err);
      }
    } else if (!storedHistory && !token) {
      setMessages(DEFAULT_WELCOME_MESSAGES);
    }

    setSessionToken(token);
    setIsLoading(false);
    return token;
  }, [isAuthenticated, user]);

  useEffect(() => {
    initOrRestoreSession();
  }, [initOrRestoreSession]);

  // Real-time WebSocket listener for incoming admin replies
  useEffect(() => {
    if (!sessionToken) return;

    const echo = getEcho();
    if (!echo) {
      setConnectionStatus("offline");
      return;
    }

    try {
      const pusherConnector = (
        echo as unknown as {
          connector?: { pusher?: { connection?: { state?: string; bind?: (e: string, fn: (st: { current: string }) => void) => void } } };
        }
      ).connector?.pusher?.connection;

      if (pusherConnector) {
        setConnectionStatus(
          pusherConnector.state === "connected" ? "connected" : "connecting"
        );
        pusherConnector.bind?.("state_change", (states: { current: string }) => {
          if (states.current === "connected") setConnectionStatus("connected");
          else if (states.current === "connecting") setConnectionStatus("connecting");
          else setConnectionStatus("offline");
        });
      }
    } catch {
      // ignore
    }

    const channelName = `chat.session.${sessionToken}`;
    const channel = echo.channel(channelName);

    const handleIncomingMessage = (payload: {
      id: number;
      chat_session_id: number;
      sender_type: string;
      sender_id: number | null;
      message: string;
      attachment_url: string | null;
      created_at: string;
      session_token: string;
    }) => {
      if (payload.sender_type === "admin") {
        setMessages((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          if (list.some((m) => String(m.id) === String(payload.id))) {
            return list;
          }
          return [
            ...list,
            {
              id: payload.id,
              chat_session_id: payload.chat_session_id,
              sender: "admin",
              sender_name: "Admin P2R",
              text: payload.message,
              attachment_url: payload.attachment_url,
              created_at: payload.created_at || new Date().toISOString(),
            },
          ];
        });

        const el = messagesContainerRef.current;
        const isNearBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        if (isNearBottom) {
          setTimeout(() => scrollToBottom(true), 50);
        } else {
          setShowScrollBottom(true);
        }
      }
    };

    channel.listen(".ChatMessageSent", handleIncomingMessage);
    channel.listen("ChatMessageSent", handleIncomingMessage);

    return () => {
      echo.leaveChannel(channelName);
    };
  }, [sessionToken]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom(false);
    }
  }, [isLoading]);

  // Save to localStorage when messages change
  useEffect(() => {
    if (!isLoading && Array.isArray(messages) && messages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // ignore storage error
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    if (!isAuthenticated) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);
    setSendError(null);

    try {
      let activeToken = sessionToken;
      if (!activeToken) {
        const res = await startChatSession({
          guest_name: user?.name || "Player",
          guest_email: user?.email || null,
          topic: "Live Support P2R",
        });
        activeToken = res.session.session_token;
        setSessionToken(activeToken);
        localStorage.setItem(CHAT_SESSION_TOKEN_KEY, activeToken);
      }

      const sentMessage = await sendChatMessage(activeToken, text, user?.name);
      setMessages((prev) =>
        Array.isArray(prev) ? [...prev, sentMessage] : [sentMessage],
      );
      setTimeout(() => scrollToBottom(true), 50);
    } catch (err) {
      console.error("[ChatAdmin] Error sending message:", err);
      setSendError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSending(false);
    }
  };

  const handleLoginRedirect = () => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/";
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const msgList = Array.isArray(messages) ? messages : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Chat Admin CS"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-body"
    >
      <div className="relative w-full max-w-xl max-h-[85vh] h-[550px] bg-[#5b2be6]/95 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-white/95 px-5 sm:px-6 py-3.5 flex justify-between items-center border-b border-black/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-arcade-violet text-arcade-yellow font-display font-bold text-lg shadow-sm">
              CS
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-red-500"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-arcade-ink font-display font-bold text-base sm:text-lg leading-tight">
                  Admin Support P2R
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    connectionStatus === "connected"
                      ? "bg-green-100 text-green-800"
                      : connectionStatus === "connecting"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {connectionStatus === "connected"
                    ? "Live"
                    : connectionStatus === "connecting"
                      ? "Menghubungkan..."
                      : "Offline"}
                </span>
              </div>
              <p className="text-xs font-semibold text-arcade-ink/70">
                Customer Service &amp; Pameran
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal chat"
            className="text-arcade-ink/80 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-black/5 cursor-pointer font-mono font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Message Container */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3.5 bg-black/15"
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-arcade-yellow border-t-transparent" />
            </div>
          ) : msgList.length > 0 ? (
            msgList.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md break-words ${
                      isUser
                        ? "bg-arcade-yellow text-arcade-ink font-semibold rounded-br-xs"
                        : "bg-arcade-purple/90 border border-white/10 text-white rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 font-display text-[10px] text-white/60 px-1 flex items-center gap-1">
                    <span>
                      {msg.sender_name || (isUser ? "Kamu" : "Admin")} •{" "}
                      {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isUser && <span className="text-arcade-yellow font-bold">✓✓</span>}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/70">
              <p className="font-display text-sm">Belum ada riwayat pesan.</p>
            </div>
          )}
          <div ref={messagesEndRef} />

          {/* Floating new message button */}
          {showScrollBottom && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="sticky bottom-2 self-center z-10 rounded-full bg-arcade-yellow px-3.5 py-1.5 font-display text-xs font-bold text-arcade-ink shadow-lg hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer"
            >
              ⬇ Pesan baru
            </button>
          )}
        </div>

        {/* Footer / Input Area */}
        <div className="p-4 border-t border-white/15 bg-black/30 flex-shrink-0">
          {sendError && (
            <div className="mb-2 text-center text-xs font-semibold text-red-300">
              {sendError}
            </div>
          )}
          {isAuthenticated ? (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tulis pesan ke Admin..."
                disabled={isSending}
                className="flex-1 bg-black/40 border border-white/30 rounded-full px-5 py-3 text-white text-sm outline-none focus:border-arcade-yellow focus:ring-1 focus:ring-arcade-yellow transition-all placeholder:text-white/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                aria-label="Kirim pesan"
                className="h-11 px-5 bg-arcade-yellow hover:bg-yellow-300 text-arcade-ink font-display font-bold text-sm rounded-full flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSending ? "..." : "Kirim"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left bg-black/40 border border-arcade-yellow/40 rounded-2xl p-3">
              <p className="text-xs font-semibold text-white/90">
                Masuk ke akun Anda untuk mengirim pesan ke Admin.
              </p>
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-arcade-yellow px-4 py-1.5 font-display text-xs font-bold text-arcade-ink shadow-[2px_2px_0_var(--arcade-yellow-shadow)] hover:-translate-y-0.5"
              >
                Masuk Sekarang →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}