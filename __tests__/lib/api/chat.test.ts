import { fetchChatMessages, sendChatMessage } from "@/lib/api/chat";
import { apiGet, apiPost } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe("Chat API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches chat messages from API or fallback welcome messages", async () => {
    const mockMessages = [
      {
        id: "msg-1",
        sender: "admin" as const,
        text: "Custom admin message",
        created_at: "2026-08-22T10:00:00Z",
      },
    ];

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Messages retrieved",
      data: mockMessages,
    });

    const result = await fetchChatMessages("token-123");

    expect(mockedApiGet).toHaveBeenCalledWith("/chat/messages", {
      token: "token-123",
    });
    expect(result).toEqual(mockMessages);
  });

  it("sends chat message and returns formatted ChatMessage", async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Message sent",
      data: {
        id: "msg-101",
        sender: "user" as const,
        sender_name: "Hero",
        text: "Saya ingin tanya harga kaos",
        created_at: "2026-08-22T10:05:00Z",
      },
    });

    const result = await sendChatMessage("Saya ingin tanya harga kaos", "token-123", "Hero");

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/chat/send",
      { message: "Saya ingin tanya harga kaos" },
      { token: "token-123" },
    );
    expect(result.text).toBe("Saya ingin tanya harga kaos");
  });
});
