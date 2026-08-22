"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { fetchChatMessages, sendChatMessage, type ChatMessage } from "@/lib/api/chat";

type ChatAdminModalProps = {
  onClose: () => void;
};

const CHAT_STORAGE_KEY = "p2r_live_chat_history";

export default function ChatAdminModal({ onClose }: ChatAdminModalProps) {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const replyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  // Load chat history on mount
  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      // 1. Try local storage first for persisted conversation
      try {
        const localData = localStorage.getItem(CHAT_STORAGE_KEY);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setMessages(parsed);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // ignore parse error
      }

      // 2. Fetch from backend service
      const fetched = await fetchChatMessages(token);
      if (isMounted) {
        setMessages(Array.isArray(fetched) ? fetched : []);
        setIsLoading(false);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
      if (replyTimerRef.current) {
        clearTimeout(replyTimerRef.current);
      }
    };
  }, [token]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

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

    const sentMessage = await sendChatMessage(text, token, user?.name);
    setMessages((prev) => (Array.isArray(prev) ? [...prev, sentMessage] : [sentMessage]));
    setIsSending(false);

    // Automated smart assistant acknowledgement if in offline mode
    replyTimerRef.current = setTimeout(() => {
      const adminReply: ChatMessage = {
        id: "reply-" + Date.now(),
        sender: "admin",
        sender_name: "Admin P2R",
        text: `Terima kasih atas pesannya, ${user?.name || "Player"}! Pesan kamu telah diterima oleh tim CS Pixel To Reality.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => (Array.isArray(prev) ? [...prev, adminReply] : [adminReply]));
    }, 1000);
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
        <div className="bg-white/95 px-6 py-4 flex justify-between items-center border-b border-black/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-arcade-violet text-arcade-yellow font-display font-bold text-lg">
              CS
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>
            <div>
              <h3 className="text-arcade-ink font-display font-bold text-lg leading-tight">
                Admin Support P2R
              </h3>
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
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3.5 bg-black/15">
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
                  className={`flex flex-col max-w-[80%] ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                      isUser
                        ? "bg-arcade-yellow text-arcade-ink font-semibold rounded-br-xs"
                        : "bg-arcade-purple/90 border border-white/10 text-white rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 font-display text-[10px] text-white/50 px-1">
                    {msg.sender_name || (isUser ? "Kamu" : "Admin")} •{" "}
                    {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
        </div>

        {/* Footer / Input Area */}
        <div className="p-4 border-t border-white/15 bg-black/30 flex-shrink-0">
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