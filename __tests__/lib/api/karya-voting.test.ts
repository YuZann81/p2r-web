import { voteKarya, unvoteKarya } from "@/lib/api/karya";
import { apiDelete, apiPost } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiDelete: jest.fn(),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockedApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

describe("Karya Voting API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls POST /karyas/{slug}/vote with auth token", async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Vote recorded",
      data: { votes_count: 10, is_voted_by_me: true },
    });

    const res = await voteKarya("cyber-runner", "sample-token-123");

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/karyas/cyber-runner/vote",
      {},
      { token: "sample-token-123" },
    );
    expect(res.data.votes_count).toBe(10);
  });

  it("calls DELETE /karyas/{slug}/vote with auth token", async () => {
    mockedApiDelete.mockResolvedValueOnce({
      success: true,
      message: "Vote cancelled",
      data: { votes_count: 9, is_voted_by_me: false },
    });

    const res = await unvoteKarya("cyber-runner", "sample-token-123");

    expect(mockedApiDelete).toHaveBeenCalledWith(
      "/karyas/cyber-runner/vote",
      { token: "sample-token-123" },
    );
    expect(res.data.votes_count).toBe(9);
  });
});
