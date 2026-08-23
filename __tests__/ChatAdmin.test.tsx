import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChatAdminModal from "@/components/ChatAdmin";
import { AuthProvider } from "@/lib/auth/auth-context";
import {
  getActiveChatSession,
  startChatSession,
  sendChatMessage,
  endChatSession,
} from "@/lib/api/chat";
import { useRouter } from "next/navigation";

jest.mock("@/lib/api/chat", () => {
  const actual = jest.requireActual("@/lib/api/chat");
  return {
    ...actual,
    DEFAULT_WELCOME_MESSAGES: [
      {
        id: "welcome-1",
        sender: "admin",
        sender_name: "Admin P2R",
        text: "Selamat datang di pameran!",
        created_at: new Date().toISOString(),
      },
    ],
    getActiveChatSession: jest.fn(),
    startChatSession: jest.fn(),
    sendChatMessage: jest.fn(),
    endChatSession: jest.fn(),
  };
});

jest.mock("@/lib/echo", () => ({
  getEcho: jest.fn(() => null),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedGetActiveChatSession = getActiveChatSession as jest.MockedFunction<
  typeof getActiveChatSession
>;
const mockedStartChatSession = startChatSession as jest.MockedFunction<
  typeof startChatSession
>;
const mockedSendChatMessage = sendChatMessage as jest.MockedFunction<
  typeof sendChatMessage
>;
const mockedEndChatSession = endChatSession as jest.MockedFunction<
  typeof endChatSession
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

  it("renders input and sends message when authenticated with single message reconciliation", async () => {
    mockedGetActiveChatSession.mockResolvedValue(null);
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
        "sample-token",
      );
      expect(
        screen.getByText("Apakah merchandise kaos masih ada?"),
      ).toBeInTheDocument();
    });
  });

  it("shows inline validation error when submitting empty input", async () => {
    mockedGetActiveChatSession.mockResolvedValue(null);
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
      messages: [],
    });

    render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );

    const form = screen.getByRole("dialog").querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    expect(await screen.findByText("Pesan tidak boleh kosong.")).toBeInTheDocument();
    expect(mockedSendChatMessage).not.toHaveBeenCalled();
  });

  it("shows inline error with retry button on send failure", async () => {
    mockedGetActiveChatSession.mockResolvedValue(null);
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
      messages: [],
    });

    mockedSendChatMessage.mockRejectedValueOnce(new Error("Network connection error"));

    render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );

    const input = await screen.findByPlaceholderText(/tulis pesan ke admin/i);
    const sendButton = screen.getByRole("button", { name: /kirim pesan/i });

    fireEvent.change(input, { target: { value: "Pesan gagal kirim" } });
    fireEvent.click(sendButton);

    expect(
      await screen.findByText(/gagal mengirim pesan\. periksa koneksi dan coba lagi/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /coba lagi/i })).toBeInTheDocument();
  });

  it("opens CustomDialog on close session and calls endChatSession on confirm", async () => {
    mockedGetActiveChatSession.mockResolvedValue({
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
      messages: [],
    });

    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Player One", email: "player@example.com" }),
    );

    mockedEndChatSession.mockResolvedValue();

    render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );

    const closeSessionBtn = await screen.findByRole("button", {
      name: /akhiri sesi percakapan/i,
    });
    fireEvent.click(closeSessionBtn);

    expect(await screen.findByText("Tutup Percakapan?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /tutup percakapan/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockedEndChatSession).toHaveBeenCalledWith("session-token-abc");
    });
  });

  it("renders closed session state and allows starting a new session", async () => {
    mockedGetActiveChatSession.mockResolvedValue({
      session: {
        id: 1,
        guest_name: "Player One",
        guest_email: "player@example.com",
        topic: "Live Support P2R",
        status: "closed",
        session_token: "session-token-closed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      messages: [],
    });

    mockedStartChatSession.mockResolvedValue({
      session: {
        id: 2,
        guest_name: "Player One",
        guest_email: "player@example.com",
        topic: "Live Support P2R",
        status: "active",
        session_token: "session-token-new",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      messages: [],
    });

    localStorage.setItem("p2r_auth_token", "sample-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({ id: 1, name: "Player One", email: "player@example.com" }),
    );

    render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("Percakapan telah ditutup oleh Customer Service."),
    ).toBeInTheDocument();

    const startNewBtn = screen.getByRole("button", {
      name: /mulai percakapan baru/i,
    });
    expect(startNewBtn).toBeInTheDocument();

    fireEvent.click(startNewBtn);

    await waitFor(() => {
      expect(mockedStartChatSession).toHaveBeenCalledWith(
        {
          guest_name: "Player One",
          guest_email: "player@example.com",
          topic: "Live Support P2R",
        },
        "sample-token",
      );
    });
  });
});
