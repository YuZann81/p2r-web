import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GamePlaySession from "@/components/GamePlaySession";
import { createGameSession, submitScore } from "@/lib/api/scores";

jest.mock("@/lib/api/scores", () => ({
  createGameSession: jest.fn(),
  submitScore: jest.fn(),
}));

jest.mock("@/lib/auth/auth-context", () => ({
  useAuth: () => ({
    user: { name: "TestPilot" },
    token: "mock-token",
  }),
}));

const mockedCreateGameSession = createGameSession as jest.MockedFunction<
  typeof createGameSession
>;
const mockedSubmitScore = submitScore as jest.MockedFunction<
  typeof submitScore
>;

describe("GamePlaySession Component (Score Flow)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a game session on start and submits score with the session token", async () => {
    mockedCreateGameSession.mockResolvedValueOnce({
      success: true,
      message: "Game session created.",
      data: {
        session_token: "token-xyz-789",
        expires_at: "2026-08-26T12:00:00Z",
      },
    });

    mockedSubmitScore.mockResolvedValueOnce({
      success: true,
      message: "Score saved",
      data: {
        id: "score-100",
        player_name: "TestPilot",
        final_score: 480,
        platform: "web",
        game: { slug: "cyber-runner", name: "Cyber Runner" },
        played_at: "2026-08-26T12:00:00Z",
      },
    });

    render(
      <GamePlaySession
        gameSlug="cyber-runner"
        gameTitle="Cyber Runner 2099"
      />,
    );

    // Click start button
    const startBtn = screen.getByRole("button", {
      name: /mulai main arcade/i,
    });
    fireEvent.click(startBtn);

    // Verify session creation called
    await waitFor(() => {
      expect(mockedCreateGameSession).toHaveBeenCalledWith(
        "cyber-runner",
        "mock-token",
      );
    });

    // Game is now playing: input target text
    const input = await screen.findByLabelText(/input tantangan game/i);
    fireEvent.change(input, {
      target: { value: "PIXEL TO REALITY CYBER ARCADE 2026" },
    });

    // Form appears with calculated score
    const submitBtn = await screen.findByRole("button", {
      name: /kirim skor/i,
    });
    fireEvent.click(submitBtn);

    // Verify submitScore called with the session token received from createGameSession
    await waitFor(() => {
      expect(mockedSubmitScore).toHaveBeenCalledWith(
        "cyber-runner",
        expect.objectContaining({
          session_token: "token-xyz-789",
          player_name: "TestPilot",
          platform: "web",
        }),
        "mock-token",
      );
    });

    // Success screen rendered
    expect(
      await screen.findByText(/skor berhasil tercatat di leaderboard/i),
    ).toBeInTheDocument();
  });

  it("shows error and prevents play when session creation fails", async () => {
    mockedCreateGameSession.mockResolvedValueOnce({
      success: false,
      message: "Game is in maintenance.",
      data: undefined as unknown as { session_token: string; expires_at: string },
    });

    render(
      <GamePlaySession
        gameSlug="cyber-runner"
        gameTitle="Cyber Runner 2099"
      />,
    );

    const startBtn = screen.getByRole("button", {
      name: /mulai main arcade/i,
    });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(mockedCreateGameSession).toHaveBeenCalledTimes(1);
    });

    // Error alert is displayed, input is not rendered
    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(/game is in maintenance/i);
    expect(screen.queryByLabelText(/input tantangan game/i)).not.toBeInTheDocument();
    expect(mockedSubmitScore).not.toHaveBeenCalled();
  });
});
