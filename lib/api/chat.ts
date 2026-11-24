import type { ChatMessage } from "@/lib/api/types/chat";

export type { ChatMessage, ChatSender, SendMessagePayload } from "@/lib/api/types/chat";

const DEFAULT_WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "admin",
    sender_name: "Admin P2R",
    text: "Halo! Selamat datang di Pixel To Reality: The Cyber Arcade 🕹️",
    created_at: new Date().toISOString(),
  },
  {
    id: "welcome-2",
    sender: "admin",
    sender_name: "Admin P2R",
    text: "Ada yang bisa kami bantu seputar pameran karya, jadwal voting, atau informasi merchandise resmi?",
    created_at: new Date().toISOString(),
  },
];

/**
 * Backend chat endpoints (`/chat/messages`, `/chat/send`) are not part of the
 * production API contract; return local welcome messages without issuing 404s.
 */
export async function fetchChatMessages(
  _token?: string | null,
): Promise<ChatMessage[]> {
  void _token;
  return DEFAULT_WELCOME_MESSAGES;
}

export async function sendChatMessage(
  message: string,
  _token?: string | null,
  userName?: string | null,
): Promise<ChatMessage> {
  void _token;
  return {
    id: "msg-" + Date.now(),
    sender: "user",
    sender_name: userName || "Player",
    text: message,
    created_at: new Date().toISOString(),
  };
}
