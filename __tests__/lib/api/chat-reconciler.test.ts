import { reconcileMessages, type ChatMessage } from "@/lib/api/chat";

describe("reconcileMessages (Single Message Deduplication & Reconciliation)", () => {
  it("deduplicates identical message IDs from HTTP response and WebSocket broadcast", () => {
    const existing: ChatMessage[] = [
      {
        id: 100,
        chat_session_id: 1,
        sender: "admin",
        sender_name: "Admin P2R",
        text: "Halo!",
        created_at: "2026-08-23T10:00:00Z",
      },
    ];

    // HTTP response arrives
    const httpMsg: ChatMessage = {
      id: 101,
      chat_session_id: 1,
      sender: "user",
      sender_name: "Player One",
      text: "Apakah kaos ready?",
      created_at: "2026-08-23T10:01:00Z",
    };
    const step1 = reconcileMessages(existing, httpMsg);
    expect(step1).toHaveLength(2);

    // WebSocket event arrives with identical ID (e.g. 101)
    const wsMsg: ChatMessage = {
      id: "101", // even if string format
      chat_session_id: 1,
      sender: "user",
      sender_name: "Player One",
      text: "Apakah kaos ready?",
      created_at: "2026-08-23T10:01:00Z",
    };
    const step2 = reconcileMessages(step1, wsMsg);

    // MUST remain exactly 2 messages (NO DUPLICATE BUBBLE)
    expect(step2).toHaveLength(2);
    expect(step2[1].id).toBe("101");
    expect(step2[1].text).toBe("Apakah kaos ready?");
  });

  it("appends different message IDs correctly", () => {
    const existing: ChatMessage[] = [
      {
        id: 101,
        sender: "user",
        text: "Pesan A",
        created_at: "2026-08-23T10:00:00Z",
      },
    ];

    const newMsg: ChatMessage = {
      id: 102,
      sender: "admin",
      text: "Pesan B",
      created_at: "2026-08-23T10:01:00Z",
    };

    const result = reconcileMessages(existing, newMsg);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(101);
    expect(result[1].id).toBe(102);
  });

  it("reconciles optimistic temporary message with server response", () => {
    const existing: ChatMessage[] = [
      {
        id: "temp-12345",
        sender: "user",
        text: "Pesan Optimistic",
        created_at: "2026-08-23T10:00:00Z",
      },
    ];

    const serverMsg: ChatMessage = {
      id: 200,
      sender: "user",
      text: "Pesan Optimistic",
      created_at: "2026-08-23T10:00:01Z",
    };

    const result = reconcileMessages(existing, serverMsg);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(200);
    expect(result[0].text).toBe("Pesan Optimistic");
  });

  it("handles batch message reconciliation cleanly", () => {
    const existing: ChatMessage[] = [
      { id: 1, sender: "admin", text: "M1", created_at: "2026-08-23T10:00:00Z" },
    ];
    const incoming: ChatMessage[] = [
      { id: 1, sender: "admin", text: "M1-Updated", created_at: "2026-08-23T10:00:00Z" },
      { id: 2, sender: "user", text: "M2", created_at: "2026-08-23T10:01:00Z" },
      { id: 3, sender: "admin", text: "M3", created_at: "2026-08-23T10:02:00Z" },
    ];

    const result = reconcileMessages(existing, incoming);
    expect(result).toHaveLength(3);
    expect(result[0].text).toBe("M1-Updated");
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
  });
});
