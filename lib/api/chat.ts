import { apiGet, apiPost, apiDelete } from "@/lib/api/client";
import type {
  ChatMessage,
  ChatSession,
  StartSessionPayload,
  SendMessagePayload,
} from "@/lib/api/types/chat";

export type {
  ChatMessage,
  ChatSender,
  ChatSession,
  StartSessionPayload,
  SendMessagePayload,
} from "@/lib/api/types/chat";

export const DEFAULT_WELCOME_MESSAGES: ChatMessage[] = [
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

export async function fetchChatMessages(): Promise<ChatMessage[]> {
  return DEFAULT_WELCOME_MESSAGES;
}

export async function getActiveChatSession(
  token?: string | null,
): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
  try {
    const res = await apiGet<{
      session: ChatSession;
      messages: Array<{
        id: number;
        chat_session_id: number;
        sender_type: string;
        sender_id: number | null;
        message: string;
        attachment_url: string | null;
        created_at: string;
      }>;
    } | null>("/chat/active", { token });

    if (!res.data || !res.data.session) {
      return null;
    }

    const session = res.data.session;
    const rawMessages = res.data.messages || [];

    const messages: ChatMessage[] = rawMessages.map((m) => ({
      id: m.id,
      chat_session_id: m.chat_session_id,
      sender: m.sender_type === "admin" ? "admin" : "user",
      sender_name: m.sender_type === "admin" ? "Admin P2R" : session.guest_name,
      text: m.message,
      attachment_url: m.attachment_url,
      created_at: m.created_at,
    }));

    return { session, messages };
  } catch (err) {
    console.warn("[p2r-api] Failed to fetch active chat session:", err);
    return null;
  }
}

export async function startChatSession(
  payload: StartSessionPayload,
  token?: string | null,
): Promise<{ session: ChatSession; messages: ChatMessage[] }> {
  const res = await apiPost<{
    session: ChatSession;
    messages: Array<{
      id: number;
      chat_session_id: number;
      sender_type: string;
      sender_id: number | null;
      message: string;
      attachment_url: string | null;
      created_at: string;
    }>;
  }, StartSessionPayload>("/chat/session", payload, { token });

  const session = res.data.session;
  const rawMessages = res.data.messages || [];

  const messages: ChatMessage[] = rawMessages.map((m) => ({
    id: m.id,
    chat_session_id: m.chat_session_id,
    sender: m.sender_type === "admin" ? "admin" : "user",
    sender_name: m.sender_type === "admin" ? "Admin P2R" : payload.guest_name,
    text: m.message,
    attachment_url: m.attachment_url,
    created_at: m.created_at,
  }));

  return { session, messages };
}

export async function sendChatMessage(
  sessionToken: string,
  message: string,
  userName?: string | null,
  token?: string | null,
): Promise<ChatMessage> {
  const res = await apiPost<{
    id: number;
    chat_session_id: number;
    sender_type: string;
    sender_id: number | null;
    message: string;
    attachment_url: string | null;
    created_at: string;
  }, SendMessagePayload>(
    "/chat/send",
    {
      session_token: sessionToken,
      message,
    },
    { token },
  );

  const m = res.data;
  return {
    id: m.id,
    chat_session_id: m.chat_session_id,
    sender: m.sender_type === "admin" ? "admin" : "user",
    sender_name: m.sender_type === "admin" ? "Admin P2R" : (userName || "Player"),
    text: m.message,
    attachment_url: m.attachment_url,
    created_at: m.created_at,
  };
}

export async function endChatSession(sessionToken: string): Promise<void> {
  try {
    await apiDelete(`/chat/session/${sessionToken}`);
  } catch {
    // ignore
  }
}
