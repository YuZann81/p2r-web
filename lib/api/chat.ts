import { apiGet, apiPost } from "@/lib/api/client";
import type { ChatMessage, SendMessagePayload } from "@/lib/api/types/chat";

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
    text: "Ada yang bisa kami bantu seputar pameran karya, jadwal voting, atau pembelian merchandise resmi?",
    created_at: new Date().toISOString(),
  },
];

export async function fetchChatMessages(
  token?: string | null,
): Promise<ChatMessage[]> {
  try {
    const payload = await apiGet<ChatMessage[]>("/chat/messages", {
      token: token || null,
    });

    if (Array.isArray(payload.data) && payload.data.length > 0) {
      return payload.data;
    }
  } catch {
    // Return default welcome message if endpoint is offline or unavailable
  }

  return DEFAULT_WELCOME_MESSAGES;
}

export async function sendChatMessage(
  message: string,
  token?: string | null,
  userName?: string | null,
): Promise<ChatMessage> {
  const userMsg: ChatMessage = {
    id: "msg-" + Date.now(),
    sender: "user",
    sender_name: userName || "Player",
    text: message,
    created_at: new Date().toISOString(),
  };

  try {
    const payload = await apiPost<ChatMessage, SendMessagePayload>(
      "/chat/send",
      { message },
      { token: token || null },
    );

    if (payload.data) {
      return payload.data;
    }
  } catch {
    // If backend chat route is not available, return the created message directly
  }

  return userMsg;
}
