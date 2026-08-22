export type ChatSender = "user" | "admin" | "system";

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  sender_name?: string;
  text: string;
  created_at: string;
};

export type SendMessagePayload = {
  message: string;
};
