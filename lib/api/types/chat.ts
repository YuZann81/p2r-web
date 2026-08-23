export type ChatSender = "user" | "admin" | "system";

export type ChatMessage = {
  id: string | number;
  chat_session_id?: number;
  sender: ChatSender;
  sender_name?: string;
  text: string;
  attachment_url?: string | null;
  created_at: string;
};

export type ChatSession = {
  id: number;
  guest_name: string;
  guest_email?: string | null;
  topic?: string | null;
  status: "active" | "closed" | string;
  session_token: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
};

export type StartSessionPayload = {
  guest_name: string;
  guest_email?: string | null;
  topic?: string | null;
};

export type SendMessagePayload = {
  session_token: string;
  message: string;
  attachment_url?: string | null;
};
