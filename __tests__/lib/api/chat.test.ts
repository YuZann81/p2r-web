import { startChatSession, sendChatMessage, endChatSession } from "@/lib/api/chat";
import { apiPost, apiDelete } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiPost: jest.fn(),
  apiDelete: jest.fn(),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockedApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

describe("Chat API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts chat session and returns formatted ChatSession and messages", async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Chat session started.",
      data: {
        session: {
          id: 1,
          guest_name: "Hero",
          guest_email: "hero@example.com",
          topic: "Pameran",
          status: "active",
          session_token: "token-abc-123",
          created_at: "2026-08-23T10:00:00Z",
          updated_at: "2026-08-23T10:00:00Z",
        },
        messages: [
          {
            id: 1,
            chat_session_id: 1,
            sender_type: "admin",
            sender_id: null,
            message: "Halo Hero!",
            attachment_url: null,
            created_at: "2026-08-23T10:00:00Z",
          },
        ],
      },
    });

    const result = await startChatSession({
      guest_name: "Hero",
      guest_email: "hero@example.com",
      topic: "Pameran",
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/chat/session",
      {
        guest_name: "Hero",
        guest_email: "hero@example.com",
        topic: "Pameran",
      },
      { token: undefined },
    );
    expect(result.session.session_token).toBe("token-abc-123");
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toBe("Halo Hero!");
  });

  it("sends chat message with session_token and returns formatted ChatMessage", async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Message sent",
      data: {
        id: 101,
        chat_session_id: 1,
        sender_type: "guest",
        sender_id: null,
        message: "Saya ingin tanya harga kaos",
        attachment_url: null,
        created_at: "2026-08-23T10:05:00Z",
      },
    });

    const result = await sendChatMessage("token-abc-123", "Saya ingin tanya harga kaos", "Hero");

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/chat/send",
      { session_token: "token-abc-123", message: "Saya ingin tanya harga kaos" },
      { token: undefined },
    );
    expect(result.text).toBe("Saya ingin tanya harga kaos");
    expect(result.sender).toBe("user");
  });

  it("ends chat session cleanly", async () => {
    mockedApiDelete.mockResolvedValueOnce({
      success: true,
      message: "Session ended",
      data: null,
    });

    await endChatSession("token-abc-123");
    expect(mockedApiDelete).toHaveBeenCalledWith("/chat/session/token-abc-123");
  });
});
