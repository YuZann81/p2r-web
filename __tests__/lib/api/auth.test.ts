import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/api/auth";
import { apiGet, apiPost } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe("Auth API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls /auth/login with credentials", async () => {
    const credentials = { email: "player@example.com", password: "password123" };
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      data: {
        token: "token-123",
        user: { id: 1, name: "Player One", email: "player@example.com" },
      },
    });

    const result = await loginUser(credentials);

    expect(mockedApiPost).toHaveBeenCalledWith("/auth/login", credentials);
    expect(result.data?.token).toBe("token-123");
  });

  it("calls /auth/register with user data", async () => {
    const registerData = {
      name: "New Player",
      email: "new@example.com",
      password: "password123",
    };
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Registration successful",
      data: {
        token: "token-456",
        user: { id: 2, name: "New Player", email: "new@example.com" },
      },
    });

    const result = await registerUser(registerData);

    expect(mockedApiPost).toHaveBeenCalledWith("/auth/register", registerData);
    expect(result.data?.user.name).toBe("New Player");
  });

  it("calls /auth/me with Bearer token", async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "User retrieved",
      data: { id: 1, name: "Player One", email: "player@example.com" },
    });

    const result = await getCurrentUser("token-123");

    expect(mockedApiGet).toHaveBeenCalledWith("/auth/me", { token: "token-123" });
    expect(result.data.name).toBe("Player One");
  });

  it("calls /auth/logout with token", async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Logged out",
      data: null,
    });

    const result = await logoutUser("token-123");

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/auth/logout",
      {},
      { token: "token-123" },
    );
    expect(result.success).toBe(true);
  });
});
