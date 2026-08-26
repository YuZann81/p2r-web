import { createGameSession, submitScore } from "@/lib/api/scores";
import { apiPost } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiPost: jest.fn(),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe("Scores API service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createGameSession", () => {
    it("calls POST /games/{slug}/sessions and returns session token", async () => {
      mockedApiPost.mockResolvedValueOnce({
        success: true,
        message: "Game session created.",
        data: {
          session_token: "session-abc-123",
          expires_at: "2026-08-26T12:00:00Z",
        },
      });

      const res = await createGameSession("cyber-runner");

      expect(mockedApiPost).toHaveBeenCalledWith(
        "/games/cyber-runner/sessions",
        {},
        { token: undefined },
      );
      expect(res.data?.session_token).toBe("session-abc-123");
    });

    it("encodes game slug properly in URL", async () => {
      mockedApiPost.mockResolvedValueOnce({
        success: true,
        message: "Game session created.",
        data: {
          session_token: "tok-1",
          expires_at: "2026-08-26T12:00:00Z",
        },
      });

      await createGameSession("game with space");

      expect(mockedApiPost).toHaveBeenCalledWith(
        "/games/game%20with%20space/sessions",
        {},
        { token: undefined },
      );
    });
  });

  describe("submitScore", () => {
    it("calls POST /games/{slug}/scores with session_token and payload", async () => {
      mockedApiPost.mockResolvedValueOnce({
        success: true,
        message: "Score recorded.",
        data: {
          id: "score-1",
          player_name: "CyberNeo",
          final_score: 850,
          platform: "web",
          meta: { challenge: "speed_typing" },
          game: { slug: "cyber-runner", name: "Cyber Runner" },
          played_at: "2026-08-26T12:05:00Z",
        },
      });

      const payload = {
        session_token: "session-abc-123",
        player_name: "CyberNeo",
        final_score: 850,
        platform: "web" as const,
        meta: { challenge: "speed_typing" },
      };

      const res = await submitScore("cyber-runner", payload);

      expect(mockedApiPost).toHaveBeenCalledWith(
        "/games/cyber-runner/scores",
        payload,
        { token: undefined },
      );
      expect(res.data?.player_name).toBe("CyberNeo");
      expect(res.data?.final_score).toBe(850);
    });
  });
});
