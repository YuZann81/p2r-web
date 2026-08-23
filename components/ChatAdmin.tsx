"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getActiveChatSession,
  startChatSession,
  sendChatMessage,
  endChatSession,
  reconcileMessages,
  DEFAULT_WELCOME_MESSAGES,
  type ChatMessage,
} from "@/lib/api/chat";
import { getEcho } from "@/lib/echo";
import { ChatSkeleton } from "@/components/ChatSkeleton";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { AlertCircle, MessageSquare, Power } from "lucide-react";

type ChatAdminModalProps = {
  onClose: () => void;
};

const CHAT_STORAGE_KEY = "p2r_live_chat_history";
const CHAT_SESSION_TOKEN_KEY = "p2r_live_chat_session_token";

export default function ChatAdminModal({ onClose }: ChatAdminModalProps) {
  const router = useRouter();
  const { user, token: authToken, isAuthenticated } = useAuth();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isClosingSession, setIsClosingSession] = useState(false);

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
      if (e.key === "Escape" && !showCloseDialog) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, showCloseDialog]);

  // Initialize or restore session token & history from backend (Source of Truth)
  const initOrRestoreSession = useCallback(async () => {
    setIsLoading(true);

    // 1. If user is authenticated, query backend for account-bound active session
    if (isAuthenticated) {
      try {
        const active = await getActiveChatSession(authToken);
        if (active && active.session) {
          const token = active.session.session_token;
          setSessionToken(token);
          setMessages(
            active.messages && active.messages.length > 0
              ? active.messages
              : DEFAULT_WELCOME_MESSAGES
          );
          localStorage.setItem(CHAT_SESSION_TOKEN_KEY, token);
          setIsLoading(false);
          return token;
        }

        // If no active session on backend, create a new active session
        const res = await startChatSession(
          {
            guest_name: user?.name || "Player",
            guest_email: user?.email || null,
            topic: "Live Support P2R",
          },
          authToken
        );
        const token = res.session.session_token;
        setSessionToken(token);
        setMessages(
          res.messages && res.messages.length > 0
            ? res.messages
            : DEFAULT_WELCOME_MESSAGES
        );
        localStorage.setItem(CHAT_SESSION_TOKEN_KEY, token);
        setIsLoading(false);
        return token;
      } catch (err) {
        console.error("[ChatAdmin] Failed to initialize authenticated session:", err);
      }
    }

    // 2. Unauthenticated guest fallback
    const guestToken = localStorage.getItem(CHAT_SESSION_TOKEN_KEY);
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

    if (!guestToken && !storedHistory) {
      setMessages(DEFAULT_WELCOME_MESSAGES);
    }

    setSessionToken(guestToken);
    setIsLoading(false);
    return guestToken;
  }, [isAuthenticated, authToken, user]);

  useEffect(() => {
    initOrRestoreSession();
  }, [initOrRestoreSession]);

  // Real-time WebSocket listener with single message reconciliation
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
      const incomingMsg: ChatMessage = {
        id: payload.id,
        chat_session_id: payload.chat_session_id,
        sender: payload.sender_type === "admin" ? "admin" : "user",
        sender_name:
          payload.sender_type === "admin"
            ? "Admin P2R"
            : (user?.name || "Player"),
        text: payload.message,
        attachment_url: payload.attachment_url,
        created_at: payload.created_at || new Date().toISOString(),
      };

      setMessages((prev) => reconcileMessages(prev, incomingMsg));

      const el = messagesContainerRef.current;
      const isNearBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (isNearBottom) {
        setTimeout(() => scrollToBottom(true), 50);
      } else {
        setShowScrollBottom(true);
      }
    };

    channel.listen(".ChatMessageSent", handleIncomingMessage);
    channel.listen("ChatMessageSent", handleIncomingMessage);

    return () => {
      echo.leaveChannel(channelName);
    };
  }, [sessionToken, user?.name]);

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

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();

    if (!text) {
      setValidationError("Pesan tidak boleh kosong.");
      return;
    }

    if (isSending) return;

    if (!isAuthenticated) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setInputText("");
    setValidationError(null);
    setIsSending(true);
    setSendError(null);
    setLastFailedText(null);

    try {
      let activeToken = sessionToken;
      if (!activeToken) {
        const res = await startChatSession(
          {
            guest_name: user?.name || "Player",
            guest_email: user?.email || null,
            topic: "Live Support P2R",
          },
          authToken
        );
        activeToken = res.session.session_token;
        setSessionToken(activeToken);
        localStorage.setItem(CHAT_SESSION_TOKEN_KEY, activeToken);
      }

      const sentMessage = await sendChatMessage(
        activeToken,
        text,
        user?.name,
        authToken
      );
      setMessages((prev) => reconcileMessages(prev, sentMessage));
      setTimeout(() => scrollToBottom(true), 50);
    } catch (err: unknown) {
      console.error("[ChatAdmin] Error sending message:", err);
      setLastFailedText(text);
      if (err instanceof Error && err.message.includes("closed")) {
        setSendError("Sesi chat sebelumnya telah ditutup. Membuka percakapan baru...");
        try {
          const res = await startChatSession(
            {
              guest_name: user?.name || "Player",
              guest_email: user?.email || null,
              topic: "Live Support P2R",
            },
            authToken
          );
          const newToken = res.session.session_token;
          setSessionToken(newToken);
          localStorage.setItem(CHAT_SESSION_TOKEN_KEY, newToken);
          const retrySent = await sendChatMessage(
            newToken,
            text,
            user?.name,
            authToken
          );
          setMessages((prev) => reconcileMessages(prev, retrySent));
          setSendError(null);
          setLastFailedText(null);
          setTimeout(() => scrollToBottom(true), 50);
          return;
        } catch {
          // ignore
        }
      }
      setSendError("Gagal mengirim pesan. Periksa koneksi dan coba lagi.");
    } finally {
      setIsSending(false);
    }
  };

  const handleRetrySend = () => {
    if (!lastFailedText) return;
    setInputText(lastFailedText);
    setTimeout(() => {
      handleSend();
    }, 50);
  };

  const handleCloseSessionConfirm = async () => {
    if (!sessionToken) {
      setShowCloseDialog(false);
      return;
    }

    setIsClosingSession(true);
    try {
      await endChatSession(sessionToken);
      localStorage.removeItem(CHAT_SESSION_TOKEN_KEY);
      localStorage.removeItem(CHAT_STORAGE_KEY);
      setSessionToken(null);
      setMessages(DEFAULT_WELCOME_MESSAGES);
      setShowCloseDialog(false);
    } catch (err) {
      console.error("[ChatAdmin] Error closing session:", err);
    } finally {
      setIsClosingSession(false);
    }
  };

  const handleLoginRedirect = () => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/";
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const msgList = Array.isArray(messages) ? messages : [];

  return (
    <>
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
            <div className="flex items-center gap-1.5">
              {sessionToken && isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setShowCloseDialog(true)}
                  title="Akhiri percakapan saat ini"
                  aria-label="Akhiri sesi percakapan"
                  className="text-arcade-ink/70 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-black/5 cursor-pointer flex items-center gap-1 text-xs font-semibold"
                >
                  <Power className="size-4" />
                  <span className="hidden sm:inline">Tutup Sesi</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal chat"
                className="text-arcade-ink/80 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-black/5 cursor-pointer font-mono font-bold text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Message Container */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="relative flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3.5 bg-black/15"
          >
            {isLoading ? (
              <ChatSkeleton />
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
              <div className="flex h-full flex-col items-center justify-center text-center text-white/70 gap-2 p-6">
                <div className="p-3 rounded-full bg-white/10 text-arcade-yellow mb-1">
                  <MessageSquare className="size-6" />
                </div>
                <p className="font-display text-sm font-bold text-white">Belum ada pesan</p>
                <p className="text-xs text-white/60 max-w-xs">
                  Mulai percakapan dengan Customer Service seputar pameran karya, jadwal voting, atau merchandise resmi.
                </p>
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
            {validationError && (
              <div className="mb-2.5 flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 text-xs font-semibold text-amber-200">
                <AlertCircle className="size-4 shrink-0 text-amber-400" />
                <span>{validationError}</span>
              </div>
            )}
            {sendError && (
              <div className="mb-2.5 flex items-center justify-between gap-2 rounded-xl bg-rose-500/20 border border-rose-500/30 px-3.5 py-2 text-xs font-semibold text-rose-200">
                <div className="flex items-center gap-2 truncate">
                  <AlertCircle className="size-4 shrink-0 text-rose-400" />
                  <span className="truncate">{sendError}</span>
                </div>
                {lastFailedText && (
                  <button
                    type="button"
                    onClick={handleRetrySend}
                    className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-display text-xs font-bold shrink-0 transition-all cursor-pointer"
                  >
                    Coba Lagi
                  </button>
                )}
              </div>
            )}
            {isAuthenticated ? (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Tulis pesan ke Admin..."
                  disabled={isSending}
                  className="flex-1 bg-black/40 border border-white/30 rounded-full px-5 py-3 text-white text-sm outline-none focus:border-arcade-yellow focus:ring-1 focus:ring-arcade-yellow transition-all placeholder:text-white/40 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  aria-label="Kirim pesan"
                  className="h-11 px-5 bg-arcade-yellow hover:bg-yellow-300 text-arcade-ink font-display font-bold text-sm rounded-full flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSending ? (
                    <span className="flex items-center gap-1">
                      <span className="size-3.5 border-2 border-arcade-ink border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim...</span>
                    </span>
                  ) : (
                    "Kirim"
                  )}
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

      {/* Custom Confirmation Dialog for Closing Session */}
      <CustomDialog
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={handleCloseSessionConfirm}
        title="Tutup Percakapan?"
        description="Sesi percakapan aktif ini akan ditandai selesai. Riwayat pesan Anda tetap tersimpan di server."
        variant="confirmation"
        confirmText="Tutup Percakapan"
        cancelText="Batal"
        confirmVariant="danger"
        isLoading={isClosingSession}
      />
    </>
  );
}