import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChatAdminModal from "@/components/ChatAdmin";
import { AuthProvider } from "@/lib/auth/auth-context";
import { startChatSession, sendChatMessage } from "@/lib/api/chat";
import { useRouter } from "next/navigation";

jest.mock("@/lib/api/chat", () => ({
  DEFAULT_WELCOME_MESSAGES: [
    {
      id: "welcome-1",
      sender: "admin",
      sender_name: "Admin P2R",
      text: "Selamat datang di pameran!",
      created_at: new Date().toISOString(),
    },
  ],
  startChatSession: jest.fn(),
  sendChatMessage: jest.fn(),
}));

jest.mock("@/lib/echo", () => ({
  getEcho: jest.fn(() => null),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedStartChatSession = startChatSession as jest.MockedFunction<
  typeof startChatSession
>;
const mockedSendChatMessage = sendChatMessage as jest.MockedFunction<
  typeof sendChatMessage
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("ChatAdminModal", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      bfcacheId: "",
    });
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("renders modal header and guest login prompt when unauthenticated", async () => {
    render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );

    expect(screen.getByText("Admin Support P2R")).toBeInTheDocument();
    expect(
      await screen.findByText("Selamat datang di pameran!"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/masuk ke akun anda untuk mengirim pesan ke admin/i),
    ).toBeInTheDocument();
  });

  it("renders input and sends message when authenticated", async () => {
    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Player One", email: "player@example.com" }),
    );

    mockedStartChatSession.mockResolvedValue({
      session: {
        id: 1,
        guest_name: "Player One",
        guest_email: "player@example.com",
        topic: "Live Support P2R",
        status: "active",
        session_token: "session-token-abc",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      messages: [
        {
          id: 1,
          sender: "admin",
          sender_name: "Admin P2R",
          text: "Halo!",
          created_at: new Date().toISOString(),
        },
      ],
    });

    mockedSendChatMessage.mockResolvedValue({
      id: "msg-2",
      sender: "user",
      sender_name: "Player One",
      text: "Apakah merchandise kaos masih ada?",
      created_at: new Date().toISOString(),
    });

    render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );

    expect(await screen.findByText("Halo!")).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/tulis pesan ke admin/i);
    const sendButton = screen.getByRole("button", { name: /kirim pesan/i });

    fireEvent.change(input, {
      target: { value: "Apakah merchandise kaos masih ada?" },
    });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockedSendChatMessage).toHaveBeenCalledWith(
        "session-token-abc",
        "Apakah merchandise kaos masih ada?",
        "Player One",
      );
      expect(
        screen.getByText("Apakah merchandise kaos masih ada?"),
      ).toBeInTheDocument();
    });
  });
});
