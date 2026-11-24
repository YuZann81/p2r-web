import { fetchChatMessages, sendChatMessage } from "@/lib/api/chat";

describe("Chat API Service", () => {
  it("returns default welcome messages without calling obsolete backend endpoints", async () => {
    const result = await fetchChatMessages("token-123");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].sender).toBe("admin");
  });

  it("returns local formatted ChatMessage without calling obsolete backend endpoints", async () => {
    const result = await sendChatMessage(
      "Saya ingin tanya harga kaos",
      "token-123",
      "Hero",
    );

    expect(result.sender).toBe("user");
    expect(result.sender_name).toBe("Hero");
    expect(result.text).toBe("Saya ingin tanya harga kaos");
  });
});
